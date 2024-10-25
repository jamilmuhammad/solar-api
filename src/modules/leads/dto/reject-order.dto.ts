import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class RejectOrderDto {

    @ApiProperty({
        type: 'string',
    })
    @IsNotEmpty()
    reason: string;
}
