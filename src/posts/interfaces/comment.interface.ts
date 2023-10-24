import { User } from 'src/users/interfaces';
import { Post } from './post.interface';

export interface Comment {
  id: number;
  text: string;
  user: User;
  post: Post;
  createdAt: Date;
  updatedAt: Date;
}
