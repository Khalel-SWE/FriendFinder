export interface ProfileResponse {
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
  jobTitle: string;
  location: string;
  profilePicture: string;
  coverPhoto: string;
  interests: string;   // مفصولة بفاصلة من الباك إند
  languages: string;   // مفصولة بفاصلة من الباك إند
}

export interface TimelinePost {
  id: number;
  text: string;
  timeLabel: string;
}

export interface ActivityItem {
  id: number;
  actionKey: 'liked' | 'commented' | 'posted' | 'friended';
  targetName?: string;
  timeLabel: string;
}

export interface FriendItem {
  id: number;
  name: string;
  initials: string;
  gradient: 'from-burgundy' | 'from-gold';
  mutualCount: number;
}

export type ProfileTab = 'timeline' | 'about' | 'friends' | 'photos' | 'videos';
