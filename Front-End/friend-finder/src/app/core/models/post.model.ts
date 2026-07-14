export type ReactionType = 'like' | 'haha' | 'love' | 'sad' | 'angry';

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