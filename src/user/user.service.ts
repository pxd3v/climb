import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma, Referee } from '@prisma/client';
import { hash } from 'bcrypt';

export type UserProfile = {
  email: User['email'];
  Referee: Referee[];
  isAdmin: User['isAdmin'];
  id: User['id'];
};

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async profile(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<UserProfile | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
      select: {
        email: true,
        Referee: true,
        isAdmin: true,
        id: true,
      },
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const password: string = await hash(
      data.password,
      Number(process.env.HASH_SALT),
    );

    const birthDate = new Date(data.birthDate);

    const user = await this.prisma.user.create({
      data: {
        ...data,
        password,
        birthDate,
      },
    });

    return {
      ...user,
      password: '',
    };
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }
}
