export interface ActivityResponse {

  id: number;

  activityType:
    | 'POST_CREATED'
    | 'COMMENT_CREATED'
    | 'REACTION_ADDED'
    | 'FRIEND_ADDED';

  referenceId: number | null;

  targetName: string | null;

  createdAt: string;
}