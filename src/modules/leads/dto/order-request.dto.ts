import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsString, ValidateIf } from "class-validator";

export class BaseOrderRequestDto {

    @ApiProperty({
        default: false,
    })
    @ValidateIf(o => o.is_self_pickup)
    @IsBoolean()
    is_self_pickup: boolean = false;

    @ApiProperty({
        required: false,
        nullable: true,
    })
    @ValidateIf(o => o.address || !o.is_self_pickup)
    @IsString()
    address?: string;
}

export class OrderRequestDto extends PartialType(BaseOrderRequestDto) {

    @ApiProperty({
        type: 'number',
        default: 0,
    })
    @IsNumber()
    @ValidateIf(o => o.distance)
    distance?: number;

    @ApiProperty()
    @IsNumber()
    driver_id?: number;
}
