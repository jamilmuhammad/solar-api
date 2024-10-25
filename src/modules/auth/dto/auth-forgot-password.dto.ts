import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class AuthForgotPasswordDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;
}
