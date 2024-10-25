import { ApiProperty } from "@nestjs/swagger";

export class GetSurveyOneDto {

    @ApiProperty({ default: false, required: false, type: Boolean })
    with_related_surveys: string = 'false';

    constructor(data) {
        Object.assign(this, data);
    }
}