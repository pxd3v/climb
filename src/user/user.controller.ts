import {
  Controller,
  Request,
  Get,
  UseGuards,
  Post,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.auth-guard';
import { UserService } from './user.service';
import { Request as RequestType } from 'express';
import { Prisma } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // @UseGuards(JwtAuthGuard)
  @Post()
  createUser(@Body() body: Prisma.UserCreateInput) {
    return this.userService.createUser(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getProfile(@Request() req: RequestType) {
    return this.userService.profile({ id: req.user.id });
  }
}
