import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class AuthLoginDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @MinLength(5)
    password: string;

    @ApiProperty({
        nullable: true,
        description: 'fcm token for push notification',
        required: false,
    })
    token?: string;
}
