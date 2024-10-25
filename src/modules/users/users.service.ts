import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { PasswordHashHelper } from '../../config/helper/hash/password-hash.helper';
import { PaginationHelper } from 'src/config/helper/pagination/pagination.helper';
import { QueryHelper } from 'src/config/helper/database/query_helper';
import { TokenHelper } from 'src/config/helper/string/token.helper';
import { PhoneNumberHelper } from 'src/config/helper/string/phone-number.helper';
import { USER_EMAIL_UNIQUE_INDEX } from 'src/common/constant/db-index.key.constant';
import { UserTokenEntity } from './entities/user-token.entity';
import { UserTokenReason } from './enums/user.token-reason.enum';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(UserTokenEntity) private readonly userTokenRepository: Repository<UserTokenEntity>,

    ) { }

    async get(page: number, limit: number, role: string, q?: string, isFull?: boolean) {
        const builder = this.userRepository.createQueryBuilder('u')
            .where('u.role = :role', { role })
            .orderBy('u.id', 'DESC');

        if (q && q !== '') {
            builder.andWhere('LOWER(u.name) LIKE LOWER(:q)', { q: `%${q}%` });
        }

        if (isFull) {
            this.appendUserFullSelect(builder);
        }

        if (status) {
            builder.andWhere('u.status = :status', { status });
        }

        return PaginationHelper.pagination(builder, { page, limit });
    }

    async findOne(id: number, isFull?: boolean): Promise<UserEntity> {
        if (!id) {
            throw new NotFoundException('ID is required.');
        }

        const builder = this.userRepository.createQueryBuilder('u')
            .where('u.id = :id', { id });

        if (isFull) {
            this.appendUserFullSelect(builder);
        }

        return builder.getOne();
    }

    private appendUserFullSelect(builder) {
        QueryHelper.appendSelect(builder, [
            'u.gender',
            'u.email',
            'u.phone_number',
            'u.emergency_phone_number',
            'u.date_of_birth',
            'u.nik',
            'u.photo_profile',
            'u.paper_number',
            'u.paper_id',
        ]);

        builder.leftJoinAndSelect('u.id_cards', 'id_cards');
    }

    async validateUser(email: string, currentPassword: string) {
        const builder = this.userRepository
            .createQueryBuilder('u')
            .where('u.email = :email', { email })
            .addSelect('u.password');

        // if (role) {
        //     if (Array.isArray(role)) {
        //         builder.andWhere('u.role IN (:...role)', { role });
        //     } else {
        //         builder.andWhere('u.role = :role', { role });
        //     }
        // }

        this.appendUserFullSelect(builder);

        const user = await builder.getOne();

        if (!user) {
            throw new NotFoundException('Could not find user.');
        }

        const isPasswordCorrect = await PasswordHashHelper.comparePassword(currentPassword, user.password);
        if (!isPasswordCorrect) {
            throw new NotFoundException('Could not find user.');
        }

        const { password, ...result } = user;
        return result;
    }

    private catchUniqueIndexError(err) {
        const constraint = err?.driverError?.constraint;

        if (constraint === USER_EMAIL_UNIQUE_INDEX) {
            throw new UnprocessableEntityException({
                message: 'Email is already exist',
                error: 'Unprocessable Entity',
                statusCode: 422,
                code: 'user_email_unique',
            });
        } else {
            throw new UnprocessableEntityException(err);
        }
    }

    async create(user: UserEntity, updateToPaper: boolean = false) {
        try {
            const newUser = await this.userRepository.save({
                ...user,
                phone_number: user.phone_number ? PhoneNumberHelper.replacePrefix(user.phone_number) : undefined,
                password: user.password ? await PasswordHashHelper.hash(user.password) : undefined,
            });

            return newUser;
        } catch (error) {
            this.catchUniqueIndexError(error);
        }
    }

    // private async sendVerificationMail(user: UserEntity) {
    //     const token = await this.createToken(user, UserTokenReason.CHANGE_PASSWORD);

    //     await this.mailService.sendMail({
    //         to: user.email,
    //         subject: 'Akun Pelanggan Transgo Anda Telah Dibuat!',
    //         customerName: user.name,
    //         message: VERIFIED_USER_MESSAGE,
    //         buttonLink: `${process.env.FRONTEND_URL}/atur-password?token=${token.token}`,
    //         buttonName: 'Atur Kata Sandi',
    //     });
    // }

    async update(id: number, dto: UserEntity, idCards: string[] = undefined, updateToPaper: boolean = false) {
        const user = await this.findOne(id, true);

        user.name = dto.name?.replace(/\s+$/, '');
        user.email = dto.email
        user.role_member = dto.role_member
        user.role_wallet = dto.role_wallet
        user.gender = dto.gender
        user.date_of_birth = dto.date_of_birth
        user.nik = dto.nik
        user.photo_profile = dto.photo_profile
        user.emergency_phone_number = dto.emergency_phone_number

        if (dto.phone_number) {
            user.phone_number = PhoneNumberHelper.replacePrefix(dto.phone_number);
        }

        if (dto.password) {
            user.password = await PasswordHashHelper.hash(dto.password);
        }

        return user.save();
    }

    async remove(id: number) {
        return this.userRepository.softDelete({ id });
    }

    async checkUserRole(id: number, role: string) {
        const builder = this.userRepository
            .createQueryBuilder('u')
            .where('u.id = :id', { id })
            .andWhere('u.role = :role', { role });

        const user = await builder.getOne();
        return !!user;
    }

    async forgotPassword(email: string) {
        const user = await this.userRepository.findOne({
            where: { email },
            select: ['id', 'email', 'name'],
        });

        if (!user) {
            throw new NotFoundException('User not found.');
        }

        const token = await this.createToken(user, UserTokenReason.FORGOT_PASSWORD);

        return {
            message: 'Forgot password email sent successfully.',
        };
    }

    async createToken(user: UserEntity, reason: UserTokenReason) {
        const token = await this.userTokenRepository.save({
            user_id: user.id,
            token: TokenHelper.generateToken(14),
            expired_at: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours
            reason,
        });

        return token;
    }

    async validateToken(token: string, reason: UserTokenReason | UserTokenReason[]) {
        const reasons = Array.isArray(reason) ? reason : [reason];

        const userToken = await this.userTokenRepository.createQueryBuilder('ut')
            .where('ut.token = :token', { token })
            .andWhere('ut.reason IN (:...reasons)', { reasons })
            .orderBy('ut.id', 'DESC')
            .innerJoinAndSelect('ut.user', 'u')
            .getOne();

        if (!userToken) {
            throw new NotFoundException('Token not found.');
        }

        if (userToken.expired_at < new Date()) {
            throw new UnprocessableEntityException('Token expired.');
        }

        return userToken;
    }

    async changePassword(token: string, newPassword: string) {
        const userToken = await this.validateToken(token, [
            UserTokenReason.CHANGE_PASSWORD,
            UserTokenReason.FORGOT_PASSWORD,
        ]);
        const user = userToken.user;

        user.password = await PasswordHashHelper.hash(newPassword);
        await user.save();

        await this.userTokenRepository.softDelete({ id: userToken.id });

        return {
            message: 'Password changed successfully.',
        };
    }

    async findByRole(id: number) {
        return this.userRepository.findOne({
            where: { id },
        });
    }
}
