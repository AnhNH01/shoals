import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async findOneById(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({ email: email });
    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  async findManyByIds(userIds: number[]) {
    const users = await this.usersRepository.findBy({
      id: In(userIds),
    });
    return users;
  }

  async updateUser(updateUserDto: UpdateUserDto) {
    const { id, ...updateParams } = updateUserDto;

    const user = await this.findOneById(id);

    Object.entries(updateParams).forEach(([key, value]) => {
      if (value !== undefined) {
        user[key] = value;
      }
    });

    return await this.usersRepository.save(user);
  }
}
