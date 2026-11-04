import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service.js';
import { JwtAuthGuard } from '../../guard/jwt-auth.guard.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/pilot/me')
  @UseGuards(JwtAuthGuard)
  getProfile(): any {
    return this.userService.getProfile();
  }
}
