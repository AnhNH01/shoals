import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { UserEntity } from '../../users/entities/users.entity';

export enum FriendRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
}

@Entity('friend_requests')
export class FriendRequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.friendRequestReceived)
  receiver: UserEntity;

  @RelationId((friendRequest: FriendRequestEntity) => friendRequest.receiver)
  receiverId: number;

  @ManyToOne(() => UserEntity, (user) => user.friendRequestsSent)
  sender: UserEntity;

  @RelationId((friendRequest: FriendRequestEntity) => friendRequest.sender)
  senderId: number;

  @Column({
    type: 'enum',
    enum: FriendRequestStatus,
    default: FriendRequestStatus.PENDING,
  })
  status: FriendRequestStatus;
}
