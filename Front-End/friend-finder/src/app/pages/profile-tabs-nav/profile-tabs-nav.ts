import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ProfileTab } from '../../core/models/profile-model';

@Component({
  selector: 'app-profile-tabs-nav',
  standalone: true,
  templateUrl: './profile-tabs-nav.html',
  styleUrl: './profile-tabs-nav.css'
})
export class ProfileTabsNav {
  @Input() active: ProfileTab = 'timeline';
  @Output() tabChange = new EventEmitter<ProfileTab>();

  tabs: { key: ProfileTab; label: string }[] = [
    { key: 'timeline', label: 'Timeline' },
    { key: 'about',    label: 'About' },
    { key: 'friends',  label: 'Friends' },
    { key: 'photos',   label: 'Photos' },
    { key: 'videos',   label: 'Videos' },
  ];

  select(tab: ProfileTab): void {
    this.tabChange.emit(tab);
  }
}