import { ApiProperty, PartialType } from '@nestjs/swagger';
import { BaseCustomerDto } from './base-customer.dto';

export class UpdateCustomerDto extends PartialType(BaseCustomerDto) {

    @ApiProperty({ nullable: true })
    id_cards?: string[];

    @ApiProperty({ required: false })
    emergency_phone_number?: string;
}
