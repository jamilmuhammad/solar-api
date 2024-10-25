
import { BasicStrategy as Strategy } from 'passport-http';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

require('dotenv').config();

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            passReqToCallback: true
        });
    }

    public validate = async (req, username, password): Promise<boolean> => {
        if (
            process.env.HTTP_BASIC_USER === username &&
            process.env.HTTP_BASIC_PASSWORD === password
        ) {
            return true;
        }

        throw new UnauthorizedException('Basic authentication failed');
    }
}
