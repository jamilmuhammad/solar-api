import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {

    constructor(
        private readonly jwtService: JwtService,
    ) { }

    signJwtToken(userId: string, deviceId?: string) {
        return this.jwtService.signAsync({
            sub: {
                user_id: userId,
                device_id: deviceId
            }
        });
    }
}
