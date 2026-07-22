import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-details-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile-details-form.html',
  styleUrl: './profile-details-form.css'
})
export class ProfileDetailsFormComponent {
  form = input.required<FormGroup>();

  save = output<void>();
  cancel = output<void>();

  onSave(): void {
    if (this.form().invalid) {
      this.form().markAllAsTouched();
      return;
    }
    this.save.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}