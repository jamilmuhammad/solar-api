import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEmail, IsEnum, Length, ValidateIf, IsDateString } from "class-validator";
import { UserGenderEnum } from "src/modules/users/enums/user.gender.enum";

export class BaseCustomerDto {

    @ApiProperty({ required: true })
    @IsNotEmpty()
    name: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    phone_number?: string;

}