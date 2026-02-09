// === Enums ===
export type PostStatus = "SOLVED" | "UNSOLVED";
export type TagCategory = "LANGUAGE" | "FRAMEWORK";

// === Response Wrappers ===
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
  errorCode: string | null;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// === Member ===
export interface MemberResponse {
  id: number;
  nickname: string;
  profileImage: string | null;
  createdAt: string;
}

export interface LoginResponse {
  accessToken: string;
  member: MemberResponse;
}

// === Tag ===
export interface TagResponse {
  id: number;
  name: string;
  category: TagCategory;
}

// === Post ===
export interface PostResponse {
  id: number;
  title: string;
  content: string;
  postStatus: PostStatus;
  member: MemberResponse;
  tags: TagResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface PostListResponse {
  id: number;
  title: string;
  status: PostStatus;
  commentCount: number;
  member: MemberResponse;
  tags: TagResponse[];
  updatedAt: string;
}

// === Comment ===
export interface CommentResponse {
  id: number;
  content: string;
  member: MemberResponse;
  createdAt: string;
  updatedAt: string;
  modified: boolean;
}

// === Request Types ===
export interface SignUpRequest {
  nickname: string;
  password: string;
}

export interface LoginRequest {
  nickname: string;
  password: string;
}

export interface PostCreateRequest {
  title: string;
  content: string;
  tagIds: number[];
}

export interface PostUpdateRequest {
  title: string;
  content: string;
  tagIds: number[];
}

export interface PostStatusUpdateRequest {
  status: PostStatus;
}

export interface CommentCreateRequest {
  content: string;
}

export interface CommentUpdateRequest {
  content: string;
}

export interface MemberUpdateRequest {
  nickname: string;
}
