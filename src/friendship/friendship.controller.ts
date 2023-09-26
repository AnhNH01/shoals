import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { FriendShipService } from './services/friendship.service';
import { FriendRequestDto } from './dtos';
import { CurrentUser } from 'src/common/decorators';

@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendShipService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  sendFriendRequests(
    @CurrentUser('sub') userId: number,
    @Body() friendRequestDto: FriendRequestDto,
  ) {
    friendRequestDto.senderId = userId;
    return this.friendshipService.createFriendRequest(friendRequestDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  getFriend(@CurrentUser('sub') userId: number) {
    return this.friendshipService.getFriendsByUser(userId);
  }

  @Get('requests/sent')
  @HttpCode(HttpStatus.OK)
  getFriendRequestsSent(@CurrentUser('sub') userId: number) {
    return this.friendshipService.getFriendRequestsSent(userId);
  }

  @Get('requests/received')
  @HttpCode(HttpStatus.OK)
  getFriendRequestsReceived(@CurrentUser('sub') userId: number) {
    return this.friendshipService.getFriendRequestsReceived(userId);
  }

  @Post('requests/:id')
  @HttpCode(HttpStatus.CREATED)
  acceptFriendRequest(
    @CurrentUser('sub') userId: number,
    @Param('id') friendRequestId: number,
  ) {
    return this.friendshipService.acceptFriendRequest(userId, friendRequestId);
  }
}
