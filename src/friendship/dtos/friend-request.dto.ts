import { IsNotEmpty, IsNumber } from 'class-validator';

export class FriendRequestDto {
  @IsNumber()
  @IsNotEmpty()
  senderId: number;

  @IsNotEmpty()
  @IsNumber()
  receiverId: number;
}
