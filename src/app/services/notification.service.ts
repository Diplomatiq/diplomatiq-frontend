import { Injectable } from '@angular/core';
import { Notification } from '../types/notification';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    private static readonly NOTIFICATIONS_VISIBLE_FOR = 5000;

    private notificationQueue: Notification[] = [];
    private nextNotificationId = 1;

    public get notifications(): Notification[] {
        return this.notificationQueue;
    }

    public info(body: string, header?: string): void {
        this.enqueueNotification(header, body, 'bg-primary text-light');
    }

    public success(body: string, header?: string): void {
        this.enqueueNotification(header, body, 'bg-success text-light');
    }

    public warning(body: string, header?: string): void {
        this.enqueueNotification(header, body, 'bg-warning text-light');
    }

    public danger(body: string, header?: string): void {
        this.enqueueNotification(header, body, 'bg-danger text-light');
    }

    public remove(notification: Notification): void {
        this.notificationQueue = this.notificationQueue.filter((n): boolean => n.id !== notification.id);
    }

    private enqueueNotification(header: string, body: string, className: string): void {
        this.notificationQueue.push({
            id: this.nextNotificationId++,
            header,
            body,
            visibleFor: NotificationService.NOTIFICATIONS_VISIBLE_FOR,
            className,
        });
    }
}
