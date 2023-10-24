import { IsNumber, Max, Min } from 'class-validator';

export class BasePaginationParam {
  @Min(1)
  @IsNumber()
  currentPage: number;

  @Min(5)
  @Max(20)
  perPage: number;
}
