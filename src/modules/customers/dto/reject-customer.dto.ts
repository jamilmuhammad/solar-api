import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class RejectCustomerDto {

    @ApiProperty({
        type: 'string',
    })
    @IsNotEmpty()
    reason: string;
}
