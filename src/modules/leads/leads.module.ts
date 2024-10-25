import { Module } from '@nestjs/common';
import { OrdersService } from './services/leads.service';
import { OrdersController } from './leads.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/lead.entity';
import { FleetsModule } from '../fleets/fleets.module';
import { RequestsModule } from '../surveys/surveys.module';
import { OrderPgService } from './services/lead-pg.service';
import { OrderStatusLogsService } from './services/lead-status-logs.service';
import { OrderStatusLogsEntity } from './entities/order-status-logs.entity';
import { InsurancesModule } from '../insurances/insurances.module';
import { MailModule } from '../mail/mail.module';
import { LedgersModule } from '../ledgers/ledgers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      OrderStatusLogsEntity,
    ]),
    FleetsModule,
    RequestsModule,
    InsurancesModule,
    MailModule,
    LedgersModule,
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    OrderPgService,
    OrderStatusLogsService,
  ],
})
export class OrdersModule { }
