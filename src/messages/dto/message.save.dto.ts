import { Conversation } from 'src/conversations/conversations.entity';
import { User } from 'src/users/users.entity';

export class MessageSaveDto {
  user: User;
  text: string;
  sentTime?: Date;
  conversation: Conversation;
}
