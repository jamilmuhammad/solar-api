import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceTokensEntity } from './entities/device_token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DeviceTokensService {

    constructor(
        @InjectRepository(DeviceTokensEntity) private readonly tokenRepository: Repository<DeviceTokensEntity>,
    ) { }

    async upsert(userId: number, token: string) {
        const existingToken = await this.tokenRepository.findOne({ where: { user_id: userId, token: token } });

        if (existingToken) {
            existingToken.token = token;
            return this.tokenRepository.save(existingToken);
        }

        return this.tokenRepository.save(new DeviceTokensEntity({ user_id: userId, token }));
    }

    remove(id: number) {
        return this.tokenRepository.softDelete({ id });
    }

    async getFcmTokens(userIds: number | number[]): Promise<string[]> {
        const builder = this.tokenRepository.createQueryBuilder('c')
            .select('c.token', 'token');

        if (Array.isArray(userIds)) {
            builder.where('c.user_id IN (:userIds) AND c.token IS NOT NULL', { userIds });;
        } else {
            builder.where('c.user_id = :userIds AND c.token IS NOT NULL', { userIds });
        }

        return (await builder.getRawMany()).map(e => e.token);
    }
}
