import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ConversationEntity } from './entites/conversation.entity';
import { MessageEntity } from './entites/message.entity';
import { ActiveUserEntity } from '../users/entities/active-user.entity';
import { MessagingGateway } from './gateway/messaging.gateway';
import { ConversationService } from './services/conversation.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      ConversationEntity,
      MessageEntity,
      ActiveUserEntity,
    ]),
    UsersModule,
  ],
  providers: [MessagingGateway, ConversationService],
  exports: [ConversationService],
})
export class RealTimeMessagingModule {}
