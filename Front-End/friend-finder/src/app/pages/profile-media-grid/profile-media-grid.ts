import { Component, Input, signal } from '@angular/core';

interface MediaPost {
  id: number;
  url?: string;
}

@Component({
  selector: 'app-profile-media-grid',
  standalone: true,
  templateUrl: './profile-media-grid.html',
  styleUrl: './profile-media-grid.css'
})
export class ProfileMediaGrid {
  @Input({ required: true }) mediaType!: 'photo' | 'video';

  // داتا وهمية للشبكة
  items = signal<MediaPost[]>([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);

  get emptyMessage(): string {
    return this.mediaType === 'photo' ? 'No photos yet.' : 'No videos yet.';
  }
  get hintMessage(): string {
    return this.mediaType === 'photo'
      ? 'Only image posts show up here — pulled automatically from the timeline.'
      : 'Only video posts show up here — pulled automatically from the timeline.';
  }
}