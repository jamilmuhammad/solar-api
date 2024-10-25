import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { RequestLogsTypeEnum } from "../enums/survey-logs.type.enum";

export class CreateRequestLogDto {

    @ApiProperty({
        enum: RequestLogsTypeEnum,
    })
    @IsEnum(RequestLogsTypeEnum)
    type: RequestLogsTypeEnum;

    @ApiProperty({
        nullable: true,
    })
    description?: string;

    @ApiProperty({
        nullable: true,
    })
    photos?: string[];
}
