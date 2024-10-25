import { ApiProperty, PartialType } from "@nestjs/swagger";
import { BaseCreateOrderDto } from "./base.create-order.dto";
import { CreateCustomerDto } from "src/modules/customers/dto/create-customer.dto";
import { ValidateIf, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { BaseOrderRequestDto } from "./order-request.dto";

export class CreateOrderCustomerDto extends PartialType(BaseCreateOrderDto) {

    @ApiProperty({
        type: BaseOrderRequestDto,
    })
    @ValidateNested()
    @Type(() => BaseOrderRequestDto)
    start_request: BaseOrderRequestDto;

    @ApiProperty({
        type: BaseOrderRequestDto,
    })
    @ValidateNested()
    @Type(() => BaseOrderRequestDto)
    end_request: BaseOrderRequestDto;

    @ApiProperty({
        type: CreateCustomerDto,
    })
    @ValidateNested()
    @Type(() => CreateCustomerDto)
    @ValidateIf((o) => o.new_customer)
    new_customer: CreateCustomerDto;
}