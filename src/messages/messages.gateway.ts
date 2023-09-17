import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MessagesService } from './messages.service';
import { MessageDto } from './dto/message.dto';

@WebSocketGateway()
export class MessagesGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: MessagesService) {}

  @SubscribeMessage('send_message')
  async listenForMessages(@MessageBody() msg: MessageDto) {
    const message = await this.messagesService.saveMessage(msg);

    this.server.emit('receive_message', message);
    return message;
  }
}
