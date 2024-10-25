import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from '../config/database/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DeviceTokensModule } from './device_tokens/device_token.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => typeormConfig,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION },
    }),
    UsersModule,
    AuthModule,
    DeviceTokensModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
