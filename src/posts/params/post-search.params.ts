import { IsNotEmpty } from 'class-validator';
import { BasePaginationParam } from 'src/common/params';

export class PostSearchParams extends BasePaginationParam {
  @IsNotEmpty()
  title: string;
}
