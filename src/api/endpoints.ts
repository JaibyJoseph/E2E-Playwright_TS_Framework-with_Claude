export const ENDPOINTS = {
  posts: '/posts',
  postById: (id: number) => `/posts/${id}`,
} as const;
