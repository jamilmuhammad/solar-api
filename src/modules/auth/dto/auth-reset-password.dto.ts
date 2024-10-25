import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MinLength } from "class-validator";

export class AuthResetPasswordDto {

    @ApiProperty()
    @IsNotEmpty()
    token: string;

    @ApiProperty()
    @IsNotEmpty()
    @MinLength(5)
    password: string;
}
