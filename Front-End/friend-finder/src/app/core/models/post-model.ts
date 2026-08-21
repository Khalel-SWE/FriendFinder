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

// export interface Post {
//   id: number;
//   authorName: string;
//   authorInitials: string;
//   timeLabel: string;
//   text?: string;
//   mediaType?: 'image' | 'video';
//   mediaUrl?: string;
//   reactions: Record<ReactionType, number>;
//   commentsCount: number;
//   comments?: CommentResponse[]; // 👈 السطر ده اللي كان ناقص
// }

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

  currentUserReaction?: ReactionType | null;

  commentsCount: number;

  comments?: CommentResponse[];

}

export interface FriendSuggestion {
  id: number;
  name: string;
  initials: string;
  mutualCount: number;
}

// مطابق للـ ProfileResponse اللي في الجافا
// export interface ProfileResponse {
//   email: string;
//   firstName: string;
//   lastName: string;
//   bio?: string;
//   jobTitle?: string;
//   location?: string;
//   profilePicture?: string;
//   coverPhoto?: string;
//   interests?: string;
//   languages?: string;
// }

// مطابق للـ PostResponse اللي في الجافا
// export interface PostResponse {
//   id: number;
//   userEmail: string;
//   userFirstName: string;
//   userLastName: string;
//   content?: string;
//   mediaUrl?: string;
//   mediaType?: string;
//   createdAt: string;
//   reactionsCount?: Record<string, number>; // 👈 السطر ده اللي كان ناقص
//   currentUserReaction?: string;            // 👈 السطر ده اللي كان ناقص
//   commentsCount?: number;                  // 👈 السطر ده اللي كان ناقص
//   comments?: CommentResponse[];            // 👈 السطر ده اللي كان ناقص
// }

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

