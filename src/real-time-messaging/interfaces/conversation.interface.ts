import { User } from 'src/users/interfaces/users.interface';
import { MessageEntity } from '../entites/message.entity';

export class Conversation {
  id: number;
  users?: User[];
  userIds?: number[];
  messages?: MessageEntity[];
  lastUpdate?: Date;
}
