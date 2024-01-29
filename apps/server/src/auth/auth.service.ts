import { ForbiddenException, Injectable } from '@nestjs/common';
import { RegisterUser, UserRepository } from '../user/user.repository';
import { IUserResponse, Role } from 'contracts';
import { hash } from 'argon2';
import { LoginData, RegisterData } from './types';

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async register(registerData: RegisterData): Promise<IUserResponse> {
    // админ только я
    if (!registerData.role || registerData.role === Role.ADMIN) {
      registerData.role = Role.INVESTOR;
    }

    const userExists = await this.userRepository.findUserByEmail(
      registerData.email,
    );
    if (userExists) throw new ForbiddenException('Email is already in use');

    const hashedPassword = await hash(registerData.password);

    const { password, ...userData } = registerData; // eslint-disable-line @typescript-eslint/no-unused-vars
    const registerUserData: RegisterUser = { ...userData, hashedPassword };
    const user = await this.userRepository.createNewUser(registerUserData);

    return user.toJSON();
  }

  async login(loginData: LoginData): Promise<IUserResponse> {
    const userFound = await this.userRepository.findUserByEmail(
      loginData.email,
    );

    if (!userFound) throw new ForbiddenException('Credentials incorrect');

    const passwordMatches = await userFound.validatePassword(
      loginData.password,
    );
    if (!passwordMatches) throw new ForbiddenException('Credentials incorrect');

    return userFound.toJSON();
  }
}
