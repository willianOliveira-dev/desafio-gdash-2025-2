import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Env } from 'src/env.validation';
import { Injectable } from '@nestjs/common';
import type { Payload } from '../interfaces/payload.interface';
import type { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly config: ConfigService<Env>) {
        super({
            jwtFromRequest: (req: Request) => {
                if (!req || !req.cookies) return null;
                return req['cookies']['accessToken'];
            },
            ignoreExpiration: false,
            secretOrKey: config.get('JWT_ACCESS_SECRET') as string,
        });
    }

    async validate(payload: Payload) {
        return {
            userId: payload.sub,
            username: payload.username,
            email: payload.email,
            role: payload.role,
        };
    }
}
