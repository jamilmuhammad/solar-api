import { IsBoolean, IsDateString, IsNumber, Max, ValidateIf } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class BaseCreateOrderDto {

    @ApiProperty()
    @IsNumber()
    fleet_id: number;

    @ApiProperty({
        required: false,
        nullable: true,
    })
    description: string;

    @ApiProperty({
        type: 'boolean',
        default: false,
    })
    @IsBoolean()
    is_with_driver: boolean = false;

    @ApiProperty({
        type: 'boolean',
        default: false,
    })
    @IsBoolean()
    is_out_of_town: boolean = false;

    @ApiProperty({
        format: 'date-time',
    })
    @IsDateString()
    date: string;

    @ApiProperty({
        default: 1,
        maximum: 30,
    })
    @IsNumber()
    @Max(30)
    duration: number;

    @ApiProperty()
    @IsNumber()
    @ValidateIf((o) => o.insurance_id)
    insurance_id: number;
}
