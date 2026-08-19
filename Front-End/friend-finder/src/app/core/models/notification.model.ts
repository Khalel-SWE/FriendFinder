// export interface NotificationResponse {
//   id: number;
//   message: string;
//  type: string;
//   relatedId: number;
//   createdAt: string;
//   read: boolean;
// }

// export interface NotificationResponse {

//   id: number;

//   message: string;

//   type: any;

//   relatedId: number | null;

//   actorName: string | null;

//   actorProfilePicture: string | null;

//   read: boolean;

//   createdAt: string;
// }

export type NotificationType =
  | 'LIKE'
  | 'COMMENT'
  | 'FRIEND_REQUEST'
  | 'ACCEPT_FRIEND_REQUEST'
  | 'NEW_CONTACT_MESSAGE'
  | 'ADMIN_REPLY';


export interface NotificationResponse {

  id: number;

  message: string;

  type: NotificationType;

  relatedId: number | null;

  actorName: string | null;

  actorProfilePicture: string | null;

  read: boolean;

  createdAt: string;
}