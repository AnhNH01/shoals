import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { RegisterUserDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/createUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: user.id, email: user.email, name: user.name };

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRE'),
      }),
    };
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
    return user;
  }
}
