import { BasePaginationParam } from 'src/common/params/pagination.params';

export class PostDto extends BasePaginationParam {
  userId: number;
  text: string;
  imageUrl?: string;
}
