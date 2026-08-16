// export interface NotificationResponse {
//   id: number;
//   message: string;
//  type: string;
//   relatedId: number;
//   createdAt: string;
//   read: boolean;
// }

export interface NotificationResponse {

  id: number;

  message: string;

  type: any;

  relatedId: number | null;

  actorName: string | null;

  actorProfilePicture: string | null;

  read: boolean;

  createdAt: string;
}