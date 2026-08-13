import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  AdminService,
  AdminContact
} from '../../core/services/admin';

@Component({
  selector: 'app-admin-contacts',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './admin-contacts.html',
  styleUrl: './admin-contacts.css'
})
export class AdminContacts implements OnInit {

  contacts: AdminContact[] = [];

  loading = false;

  replyDrafts: {
    [id: number]: string;
  } = {};

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {

    this.loading = true;

    this.adminService
      .getContacts()
      .subscribe({

        next: (response) => {

          this.contacts = response;

          this.loading = false;

          this.cdr.detectChanges();
        },

        error: (err) => {

          console.error('Failed to load contacts', err);

          this.loading = false;

          this.cdr.detectChanges();
        }

      });
  }

  sendReply(contact: AdminContact): void {

    const reply = this.replyDrafts[contact.id]?.trim();

    if (!reply) {
      return;
    }

    this.adminService
      .replyToContact(
        contact.id,
        reply
      )
      .subscribe({

        next: () => {

          this.replyDrafts[contact.id] = '';

          this.loadContacts();

        },

        error: (err) => {

          console.error(
            'Failed to reply to contact',
            err
          );

        }

      });
  }

  closeContact(contact: AdminContact): void {

    this.adminService
      .closeContact(contact.id)
      .subscribe({

        next: () => {

          this.loadContacts();

        },

        error: (err) => {

          console.error(
            'Failed to close contact',
            err
          );

        }

      });
  }

  getTypeLabel(type: AdminContact['type']): string {

    switch (type) {

      case 'COMPLAINT':
        return 'Complaint';

      case 'SUGGESTION':
        return 'Suggestion';

      case 'BUG':
        return 'Bug';

      case 'OTHER':
        return 'Other';

      default:
        return type;
    }
  }
}