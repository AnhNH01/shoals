import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from './conversations.entity';
import { In, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ConversationsService {
    constructor(
        @InjectRepository(Conversation)
        private conversationsRepository: Repository<Conversation>,
        private usersService: UsersService,
    ) {}

    async findOneById(id: number) {
        return await this.conversationsRepository.findOneBy({id})
    }
    
    async createConversation(userIds: number[]) {
        const users = await this.usersService.findManyById(userIds) 
        
        if (!users) {
            throw new BadRequestException("Users in conversation is not valid")
        }

        const conversation = this.conversationsRepository.create({
            name: 'Test Convo',
            users: users
        })

        return await this.conversationsRepository.save(conversation)
    }


    async getConversationsByUser(userId: number) {
        const conversations = await this.conversationsRepository
            .createQueryBuilder('conversation')
            .leftJoin(
                'conversation.users', 'user'
            )
            .where('user.id = :id', {id: userId})
            .getMany()

        return conversations
    }

    async getConversation(conversationId: number) {
        const conversation = await this.conversationsRepository.findOne({
            relations: {
                users: true,
            },
            where: {
                id: conversationId
            },
            select: {
                users: {
                    id: true,
                    name: true,
                },
            }
        })
        return conversation
    }

    async getMessages(conversationId: number) {
        const conversation = await this.conversationsRepository.find({
            relations: {
                messages: true,
                users: true
            },
            where: {
                id: conversationId
            },
            select: {
                messages: {
                    text: true,
                    sentTime: true,
                    user: {
                        id: true
                    }
                }
            }
        })

        return conversation
    }
}
