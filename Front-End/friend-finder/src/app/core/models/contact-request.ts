export interface ContactRequest {

  type: 'COMPLAINT' | 'SUGGESTION' | 'BUG' | 'OTHER';

  message: string;

}
