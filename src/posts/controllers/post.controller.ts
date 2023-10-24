import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { PostService } from '../services/post.service';
import { CurrentUser } from 'src/common/decorators';
import { PostDto } from '../dtos';
import { BasePaginationParam } from 'src/common/params';
import { PostSearchParams } from '../params/post-search.params';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async post(@CurrentUser('id') userId, @Body() postDto: PostDto) {
    return this.postService.createPost(postDto);
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  async getPosts(@Query() fetchParams: BasePaginationParam) {
    return this.postService.getPosts(fetchParams);
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  async searchPost(@Query() searchParams: PostSearchParams) {
    return this.postService.searchPosts(searchParams);
  }
}
