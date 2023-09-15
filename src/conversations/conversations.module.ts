import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './conversations.entity';
import { ConversationsController } from './conversations.controller';
import { UsersModule } from 'src/users/users.module';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation]), UsersModule],
  providers: [ConversationsService],
  controllers: [ConversationsController]
})
export class ConversationsModule {}
