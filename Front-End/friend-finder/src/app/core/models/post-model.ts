export type ReactionType = 'like' | 'haha' | 'love' | 'sad' | 'angry';

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
  timeLabel: string;
  text?: string;
  mediaType?: 'image' | 'video';
  mediaUrl?: string;
  reactions: Record<ReactionType, number>;
  commentsCount: number;
}

export interface FriendSuggestion {
  id: number;
  name: string;
  initials: string;
  mutualCount: number;
}

// مطابق للـ ProfileResponse اللي في الجافا
export interface ProfileResponse {
  email: string;
  firstName: string;
  lastName: string;
  bio?: string;
  jobTitle?: string;
  location?: string;
  profilePicture?: string;
  coverPhoto?: string;
  interests?: string;
  languages?: string;
}

// مطابق للـ PostResponse اللي في الجافا
export interface PostResponse {
  id: number;
  userEmail: string;
  userFirstName: string;
  userLastName: string;
  content?: string;
  mediaUrl?: string;
  mediaType?: string;
  createdAt: string;
}