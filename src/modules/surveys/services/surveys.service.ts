import { ForbiddenException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateSurveyDto } from '../dto/create-survey.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { GetSurveyPaginationDto } from '../dto/get-survey-pagination.dto';
import { PaginationHelper } from 'src/config/helper/pagination/pagination.helper';
import { UsersService } from 'src/modules/users/users.service';
import { UserRoleEnum } from 'src/modules/users/enums/user.role.enum.ts';
import { SurveyLogsTypeEnum } from '../enums/survey-logs.type.enum';
import { SurveyStatusEnum } from '../enums/survey.status.enum';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { GetSurveyOneDto } from '../dto/get-survey-one.dto';
import { CreateCustomerDto } from 'src/modules/customers/dto/create-customer.dto';
import { SurveyTypeEnum } from '../enums/survey.type.enum';

@Injectable()
export class SurveysService {

  constructor(
    private userService: UsersService,
    private dataSource: DataSource,
    @InjectRepository(SurveysEntity) private readonly requestRepository: Repository<SurveysEntity>,
    @InjectRepository(SurveyLogsEntity) private readonly requestLogRepository: Repository<SurveyLogsEntity>,
  ) { }

  async validateIsCustomerVerified(customerId: number) {
    const verified = await this.userService.isUserVerified(customerId);
    if (!verified) {
      throw new UnprocessableEntityException('Customer must be verified.');
    }
  }

  async validateCustomerDriver(customerId?: number, driverId?: number | number[]) {
    if (customerId) {
      const customerExist = await this.userService.checkUserRole(customerId, UserRoleEnum.CUSTOMER);
      if (!customerExist) {
        throw new UnprocessableEntityException('Could not find customer.');
      }
    }

    if (driverId) {
      if (Array.isArray(driverId)) {
        return Promise.all(driverId.map(async id => {
          const driverExist = await this.userService.checkUserRole(id, UserRoleEnum.DRIVER);
          if (!driverExist) {
            throw new UnprocessableEntityException('Could not find driver.');
          }
        }));
      } else {
        const driverExist = await this.userService.checkUserRole(driverId, UserRoleEnum.DRIVER);
        if (!driverExist) {
          throw new UnprocessableEntityException('Could not find driver.');
        }
      }
    }
  }

  async updatePaperPartner(user: UserEntity) {
    return this.userService.updatePaperPartner(user.paper_id, user.paper_number, user);
  }

  async createPaperPartnerIfNotExist(customerId: number) {
    return this.userService.createPaperPartnerIfNotExist(customerId);
  }

  async getCustomer(customerId: number) {
    return this.userService.findOne(customerId, true);
  }

  // TODO: Implement fleet availability validation
  async create(dto: CreateSurveyDto) {
    await this.validateCustomerDriver(dto.customer_id, dto.driver_id);

    const request = await this.requestRepository.save(new SurveysEntity(dto));

    await this.notificationService.createNotification(
      NotificationTypeEnum['request.create'],
      request.id,
      dto.driver_id,
    );

    await this.clearSurveyCachecount();

    return request;
  }

  findAll(dto: GetSurveyPaginationDto, driverId?: number) {
    const builder = this.requestRepository.createQueryBuilder('r')
      .orderBy('r.id', 'DESC');

    this.appendJoin(builder);

    builder.andWhere('r.driver_id IS NOT NULL');

    if (dto.status) {
      builder.andWhere('r.status = :status', { status: dto.status });
    }

    if (driverId) {
      builder.andWhere('r.driver_id = :driverId', { driverId });
    }

    if (dto.q && dto.q !== '') {
      builder
        .andWhere(new Brackets(qb => {
          qb.where('LOWER(customer.name) LIKE LOWER(:q)', { q: `%${dto.q}%` })
            .orWhere('LOWER(driver.name) LIKE LOWER(:q)', { q: `%${dto.q}%` })
            .orWhere('LOWER(fleet.name) LIKE LOWER(:q)', { q: `%${dto.q}%` });
        }));
    }

    if (dto.start_date && dto.end_date) {
      builder.andWhere('r.start_date BETWEEN :start_date AND :end_date', {
        start_date: dto.start_date,
        end_date: dto.end_date,
      });
    }

    return PaginationHelper.pagination(builder, dto);
  }

  async findOne(id: number, dto: GetSurveyOneDto) {
    const builder = this.requestRepository.createQueryBuilder('r')
      .where('r.id = :id', { id });

    this.appendJoin(builder, true);

    const request = await builder.getOne();
    if (!request) {
      throw new NotFoundException('Could not find request.');
    }

    if (dto.with_related_requests == 'true') {
      const relatedSurveys = this.requestRepository.createQueryBuilder('r')
        .where('(r.fleet_id = :fleetId OR order.fleet_id = :fleetId)', { fleetId: request.fleet_id ?? request.order?.fleet_id })
        .andWhere('r.status = :status', { status: SurveyStatusEnum.DONE });

      this.appendJoin(relatedSurveys);

      request.related_requests = await relatedSurveys
        .limit(3)
        .orderBy('r.id', 'DESC')
        .getMany();
    } else {
      request.related_requests = null;
    }

    return request;
  }

  private appendJoin(builder: SelectQueryBuilder<SurveysEntity>, isDetail = false) {
    builder
      .withDeleted()
      .leftJoinAndSelect('r.customer', 'customer')
      .leftJoinAndSelect('r.driver', 'driver')
      .leftJoinAndSelect('r.fleet', 'fleet')
      .andWhere('r.deleted_at IS NULL');

    builder
      .withDeleted()
      .leftJoinAndSelect('r.order', 'order')
      .leftJoinAndSelect('order.customer', 'order_customer')
      .leftJoinAndSelect('order.fleet', 'order_fleet')
      .andWhere('r.deleted_at IS NULL');

    builder.leftJoinAndSelect('r.logs', 'logs');

    if (isDetail) {
      builder
        .leftJoinAndSelect('logs.photos', 'logs_photos', 'logs_photos.deleted_at IS NULL')
        .leftJoinAndSelect('fleet.photos', 'fleet_photos', 'fleet_photos.deleted_at IS NULL')
        .leftJoinAndSelect('customer.id_cards', 'customer_id_cards', 'customer_id_cards.deleted_at IS NULL')
        .addSelect('customer.phone_number', 'customer_phone_number')
        .addSelect('customer.emergency_phone_number', 'customer_emergency_phone_number');

      builder
        .leftJoinAndSelect('order_fleet.photos', 'order_fleet_photos', 'order_fleet_photos.deleted_at IS NULL')
        .leftJoinAndSelect('order_customer.id_cards', 'order_customer_id_cards', 'order_customer_id_cards.deleted_at IS NULL')
        .addSelect('order_customer.phone_number', 'order_customer_phone_number')
        .addSelect('order_customer.emergency_phone_number', 'order_customer_emergency_phone_number');
    } else {
      builder
        .leftJoinAndMapOne('fleet.photo', 'fleet.photos', 'fleet_photo', 'fleet_photo.deleted_at IS NULL')
        .leftJoinAndMapOne('order_fleet.photo', 'order_fleet.photos', 'order_fleet_photo', 'order_fleet_photo.deleted_at IS NULL');
    }

    return builder;
  }

  async update(id: number, dto: UpdateSurveyDto) {
    await this.validateCustomerDriver(dto.customer_id, dto.driver_id);

    if (dto.driver_id || dto.start_date) {
      const request = await this.requestRepository.createQueryBuilder('r')
        .addSelect('r.driver_id')
        .getOne();

      // Add notification if driver changed
      if (dto.driver_id && request.driver_id != dto.driver_id) {
        await this.notificationService.createNotification(
          NotificationTypeEnum['request.create'],
          id,
          dto.driver_id,
        );
      }
      // Add notification if start date changed
      else if (dto.start_date && (new Date(request.start_date)).getTime() !== (new Date(dto.start_date).getTime())) {
        await this.notificationService.createNotification(
          NotificationTypeEnum['request.update'],
          id,
          request.driver_id,
        );
      }
    }

    return this.requestRepository.update(id, new SurveysEntity(dto));
  }

  async removeByOrderId(orderId: number) {
    await this.clearSurveyCachecount();

    return this.requestRepository.softDelete({ order_id: orderId });
  }

  async remove(id: number) {
    await this.clearSurveyCachecount();

    return this.requestRepository.softDelete({ id });
  }

  async log(user: UserEntity, id: number, dto: CreateSurveyLogDto) {
    if (dto.type === SurveyLogsTypeEnum.END && (!dto.photos || dto.photos.length == 0)) {
      throw new UnprocessableEntityException('Photos are required for end request.');
    }

    const request = await this.requestRepository.createQueryBuilder('r')
      .where('r.id = :id', { id })
      .addSelect('r.driver_id')
      .leftJoinAndSelect('r.order', 'order')
      .leftJoinAndSelect('order.requests', 'order_requests')
      .getOne();

    if (!request) {
      throw new NotFoundException('Survey not found.');
    } else if (request.driver_id != user.id) {
      throw new ForbiddenException('You do not have access for this request.');
    } else if (request.order?.requests?.length > 1) {
      const startSurvey = request.order.requests.find(o => o.type === SurveyTypeEnum.DELIVERY);
      if (startSurvey && startSurvey?.status !== SurveyStatusEnum.DONE) {
        throw new UnprocessableEntityException('Start request must be done first.');
      }
    }

    await this.validateSurveyStatus(request, dto.type);

    if (dto.type === SurveyLogsTypeEnum.START) {
      await this.updateSurveyStatus(id, SurveyStatusEnum.ON_PROGRESS);
    } else {
      await this.updateSurveyStatus(id, SurveyStatusEnum.DONE);
    }

    await this.clearSurveyCachecount();

    return this.requestLogRepository.save(new SurveyLogsEntity({
      ...dto,
      request_id: id,
      photos: dto.photos ? dto.photos.map(photo => new SurveyLogPhotosEntity({ photo })) : [],
    }));
  }

  private async clearSurveyCachecount() {
    await this.dataSource.queryResultCache.remove([REQUEST_CACHE_COUNT_KEY]);
  }

  private updateSurveyStatus(id: number, status: SurveyStatusEnum) {
    return this.requestRepository.update(id, { status });
  }

  private async validateSurveyStatus(request: SurveysEntity, status: SurveyLogsTypeEnum) {
    if (status == SurveyLogsTypeEnum.END && !request.is_self_pickup) {
      const logExist = this.statusLogExist(request.id, SurveyLogsTypeEnum.START);
      if (!logExist) {
        throw new UnprocessableEntityException('Must start the request first.');
      }
    }

    if (request.status === SurveyStatusEnum.ON_PROGRESS && status === SurveyLogsTypeEnum.START) {
      throw new UnprocessableEntityException('Survey already started.');
    } else if (request.status === SurveyStatusEnum.DONE) {
      throw new UnprocessableEntityException('Survey already ended.');
    }
  }

  private statusLogExist(id, type: SurveyLogsTypeEnum) {
    return this.requestLogRepository.findOne({ where: { request_id: id, type } });
  }

  async getStatusCount() {
    const result = await this.requestRepository
      .createQueryBuilder('r')
      .select('r.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('r.deleted_at IS NULL')
      .groupBy('status')
      .cache(REQUEST_CACHE_COUNT_KEY, REQUEST_CACHE_TTL)
      .getRawMany();

    return result.reduce((acc, item) => {
      acc[item.status] = +item.count;
      return acc;
    }, {});
  }

  async createCustomer(dto: CreateCustomerDto) {
    return this.userService.create(new UserEntity({
      ...dto,
      id_cards: dto.id_cards.map(idCard => new UserIdCards({ photo: idCard })),
      role: UserRoleEnum.CUSTOMER,
    }));
  }
}
