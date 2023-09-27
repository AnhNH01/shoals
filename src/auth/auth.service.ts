import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { RegisterUserDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import * as argon from 'argon2';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { User } from 'src/users/interfaces/users.interface';
import { UsersService } from 'src/users/services/users.service';
import { Tokens } from './interfaces/tokens.interface';
import { UpdateUserDto } from 'src/users/dtos/update-user.dto';
import { JwtPayload } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string): Promise<Tokens> {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const [accessToken, refreshToken] = await this.getTokens(user);

    await this.updateRefreshTokenHash(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async jwtRefresh(userId: number, refreshTokenHash: string) {
    const user = await this.userService.findOneById(userId);

    const rtokenHashMatch = await argon.verify(
      user.refreshToken,
      refreshTokenHash,
    );

    if (!rtokenHashMatch) {
      throw new UnauthorizedException('Invalid token');
    }

    const [accessToken, refreshToken] = await this.getTokens(user);
    await this.updateRefreshTokenHash(userId, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async signOut(userId: number) {
    await this.userService.updateUser({ id: userId, refreshToken: null });
  }

  async register(registerDto: RegisterUserDto) {
    if (registerDto.password !== registerDto.password2) {
      throw new BadRequestException('Passwords must match!');
    }

    const existed = await this.userService.findOneByEmail(registerDto.email);

    if (existed) {
      throw new BadRequestException('User with this email already exist!');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 6);

    const createUserDto: CreateUserDto = {
      email: registerDto.email,
      name: registerDto.name,
      password: hashedPassword,
    };

    const user = await this.userService.createUser(createUserDto);
    if (!user) {
      throw new InternalServerErrorException(
        'Something went wrong while creating your user',
      );
    }

    const [accessToken, refreshToken] = await this.getTokens(user);

    await this.updateRefreshTokenHash(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async getUserFromJwtToken(jwtToken: string): Promise<User | null> {
    try {
      const decoded = await this.jwtService.verifyAsync(jwtToken, {
        secret: this.configService.get('AT_SECRET'),
      });
      const user: User = {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
      };

      return user;
    } catch (error) {
      return null;
    }
  }

  async getTokens(user: User) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    const tokens = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('AT_SECRET'),
        expiresIn: this.configService.get<string>('AT_EXPIRE'),
      }),

      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('RT_SECRET'),
        expiresIn: this.configService.get<string>('RT_EXPIRE'),
      }),
    ]);

    return tokens;
  }

  async updateRefreshTokenHash(userId: number, refreshToken: string) {
    const hash = await argon.hash(refreshToken);

    const updateParams: UpdateUserDto = {
      id: userId,
      refreshToken: hash,
    };

    return this.userService.updateUser(updateParams);
  }
}
