import { Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { PostsService } from '@src/api/services/posts.service';
import type { CustomWorld } from '@src/support/world';
import type { Post } from '@src/types/test-data.types';

When('I fetch posts for user {int}', async function (this: CustomWorld, userId: number) {
  this.setResponse(await new PostsService(this.api).getByUser(userId));
});

Then('every post should belong to user {int}', function (this: CustomWorld, userId: number) {
  const posts = this.lastResponse.body as Post[];
  expect(posts.length).toBeGreaterThan(0);
  expect(posts.every((post) => post.userId === userId)).toBe(true);
});
