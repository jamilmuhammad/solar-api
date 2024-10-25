import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  controllers: [CustomersController],
  providers: [CustomersService],
  imports: [UsersModule],
})
export class CustomersModule { }
