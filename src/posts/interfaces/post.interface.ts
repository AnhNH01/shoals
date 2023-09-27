import { User } from 'src/users/interfaces';

export interface Post {
  id: number;
  user: User;
  text: string;
  imageUrl?: string;
  createdAt?: Date;
  updatesAt?: Date;
}
