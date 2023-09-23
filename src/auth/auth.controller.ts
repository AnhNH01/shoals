import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { RegisterUserDto } from './dto/register.dto';
import { Request } from 'express';
import { Public } from 'src/common/decorators';
import { JwtRefreshGuard } from 'src/common/guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  register(@Body() registerDto: RegisterUserDto) {
    return this.authService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Req() request: Request) {
    const userId = request.user['sub'];
    return this.authService.signOut(userId);
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refreshTokens(@Req() request: Request) {
    const userId = request.user['sub'];
    const refreshToken = request.user['refreshToken'];
    return this.authService.jwtRefresh(userId, refreshToken);
  }
}
