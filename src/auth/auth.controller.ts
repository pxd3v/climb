import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local/local.auth-guard';

@Controller('auth')
@UseGuards(LocalAuthGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
