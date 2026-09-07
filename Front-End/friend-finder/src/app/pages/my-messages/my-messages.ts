import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../core/services/contact';
import { ContactResponse } from '../../core/models/contact-response';

@Component({
  selector: 'app-my-messages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-messages.html',
  styleUrl: './my-messages.css'
})
export class MyMessages implements OnInit {

  messages: ContactResponse[] = [];

  constructor(
    private contactService: ContactService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.loadMessages();

  }

  loadMessages(): void {

    this.contactService.getMyMessages().subscribe({

      next: (response) => {

        this.messages = response;
        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error('Failed to load messages', error);

      }

    });

  }

}