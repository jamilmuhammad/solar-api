import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class LeadAdditionalItems {

    constructor(data) {
        Object.assign(this, data);
    }

    @IsString()
    @ApiProperty()
    readonly name: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    @ApiProperty({
        type: 'number',
        description: 'price in decimal',
        format: 'double precision',
        example: 10000.00,
    })
    readonly price: number;
}