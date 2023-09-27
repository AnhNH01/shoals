import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageDto } from '../dtos';
import { ConversationService } from '../services/conversation.service';
import { EntityManager, In } from 'typeorm';
import { OnModuleInit, UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from 'src/common/guards';
import { AuthService } from 'src/auth/auth.service';
import { ActiveUserEntity } from 'src/users/entities/active-user.entity';

@WebSocketGateway({ cors: { origin: ['http://localhost:5173'] } })
export class MessagingGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  constructor(
    private readonly conversationService: ConversationService,
    private readonly manager: EntityManager,
    private readonly authService: AuthService,
  ) {}

  @WebSocketServer()
  server: Server;

  // cleanup active user table in database, use in development
  async onModuleInit() {
    await this.manager.delete(ActiveUserEntity, {
      userId: In([1, 2]),
    });
  }

  @UseGuards(JwtAccessGuard)
  async handleConnection(socket: Socket) {
    let jwt = socket.handshake.headers.authorization || null;
    if (jwt) {
      jwt = jwt.replace('Bearer', '').trim();
    }

    const user = await this.authService.getUserFromJwtToken(jwt);
    if (!user) {
      socket.disconnect();
    }

    socket.data.user = user;

    const activeUser = this.manager.create(ActiveUserEntity, {
      userId: user.id,
      socketId: socket.id,
    });

    await this.manager.save(activeUser);

    console.log('Connection made');
  }

  async handleDisconnect(socket: Socket) {
    await this.manager.delete(ActiveUserEntity, {
      socketId: socket.id,
    });
    console.log(`disconnected ${socket.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(socket: Socket, message: MessageDto) {
    const activeUsersInConversation =
      await this.conversationService.getActiveUsersInConversation(
        message.conversationId,
      );
    console.log(activeUsersInConversation);
    activeUsersInConversation.forEach((activeUser) => {
      this.server.to(activeUser.socketId).emit('newMessage', message);
    });

    await this.conversationService.saveMessage(message);
  }

  @SubscribeMessage('joinConversation')
  async handleJoinConversation(socket: Socket, conversationId: number) {
    const messages = this.conversationService.getMessages(conversationId);
    this.server.to(socket.id).emit('messages', messages);
  }
}
