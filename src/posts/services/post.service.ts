import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from '../entities/post.entity';
import { Like, Repository } from 'typeorm';
import { CommentEntity } from '../entities/comment.entity';
import { CommentDto } from '../dtos/comment.dto';
import { PostDto } from '../dtos';
import { BasePaginationParam } from 'src/common/params';
import { PostSearchParams } from '../params/post-search.params';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}

  async getPosts(fetchParams: BasePaginationParam) {
    const { currentPage, perPage } = fetchParams;

    const skip = (currentPage - 1) * perPage;

    const [posts, count] = await this.postRepository.findAndCount({
      take: perPage,
      skip: skip,
    });

    return {
      posts: posts,
      total: count,
    };
  }

  async searchPosts(searchParams: PostSearchParams) {
    const { title, currentPage, perPage } = searchParams;
    const skip = (currentPage - 1) * perPage;

    const [posts, count] = await this.postRepository.findAndCount({
      where: {
        title: Like(`%${title}%`),
      },
      skip: skip,
      take: perPage,
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      posts: posts,
      total: count,
    };
  }

  async createPost(postDto: PostDto) {
    const post = this.postRepository.create(postDto);
    return await this.postRepository.save(post);
  }

  async deletePost(postId: number) {
    return await this.postRepository.delete({ id: postId });
  }

  async updatePost() {
    return;
  }

  async postComment(postId: number, commentDto: CommentDto) {
    const post = this.postRepository.findOneBy({ id: postId });
    if (!post) {
      throw new NotFoundException("Post doesn't exist");
    }
    const comment = this.commentRepository.create({
      user: { id: commentDto.userId },
      post: { id: commentDto.postId },
      text: commentDto.text,
    });

    await this.commentRepository.save(comment);
    return comment;
  }

  async deleteComment(commentId: number) {
    return await this.commentRepository.delete({ id: commentId });
  }
}
