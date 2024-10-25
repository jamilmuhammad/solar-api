import { Type } from "class-transformer";
import { OrderRequestDto } from "./order-request.dto";
import { IsNumber, IsString, Max, Min, ValidateIf, ValidateNested } from "class-validator";
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { BaseCreateOrderDto } from "./base.create-order.dto";
import { OrderAdditionalItems } from "../interface/lead-additionals.interface";

export class CreateOrderDto extends PartialType(BaseCreateOrderDto) {

    @ApiProperty({
        type: OrderRequestDto,
    })
    @ValidateNested()
    @Type(() => OrderRequestDto)
    start_request: OrderRequestDto;

    @ApiProperty({
        type: OrderRequestDto,
    })
    @ValidateNested()
    @Type(() => OrderRequestDto)
    end_request: OrderRequestDto;

    @ApiProperty()
    @IsNumber()
    customer_id: number;

    @ApiProperty({
        type: 'number',
        description: 'discount in percentage',
        maximum: 100,
        minimum: 0,
        default: 0,
    })
    @IsNumber()
    @Max(100)
    @Min(0)
    discount: number;

    @ApiProperty()
    @IsNumber()
    @ValidateIf((o) => o.service_price || !o.start_request.is_self_pickup || !o.end_request.is_self_pickup)
    service_price?: number;

    @ApiProperty({
        required: false,
        nullable: true,
        type: OrderAdditionalItems,
        isArray: true,
    })
    @ValidateNested({ each: true })
    @Type(() => OrderAdditionalItems)
    additional_services: OrderAdditionalItems[];
}
