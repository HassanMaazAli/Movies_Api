import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'your-secret-key', // use env variable in production
    });
  }

  async validate(payload: any) {
  // payload contains { sub: userId, email: userEmail, role: userRole } – we need to add role when signing
  return { userId: payload.sub, email: payload.email, role: payload.role };
}
}