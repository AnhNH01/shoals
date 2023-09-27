import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { FriendshipController } from './friendship.controller';
import { FriendShipService } from './services/friendship.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequestEntity } from './entities/friend-request.entity';
import { FriendshipEntity } from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([FriendshipEntity, FriendRequestEntity]),
    UsersModule,
  ],
  controllers: [FriendshipController],
  providers: [FriendShipService],
})
export class FriendshipModule {}
