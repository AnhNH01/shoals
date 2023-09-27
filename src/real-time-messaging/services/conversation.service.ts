import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ConversationEntity } from '../entites/conversation.entity';
import { MessageEntity } from '../entites/message.entity';
import { ActiveUserEntity } from 'src/users/entities/active-user.entity';
import { MessageDto } from '../dtos';
import { ActiveUser } from 'src/users/interfaces';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly conversationRepostory: Repository<ConversationEntity>,
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(ActiveUserEntity)
    private readonly activeUserRepository: Repository<ActiveUserEntity>,
  ) {}

  async getConversationsByUser(userId: number): Promise<ConversationEntity[]> {
    const conversations = await this.conversationRepostory
      .createQueryBuilder('conversations_by_user')
      .leftJoin('conversation.users', 'user')
      .where('user.id = :id', { id: userId })
      .orderBy('conversation.lastUpdate', 'DESC')
      .getMany();

    return conversations;
  }

  // async createConversation(userIds: number[]) {
  //   const users = await this.usersService.findManyByIds(userIds);

  //   const conversation = this.conversationRepostory.create({
  //     users: users,
  //   });

  //   return await this.conversationRepostory.save(conversation);
  // }

  async getUsersInConversation(conversationId: number) {
    const conversation = await this.conversationRepostory
      .createQueryBuilder('users_in_conversation')
      .innerJoinAndSelect('conversation.users', 'users')
      .where('conversation.id = :id', { id: conversationId })
      .getOne();

    if (!conversation) {
      throw new BadRequestException('Conversation does not exist');
    }
    return conversation.users;
  }

  async getActiveUsersInConversation(
    conversationId: number,
  ): Promise<ActiveUser[]> {
    const conversation = await this.conversationRepostory.findOneBy({
      id: conversationId,
    });

    const userIds = conversation.userIds;

    const activeUsers = await this.activeUserRepository.findBy({
      userId: In(userIds),
    });
    return activeUsers;
  }

  async saveMessage(messageDto: MessageDto) {
    const message = this.messageRepository.create({
      text: messageDto.text,
      user: { id: messageDto.userId },
      conversation: { id: messageDto.conversationId },
    });

    await this.messageRepository.save(message);
  }

  async getMessages(conversationId: number) {
    const messages = await this.messageRepository.find({
      relations: {
        conversation: true,
        user: true,
      },
      where: {
        conversation: {
          id: conversationId,
        },
      },
      select: {
        conversation: {
          id: true,
        },
        user: {
          id: true,
          name: true,
        },
      },
      order: {
        createTime: 'ASC',
      },
    });

    return messages;
  }
}
