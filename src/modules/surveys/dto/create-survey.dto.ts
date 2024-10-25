import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { SurveyTypeEnum } from "../enums/survey.type.enum";

export class CreateSurveyDto {

    @ApiProperty()
    @IsNumber()
    customer_id: number;

    @ApiProperty()
    @IsNumber()
    fleet_id: number;

    @ApiProperty()
    @IsNumber()
    driver_id: number;

    @ApiProperty({
        format: 'date-time',
    })
    @IsDateString()
    start_date: Date;

    @ApiProperty({
        enum: SurveyTypeEnum,
    })
    @IsEnum(SurveyTypeEnum)
    type: string;

    @ApiProperty({
        description: 'apakah request ini diambil oleh customer?',
        default: false,
    })
    is_self_pickup: boolean;

    @ApiProperty({
        required: false,
    })
    address: string;

    @ApiProperty({
        required: false,
    })
    description?: string;

    @ApiProperty({
        type: 'double'
    })
    distance: number;
}
