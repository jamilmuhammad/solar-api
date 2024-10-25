import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserTokenEntity } from './entities/user-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserTokenEntity
    ]),
  ],
  providers: [
    UsersService,
  ],
  exports: [UsersService],
})
export class UsersModule { }
