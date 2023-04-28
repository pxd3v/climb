import {
  Controller,
  Request,
  Get,
  UseGuards,
  Post,
  Body,
  Put,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.auth-guard';
import { UserService } from './user.service';
import { Request as RequestType } from 'express';
import { Prisma } from '@prisma/client';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Roles('admin')
  @Post()
  createUser(@Body() body: Prisma.UserCreateInput) {
    return this.userService.createUser(body);
  }

  @Roles('admin')
  @Put(':id')
  updatePassword(@Body() body: { password: string }, @Param('id') id: string) {
    return this.userService.updatePassword({
      id: Number(id),
      password: body.password,
    });
  }

  @Get()
  getProfile(@Request() req: RequestType) {
    return this.userService.profile({ id: req.user.id });
  }
}
