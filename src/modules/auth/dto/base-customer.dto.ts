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

    @ApiProperty({
        default: UserGenderEnum.MALE,
    })
    @IsEnum(UserGenderEnum)
    gender?: UserGenderEnum;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    phone_number?: string;

    @ApiProperty({
        required: true,
        example: '1999-12-31',
    })
    @IsDateString()
    @ValidateIf(o => o.date_of_birth)
    date_of_birth?: Date;

    @ApiProperty({
        required: true,
        default: '1234567812345678',
    })
    @Length(16, 16, { message: 'NIK must be 16 characters' })
    @ValidateIf(o => o.nik)
    nik: string;
}