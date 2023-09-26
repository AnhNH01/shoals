import { User } from 'src/users/interfaces';

export interface FriendRequest {
  id: number;
  receiver?: User;
  receiverId?: number;
  sender?: User;
  senderId?: number;
}
