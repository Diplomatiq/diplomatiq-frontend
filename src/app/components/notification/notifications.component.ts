import { Component } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../types/notification';

@Component({
    selector: 'diplomatiq-frontend-notifications',
    templateUrl: './notifications.component.html',
    host: { '[class.ngb-toasts]': 'true' },
})
export class NotificationsComponent {
    public get notifications(): Notification[] {
        return this.notificationService.notifications;
    }

    public constructor(private readonly notificationService: NotificationService) {}

    public removeNotification(notification: Notification): void {
        this.notificationService.remove(notification);
    }
}
