import { User } from 'src/users/interfaces';
import { Comment } from './comment.interface';

export interface Post {
  id: number;
  user: User;
  text: string;
  imageUrl?: string;
  createdAt?: Date;
  updatesAt?: Date;
  comments?: Comment[];
}
