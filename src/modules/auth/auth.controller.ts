import { Body, Controller, Delete, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthService } from './service/auth.service';
import { ApiBasicAuth, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/config/guard/jwt-auth.guard';
import { AuthGetDto } from './dto/auth-get.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { UserRoleEnum } from '../users/enums/user.role.enum.ts';
import { AuthForgotPasswordDto } from './dto/auth-forgot-password.dto';
import { AuthResetPasswordDto } from './dto/auth-reset-password.dto';
import { BasicAuthGuard } from 'src/config/guard/basic-auth.guard';

@Controller({
    version: '1',
    path: 'auth',
})
export class AuthController {

    constructor(
        private authService: AuthService,
    ) { }

    @Post('login')
    @ApiTags('v1/auth/login')
    login(@Body() dto: AuthLoginDto) {
        return this.authService.login(dto);
    }

    @Post('login/admin')
    @ApiTags('v1/auth/login')
    loginAdmin(@Body() dto: AuthLoginDto) {
        return this.authService.login(dto);
    }

    @ApiBasicAuth()
    @UseGuards(BasicAuthGuard)
    @Post('register')
    @ApiTags('v1/auth/register')
    register(@Body() dto: AuthRegisterDto) {
        return this.authService.register(dto);
    }

    @ApiBasicAuth()
    @UseGuards(BasicAuthGuard)
    @ApiTags('v1/auth/password')
    @Post('password/forgot')
    forgotPassword(@Body() dto: AuthForgotPasswordDto) {
        return this.authService.forgotPassword(dto);
    }

    @ApiBasicAuth()
    @UseGuards(BasicAuthGuard)
    @ApiTags('v1/auth/password')
    @Post('password/reset')
    resetPassword(@Body() dto: AuthResetPasswordDto) {
        return this.authService.resetPassword(dto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiTags('v1/auth')
    me(@Request() req, @Query() dto: AuthGetDto) {
        return this.authService.get(req.user, dto);
    }

    @Delete()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiTags('v1/auth')
    logOut(@Request() req) {
        return this.authService.logout(req.user.device_id);
    }
}
