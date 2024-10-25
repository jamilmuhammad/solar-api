import { ApiProperty } from "@nestjs/swagger";

export class AuthGetDto {

    @ApiProperty({
        nullable: true,
        description: 'fcm token for push notification',
        required: false,
    })
    token?: string;
}
