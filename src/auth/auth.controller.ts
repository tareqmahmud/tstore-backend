import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth-guard';
import { UserSignupDto } from './dto/user-signup.dto';
import { UserType } from '../users/types/user.type';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('/signup')
  async signup(
    @Body(ValidationPipe) userSignupDto: UserSignupDto,
  ): Promise<UserType> {
    return this.authService.signUp(userSignupDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return req.user;
  }
}
