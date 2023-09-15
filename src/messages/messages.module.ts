import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './messages.entity';
import { MessagesController } from './messages.controller';
import { ConversationsModule } from 'src/conversations/conversations.module';
import { UsersModule } from 'src/users/users.module';
import { ConversationsService } from 'src/conversations/conversations.service';
import { UsersService } from 'src/users/users.service';
import { Conversation } from 'src/conversations/conversations.entity';
import { User } from 'src/users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), ConversationsModule, TypeOrmModule.forFeature([Conversation]), TypeOrmModule.forFeature([User])],
  providers: [MessagesService, ConversationsService, UsersService],
  controllers: [MessagesController],
  exports: [MessagesService]
})
export class MessagesModule {}
