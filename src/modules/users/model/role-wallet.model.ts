import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber } from "class-validator";

export class RoleWallet {

    constructor(data) {
        Object.assign(this, data);
    }

    @ApiProperty({
        type: Boolean,
        example: false,
    })
    @IsBoolean()
    add: boolean = false;

    @ApiProperty({
        type: Boolean,
        example: false,
    })
    @IsNumber()
    manage: boolean = false;

    @ApiProperty({
        type: Boolean,
        example: false,
    })
    @IsBoolean()
    disable: boolean = false;
}