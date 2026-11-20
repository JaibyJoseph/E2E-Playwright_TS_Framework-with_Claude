import type { SortOrder } from '@src/types/framework.types';

export interface UiUser {
  username: string;
}

export interface SortOption {
  label: string;
  field: 'name' | 'price';
  order: SortOrder;
}

export interface Post {
  id?: number;
  userId: number;
  title: string;
  body: string;
}
