import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DataSource, Repository } from 'typeorm';

import {
  FriendRequestEntity,
  FriendRequestStatus,
} from '../entities/friend-request.entity';

import { FriendRequestDto } from '../dtos/friend-request.dto';
import { UsersService } from 'src/users/services/users.service';
import { ConversationEntity } from 'src/real-time-messaging/entites';
import { FriendshipEntity } from '../entities';

@Injectable()
export class FriendShipService {
  constructor(
    @InjectRepository(FriendRequestEntity)
    private readonly friendRequestRepository: Repository<FriendRequestEntity>,
    @InjectRepository(FriendshipEntity)
    private readonly friendshipRepository: Repository<FriendshipEntity>,
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  async createFriendRequest(friendRequestDto: FriendRequestDto) {
    if (friendRequestDto.receiverId === friendRequestDto.senderId)
      throw new BadRequestException('Invalid friend request');

    const users = await this.usersService.findManyByIds([
      friendRequestDto.senderId,
      friendRequestDto.receiverId,
    ]);
    if (users.length !== 2)
      throw new BadRequestException('Invalid friend request');

    const existed = await this.friendRequestRepository.find({
      relations: {
        sender: true,
        receiver: true,
      },
      where: [
        {
          sender: {
            id: friendRequestDto.senderId,
          },
          receiver: {
            id: friendRequestDto.receiverId,
          },
        },
        {
          sender: {
            id: friendRequestDto.receiverId,
          },
          receiver: {
            id: friendRequestDto.senderId,
          },
        },
      ],
      select: {
        sender: {
          id: true,
        },
        receiver: {
          id: true,
        },
      },
    });
    if (existed.length)
      throw new BadRequestException('Already friend or friend request created');

    const friendRequest = this.friendRequestRepository.create({
      sender: { id: friendRequestDto.senderId },
      receiver: { id: friendRequestDto.receiverId },
    });

    await this.friendRequestRepository.save(friendRequest);
    return friendRequest;
  }

  async acceptFriendRequest(userId: number, friendRequestId: number) {
    const friendRequest = await this.friendRequestRepository.findOneBy({
      id: friendRequestId,
    });

    if (!friendRequest)
      throw new NotFoundException('Friend request does not exist');

    if (
      userId === friendRequest.senderId ||
      userId !== friendRequest.receiverId
    )
      throw new BadRequestException("Can't not accept this friend request");
    const existedFriendship = await this.friendshipRepository.findOne({
      relations: {
        firstFriend: true,
        secondFriend: true,
      },
      where: [
        {
          firstFriend: {
            id: friendRequest.senderId,
          },
          secondFriend: {
            id: friendRequest.receiverId,
          },
        },
        {
          firstFriend: {
            id: friendRequest.receiverId,
          },
          secondFriend: {
            id: friendRequest.senderId,
          },
        },
      ],
      select: {
        firstFriend: {
          id: true,
        },
        secondFriend: {
          id: true,
        },
      },
    });

    if (existedFriendship) throw new BadRequestException('Already friend');

    await this.dataSource.transaction(async (manager) => {
      await manager.update(
        FriendRequestEntity,
        { id: friendRequestId },
        {
          status: FriendRequestStatus.ACCEPTED,
        },
      );

      const friendship = manager.create(FriendshipEntity, {
        firstFriend: { id: friendRequest.senderId },
        secondFriend: { id: friendRequest.receiverId },
      });
      await manager.save(friendship);

      const conversation = manager.create(ConversationEntity, {
        users: [
          { id: friendRequest.senderId },
          { id: friendRequest.receiverId },
        ],
      });

      await manager.save(conversation);
    });
  }

  async getFriendsByUser(userId: number) {
    // Todo: try self join on first friend Id equals second friend id

    const friendships = await this.friendshipRepository.find({
      relations: {
        firstFriend: true,
        secondFriend: true,
      },
      where: [
        {
          firstFriend: false,
        },
        {
          secondFriend: {
            id: userId,
          },
        },
      ],
      select: {
        firstFriend: {
          id: true,
        },
        secondFriend: {
          id: true,
        },
      },
    });

    return friendships;
  }

  async getFriendRequestsReceived(userId: number) {
    const friendRequestsReceived = await this.friendRequestRepository.find({
      relations: {
        receiver: true,
      },
      where: {
        receiver: {
          id: userId,
        },
        status: FriendRequestStatus.PENDING,
      },
    });

    return friendRequestsReceived;
  }

  async getFriendRequestsSent(userId: number) {
    const friendRequestsSent = await this.friendRequestRepository.find({
      relations: {
        sender: true,
      },
      where: {
        sender: {
          id: userId,
        },
        status: FriendRequestStatus.PENDING,
      },
    });

    return friendRequestsSent;
  }
}
