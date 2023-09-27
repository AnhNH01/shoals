import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { RealTimeMessagingModule } from './real-time-messaging/real-time-messaging.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAccessGuard } from './common/guards/jwt-access.guard';
import { FriendshipModule } from './friendship/friendship.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      cache: true,
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    RealTimeMessagingModule,
    FriendshipModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAccessGuard,
    },
  ],
})
export class AppModule {}
