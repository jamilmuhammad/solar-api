import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { TokenService } from './service/token.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { BasicStrategy } from './basic.strategy';
import { DeviceTokensModule } from '../device_tokens/device_token.module';

@Module({
  imports: [
    UsersModule,
    DeviceTokensModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRATION,
      },
    }),
  ],
  providers: [
    JwtStrategy,
    BasicStrategy,
    AuthService,
    TokenService,
  ],
  controllers: [AuthController]
})
export class AuthModule { }
