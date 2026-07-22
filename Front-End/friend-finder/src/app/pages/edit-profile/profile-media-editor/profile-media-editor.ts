import { Component, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { ProfileMedia } from '../../../core/models/profile-model';

@Component({
  selector: 'app-profile-media-editor',
  standalone: true,
  templateUrl: './profile-media-editor.html',
  styleUrl: './profile-media-editor.css'
})
export class ProfileMediaEditorComponent {
  media = input.required<ProfileMedia>();

  coverChange = output<File>();
  avatarChange = output<File>();

  private coverInput = viewChild.required<ElementRef<HTMLInputElement>>('coverInput');
  private avatarInput = viewChild.required<ElementRef<HTMLInputElement>>('avatarInput');

  coverPreview = signal<string | null>(null);
  avatarPreview = signal<string | null>(null);

  triggerCoverPick(): void {
    this.coverInput().nativeElement.click();
  }

  triggerAvatarPick(): void {
    this.avatarInput().nativeElement.click();
  }

  onCoverSelected(event: Event): void {
    const file = this.extractFile(event);
    if (!file) return;
    this.coverPreview.set(URL.createObjectURL(file));
    this.coverChange.emit(file);
  }

  onAvatarSelected(event: Event): void {
    const file = this.extractFile(event);
    if (!file) return;
    this.avatarPreview.set(URL.createObjectURL(file));
    this.avatarChange.emit(file);
  }

  private extractFile(event: Event): File | null {
    const input = event.target as HTMLInputElement;
    return input.files && input.files.length ? input.files[0] : null;
  }
}