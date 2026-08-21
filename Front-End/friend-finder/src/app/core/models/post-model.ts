export type ReactionType =
  | 'like'
  | 'love'
  | 'haha'
  | 'wow'
  | 'sad'
  | 'angry';


export interface CommentResponse {

  id: number;

  content: string;

  userEmail: string;

  userFirstName: string;

  userLastName: string;

  profilePictureUrl?: string;

  createdAt: string;

  updatedAt: string;
}


export interface Post {

  id: number;

  authorName: string;

  authorInitials: string;

  profilePicture?: string;

  timeLabel: string;

  text?: string;

  mediaType?: 'image' | 'video';

  mediaUrl?: string;

  reactions: Record<ReactionType, number>;

  currentUserReaction: ReactionType | null;

  commentsCount: number;

  comments?: CommentResponse[];
}


export interface FriendSuggestion {

  id: number;

  name: string;

  initials: string;

  mutualCount: number;
}


export interface PostResponse {

  id: number;

  userEmail: string;

  userFirstName: string;

  userLastName: string;

  profilePicture?: string;

  content?: string;

  mediaUrl?: string;

  mediaType?: string;

  createdAt: string;

  reactionsCount?: Record<string, number>;

  currentUserReaction?: string;

  commentsCount?: number;

  comments?: CommentResponse[];
}


export interface FriendSuggestionResponse {

  id: number;

  email: string;

  firstName: string;

  lastName: string;

  profilePicture: string;

  initials: string;
}