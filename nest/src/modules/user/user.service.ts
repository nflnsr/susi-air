import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getProfile(): any {
    return {
      id: 1,
      name: 'John Doe',
      username: 'johndoe',
    };
  }
}
