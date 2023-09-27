import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { UserEntity } from '../../users/entities/users.entity';

@Entity('friendships')
export class FriendshipEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.firstFriends)
  firstFriend: UserEntity;

  @RelationId((friendship: FriendshipEntity) => friendship.firstFriend)
  firstFriendId: number;

  @ManyToOne(() => UserEntity, (user) => user.secondFriends)
  secondFriend: UserEntity;

  @RelationId((friendship: FriendshipEntity) => friendship.secondFriend)
  secondFriendId: number;

  @CreateDateColumn()
  friendshipStart: Date;
}
