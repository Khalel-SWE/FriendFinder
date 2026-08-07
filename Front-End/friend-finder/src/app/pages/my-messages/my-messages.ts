import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Message {
  id: number;
  type: string;
  message: string;
  status: 'OPEN' | 'REPLIED';
  adminReply?: string;
}

@Component({
  selector: 'app-my-messages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-messages.html',
  styleUrl: './my-messages.css'
})
export class MyMessages {

  messages: Message[] = [

    {
      id: 1,
      type: 'Complaint',
      message: 'The website is slow.',
      status: 'REPLIED',
      adminReply: 'Thanks for reporting. The issue has been fixed.'
    },

    {
      id: 2,
      type: 'Suggestion',
      message: 'Please add dark mode.',
      status: 'OPEN'
    }

  ];

}