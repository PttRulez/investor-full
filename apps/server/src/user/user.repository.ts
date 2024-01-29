import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { User } from 'src/user/user.model';
import { RegisterData } from 'src/auth/types';

export type RegisterUser = Omit<RegisterData, 'password'> & {
  hashedPassword: string;
};

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async createNewUser(userData: RegisterUser): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        ...userData,
      },
    });

    return new User(user);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) return null;

    return new User(user);
  }

  async getAllUsers(): Promise<User[]> {
    const usersFromDb = await this.prisma.user.findMany({
      orderBy: [
        {
          id: 'asc',
        },
      ],
    });
    return usersFromDb.map(u => new User(u));
  }
}
