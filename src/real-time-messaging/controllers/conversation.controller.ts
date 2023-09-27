import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ConversationService } from '../services/conversation.service';
import { CurrentUser } from 'src/common/decorators';

@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getConversations(@CurrentUser('sub') userId: number) {
    return this.conversationService.getConversationsByUser(userId);
  }
}
