import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, ValidateIf } from "class-validator";
import { UserStatusEnum } from "src/modules/users/enums/user.status.enum";

export class GetCustomerPaginationDto {

    constructor(data) {
        Object.assign(this, data);
    }

    @ApiProperty({ default: 1 })
    page?: number = 1;

    @ApiProperty({ default: 10 })
    limit?: number = 10;

    @ApiProperty({ nullable: true, required: false })
    q?: string;

    @ApiProperty({
        enum: UserStatusEnum,
        nullable: true,
        required: false,
    })
    @IsEnum(UserStatusEnum)
    @ValidateIf((o) => o.status)
    status?: UserStatusEnum;
}