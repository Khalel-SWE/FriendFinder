import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../core/services/contact';
import { ContactRequest } from '../../core/models/contact-request';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact {

  model: ContactRequest = {

    type: 'OTHER',
    message: ''

  };

  loading = false;

  success = '';

  error = '';

  constructor(
    private contactService: ContactService
  ) {}

  sendMessage() {

    this.loading = true;

    this.success = '';

    this.error = '';

    this.contactService.sendMessage(this.model)
      .subscribe({

        next: () => {

          this.loading = false;

          this.success = 'Your message has been sent successfully.';

          this.model = {

            type: 'OTHER',
            message: ''

          };

        },

        error: () => {

          this.loading = false;

          this.error = 'Something went wrong. Please try again.';

        }

      });

  }

}