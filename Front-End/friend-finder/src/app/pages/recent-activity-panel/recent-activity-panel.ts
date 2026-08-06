import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivityService } from '../../core/services/activity';
import { ActivityResponse } from '../../core/models/activity-model';

@Component({
  selector: 'app-recent-activity-panel',
  standalone: true,
  imports: [],
  templateUrl: './recent-activity-panel.html',
  styleUrl: './recent-activity-panel.css',
})
export class RecentActivityPanel implements OnInit {

  private activityService = inject(ActivityService);

  activities = signal<any[]>([]);

  ngOnInit(): void {

    this.activityService.getActivities().subscribe({

      next: (data: ActivityResponse[]) => {

        const recent = data.slice(0, 5).map(activity => ({

          id: activity.id,

          text: this.getActivityText(activity.activityType),

          time: this.calculateTimeAgo(activity.createdAt)

        }));

        this.activities.set(recent);

      },

      error: err => console.error('Error loading activities', err)

    });

  }

  private getActivityText(type: string): string {

    switch (type) {

      case 'POST_CREATED':
        return 'Published a new post';

      case 'COMMENT_CREATED':
        return 'Commented on a post';

      case 'REACTION_ADDED':
        return 'Reacted to a post';

      case 'FRIEND_ADDED':
        return 'Became friends with someone';

      default:
        return type;

    }

  }

  private calculateTimeAgo(dateString: string): string {

    const date = new Date(dateString);

    const now = new Date();

    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) return `${minutes}m`;

    const hours = Math.floor(minutes / 60);

    if (hours < 24) return `${hours}h`;

    const days = Math.floor(hours / 24);

    if (days < 7) return `${days}d`;

    return date.toLocaleDateString();

  }

}