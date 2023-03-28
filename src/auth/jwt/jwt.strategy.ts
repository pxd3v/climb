import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      jsonWebTokenOptions: {
        ignoreExpiration: false,
      },
    });
  }

  async validate(
    payload: User & { sub: string; username: string; iat: number },
  ) {
    const { sub, username, iat, ...user } = payload;
    return { ...user };
  }
}
