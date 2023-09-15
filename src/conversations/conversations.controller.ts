import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/conversation.dto';
import { MessageDto } from 'src/messages/dto/message.dto';
import { MessagesService } from 'src/messages/messages.service';

@Controller('conversations')
export class ConversationsController {
  constructor(
    private conversationsService: ConversationsService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get('user/:id')
  getAllConverations(@Param('id') userId) {
    return this.conversationsService.getConversationsByUser(userId);
  }

  @Post()
  createConversation(@Body() createConversationDto: CreateConversationDto) {
    return this.conversationsService.createConversation(
      createConversationDto.userIds,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getConversation(@Param('id') conversationId) {
    return this.conversationsService.getConversation(conversationId);
  }
  
}
