import { Component, ElementRef, ViewChild, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../core/services/language';
import { Post } from '../../core/models/post-model';

@Component({
  selector: 'app-post-composer',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './post-composer.html',
  styleUrl: './post-composer.css'
})
export class PostComposer {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  text = '';
  attachedType = signal<'image' | 'video' | null>(null);
  attachedPreviewUrl = signal<string | null>(null);

  postCreated = output<Post>();

  constructor(public lang: LanguageService) {}

  openFilePicker(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.attachedType.set(file.type.startsWith('video') ? 'video' : 'image');
    this.attachedPreviewUrl.set(URL.createObjectURL(file));
  }

  removeAttachment(): void {
    this.attachedType.set(null);
    this.attachedPreviewUrl.set(null);
    if (this.fileInput) this.fileInput.nativeElement.value = '';
  }

  submit(): void {
    const trimmed = this.text.trim();
    const type = this.attachedType();
    if (!trimmed && !type) return;

    const newPost: Post = {
      id: Date.now(),
      authorName: 'Layla Hassan',
      authorInitials: 'LH',
      timeLabel: 'Just now',
      text: trimmed || undefined,
      mediaType: type ?? undefined,
      mediaUrl: type ? this.attachedPreviewUrl()! : undefined,
      reactions: { like: 0, haha: 0, love: 0, sad: 0, angry: 0 },
      commentsCount: 0
    };

    this.postCreated.emit(newPost);
    this.text = '';
    this.removeAttachment();
  }
}