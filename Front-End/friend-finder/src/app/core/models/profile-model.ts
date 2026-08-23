// export interface ProfileResponse {
//   id: number;          // 👈 ضفنا الـ ID هنا
//   email: string;
//   firstName: string;
//   lastName: string;
//   bio: string;
//   jobTitle: string;
//   location: string;
//   profilePicture: string;
//   coverPhoto: string;
//   interests: string; 
//   languages: string; 
// }

// export interface TimelinePost {
//   id: number;
//   text: string;
//   timeLabel: string;
// }

// export interface ActivityItem {
//   id: number;
//   actionKey: 'liked' | 'commented' | 'posted' | 'friended';
//   targetName?: string;
//   timeLabel: string;
// }

// export interface FriendItem {
//   id: number;
//   name: string;
//   initials: string;
//   gradient: 'from-burgundy' | 'from-gold';
//   mutualCount: number;
// }

// export type ProfileTab = 'timeline' | 'about' | 'friends' | 'photos' | 'videos';

// export interface ProfileFormValue {
//   firstName: string;
//   lastName: string;
//   bio: string;
//   jobTitle: string;
//   location: string;
//   interests: string;
//   languages: string;
// }
 
// export interface ProfileMedia {
//   avatarUrl: string | null;
//   avatarInitials: string;
//   coverUrl: string | null;
// }
export type RelationshipStatus =
  | 'SELF'
  | 'NONE'
  | 'OUTGOING_PENDING'
  | 'INCOMING_PENDING'
  | 'FRIEND';

export interface ProfileActivity {
  id: number;
  activityType: string;
  referenceId: number | null;
  targetName: string | null;
  createdAt: string;
}

export interface ProfileResponse {

  id: number;

  email: string;

  firstName: string;
  lastName: string;

  bio: string | null;
  jobTitle: string | null;
  location: string | null;

  profilePicture: string | null;
  coverPhoto: string | null;

  interests: string | null;
  languages: string | null;

  createdAt: string;

  relationshipStatus: RelationshipStatus;
  pendingRequestId: number | null;

  canViewPosts: boolean;

  recentActivities: ProfileActivity[];
}

export interface TimelinePost {
  id: number;
  text: string;
  timeLabel: string;
}

export interface ActivityItem {
  id: number;
  actionKey:
    | 'liked'
    | 'commented'
    | 'posted'
    | 'friended';

  targetName?: string;

  timeLabel: string;
}

export interface FriendItem {
  id: number;
  name: string;
  initials: string;
  gradient:
    | 'from-burgundy'
    | 'from-gold';

  mutualCount: number;
}

export type ProfileTab =
  | 'timeline'
  | 'about'
  | 'friends'
  | 'photos'
  | 'videos';

export interface ProfileFormValue {
  firstName: string;
  lastName: string;
  bio: string;
  jobTitle: string;
  location: string;
  interests: string;
  languages: string;
}

export interface ProfileMedia {
  avatarUrl: string | null;
  avatarInitials: string;
  coverUrl: string | null;
}