import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import {JwtService} from '@nestjs/jwt'
import {Request} from 'express';
import { ConfigService } from '@nestjs/config/dist';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService, 
    private configService: ConfigService
  ){}

  
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = this.extractToken(request);

    if (!accessToken) {
      throw new UnauthorizedException();
    }

    try {
      
      const payload = await this.jwtService.verifyAsync(accessToken, {secret: this.configService.get<string>('JWT_SECRET')});
      console.log(this.configService.get<string>('JWT_SECRET'))
      request['user'] = payload
    } catch {
      throw new UnauthorizedException()
    }
    
    return true;
  }

  private extractToken(request: Request): string | undefined {
    const [type, accessToken] = request.headers.authorization?.split(' ') ?? [];
    return type == 'Bearer' ? accessToken : undefined
  }
}
