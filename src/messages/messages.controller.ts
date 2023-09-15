import { Controller, HttpCode, HttpStatus, Post, Body, Get, Param } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessageDto } from './dto/message.dto';

@Controller('messages')
export class MessagesController {
    constructor(
        private readonly messagesService: MessagesService

    ){}

    @HttpCode(HttpStatus.CREATED)
    @Post()
    sendMessage(@Body() messageDto: MessageDto) {
      return this.messagesService.saveMessage(messageDto);
    }

    @HttpCode(HttpStatus.OK)
    @Get('conversation/:id')
    getMessages(@Param('id') conversationId: number) {
        return this.messagesService.getMessagesInConversation(conversationId)
    }
}
