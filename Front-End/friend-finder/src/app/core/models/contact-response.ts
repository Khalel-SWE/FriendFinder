export interface ContactResponse {

  id: number;

  senderName: string;

  senderEmail: string;

  type: 'COMPLAINT' | 'SUGGESTION' | 'BUG' | 'OTHER';

  message: string;

  adminReply: string | null;

  status: 'OPEN' | 'REPLIED' | 'CLOSED';

  createdAt: string;

  repliedAt: string | null;

}