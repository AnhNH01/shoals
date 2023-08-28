import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from 'src/auth/dto/register.dto';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UsersService {
    
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ){}

    async findOneById(id: number) {
        const user = await this.usersRepository.findOneBy({id})
        if (!user) {
            throw new NotFoundException('User not found')
        }
        return user
    }

    async findOneByEmail(email: string) {
        const user = await this.usersRepository.findOneBy({email: email})
        if (!user) {
            throw new NotFoundException('User not found')
        }
        return user
    }

    async createUser(createUserDto: CreateUserDto) {
        const user =  this.usersRepository.create(createUserDto)
        return await this.usersRepository.save(user)
    }   

}
