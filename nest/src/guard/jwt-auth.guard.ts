import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { AppException } from '~/filter/exception/app.exception.js';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];

    if (!token) {
      throw new AppException({
        code: HttpStatus.UNAUTHORIZED,
        message: 'No token provided',
      });
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'default_secret',
      });

      request['user'] = payload;
    } catch {
      throw new AppException({
        code: HttpStatus.UNAUTHORIZED,
        message: 'Invalid credentials',
      });
    }

    return true;
  }
}
