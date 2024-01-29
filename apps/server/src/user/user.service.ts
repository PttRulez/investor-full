import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { IUserResponse } from 'contracts';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getAllUsers(): Promise<IUserResponse[]> {
    const users = await this.userRepository.getAllUsers();
    return users.map(u => u.toJSON());
  }
}
