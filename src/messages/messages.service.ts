import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './messages.entity';
import { Repository } from 'typeorm';
import { MessageSaveDto } from './dto/message.save.dto';
import { UsersService } from 'src/users/users.service';
import { MessageDto } from './dto/message.dto';
import { ConversationsService } from 'src/conversations/conversations.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    private readonly conversationsService: ConversationsService,
    private readonly usersService: UsersService,
  ) {}

  async saveMessage(messageDto: MessageDto) {
    const conversation = await this.conversationsService.findOneById(
      messageDto.conversationId,
    );
    if (!conversation) {
      throw new BadRequestException('Conversation does not exist');
    }

    const user = await this.usersService.findOneById(messageDto.userId);
    if (!user) {
      throw new BadRequestException('Sent user does not exist');
    }

    const messageSaveDto: MessageSaveDto = {
      conversation: conversation,
      text: messageDto.text,
      user: user,
    };

    const message = this.messagesRepository.create(messageSaveDto);
    await this.messagesRepository.save(message);

    return message;
  }

  async getMessagesInConversation(conversationId: number) {
    const messages = await this.messagesRepository.find({
      relations: {
        user: true,
      },
      where: {
        conversation: {
          id: conversationId,
        },
      },
      select: {
        user: {
          id: true,
        },
      },
    });

    return messages;
  }
}
