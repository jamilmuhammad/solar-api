import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderStatusLogsEntity } from '../entities/order-status-logs.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderStatusLogsService {

    constructor(
        @InjectRepository(OrderStatusLogsEntity) private repository: Repository<OrderStatusLogsEntity>,
    ) { }

    async create(data: Partial<OrderStatusLogsEntity>): Promise<OrderStatusLogsEntity> {
        return this.repository.save(data);
    }
}
