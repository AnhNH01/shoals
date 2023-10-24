import { Comment, Post } from 'src/posts/interfaces';
import { Message } from 'src/real-time-messaging/interfaces';

export interface User {
  id: number;
  name?: string;
  email?: string;
  password?: string;
  refreshToken?: string;
  posts?: Post[];
  comments?: Comment[];
  messages?: Message[];
}
