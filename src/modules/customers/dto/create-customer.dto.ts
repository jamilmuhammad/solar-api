import { ApiProperty, PartialType } from "@nestjs/swagger";
import { ArrayNotEmpty, IsNotEmpty, MinLength, ValidateIf } from "class-validator";
import { BaseCustomerDto } from "./base-customer.dto";

export class CreateCustomerDto extends PartialType(BaseCustomerDto) {

    @ApiProperty({
        required: false,
        nullable: true,
    })
    @MinLength(5)
    @ValidateIf(o => o.password)
    password: string;

}
