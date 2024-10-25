import { Module } from '@nestjs/common';
import { DeviceTokensService } from './device_token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceTokensEntity } from './entities/device_token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DeviceTokensEntity,
    ]),
  ],
  providers: [
    DeviceTokensService,
  ],
  exports: [
    DeviceTokensService,
  ]
})
export class DeviceTokensModule { }
