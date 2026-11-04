import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResponseStatus } from '../../common/constant.js';
import { AppException } from '../../filter/exception/app.exception.js';
import { UserService } from '../user/user.service.js';
import { response } from 'express';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  postLogin(body: LoginDto): any {
    const isUserExists =
      body.username === 'johndoe' && body.password === 'susiairtest';

    if (!isUserExists) {
      throw new AppException({
        code: HttpStatus.UNAUTHORIZED,
        message: 'invalid credentials',
      });
    }

    return {
      token: this.jwtService.sign({ username: body.username }),
    };
  }
}
