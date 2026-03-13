import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  generateToken(user: User): string {
  const payload = { sub: user.id, email: user.email, role: user.role };
  return this.jwtService.sign(payload);
}
}