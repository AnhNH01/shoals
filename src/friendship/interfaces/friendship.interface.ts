import { User } from 'src/users/interfaces';

export interface FriendShip {
  id: number;
  friendshipStart: Date;
  firstFriend: User;
  secondFriend: User;
  firstFriendId?: number;
  secondFriendId?: number;
}
