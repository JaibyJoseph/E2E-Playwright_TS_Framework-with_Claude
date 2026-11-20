import { ENDPOINTS } from '@src/api/endpoints';
import type { ApiClient } from '@src/core/api.client';
import type { ApiResponse } from '@src/types/framework.types';
import type { Post } from '@src/types/test-data.types';

export class PostsService {
  constructor(private readonly api: ApiClient) {}

  getById(id: number): Promise<ApiResponse<Post>> {
    return this.api.send<Post>('GET', ENDPOINTS.postById(id));
  }

  getByUser(userId: number): Promise<ApiResponse<Post[]>> {
    return this.api.send<Post[]>('GET', ENDPOINTS.posts, { params: { userId } });
  }

  create(post: Post): Promise<ApiResponse<Post>> {
    return this.api.send<Post>('POST', ENDPOINTS.posts, { data: post });
  }
}
