import { Exclude } from 'class-transformer';
import { ConversationEntity } from 'src/real-time-messaging/entites/conversation.entity';
import { MessageEntity } from 'src/real-time-messaging/entites/message.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { FriendRequestEntity } from '../../friendship/entities/friend-request.entity';
import { FriendshipEntity } from 'src/friendship/entities';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @ManyToMany(() => ConversationEntity, (conversation) => conversation.users)
  conversations: ConversationEntity[];

  @Column({ nullable: true })
  @Exclude()
  refreshToken: string;

  @OneToMany(() => FriendshipEntity, (friendship) => friendship.firstFriend)
  @JoinColumn()
  firstFriends: FriendshipEntity[];

  @OneToMany(() => FriendshipEntity, (friendship) => friendship.secondFriend)
  secondFriends: FriendshipEntity[];

  messages: MessageEntity[];

  friendRequestsSent: FriendRequestEntity[];

  friendRequestReceived: FriendRequestEntity[];
}
