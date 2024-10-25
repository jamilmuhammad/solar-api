import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/entities/user.entity';
import { GetCustomerPaginationDto } from './dto/get-customer-pagination.dto';
import { UserRoleEnum } from 'src/modules/users/enums/user.role.enum.ts';
import { UserIdCards } from '../users/entities/user-id-cards.entity';
import { UserStatusEnum } from '../users/enums/user.status.enum';

@Injectable()
export class CustomersService {

  constructor(
    private usersService: UsersService,
  ) { }

  create(dto: CreateCustomerDto) {
    return this.usersService.create(new UserEntity({
      ...dto,
      id_cards: dto.id_cards.map(idCard => new UserIdCards({ photo: idCard })),
      role: UserRoleEnum.CUSTOMER,
      status: UserStatusEnum.VERIFIED,
    }), true);
  }

  findAll(dto: GetCustomerPaginationDto) {
    return this.usersService.get(dto.page, dto.limit, UserRoleEnum.CUSTOMER, dto.q, true, dto.status);
  }

  findOne(id: number) {
    return this.usersService.findOne(id, true);
  }

  update(id: number, updateDriverDto: UpdateCustomerDto) {
    const { id_cards, ...rest } = updateDriverDto;
    return this.usersService.update(id, new UserEntity(rest), id_cards, true);
  }

  remove(id: number) {
    return this.usersService.remove(id);
  }

  getStatusCount() {
    return this.usersService.getStatusCount(UserRoleEnum.CUSTOMER);
  }
}
