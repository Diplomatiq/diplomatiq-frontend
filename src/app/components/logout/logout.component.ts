import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'diplomatiq-frontend-logout',
    templateUrl: './logout.component.html',
    styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {
    public constructor(
        private readonly loginService: LoginService,
        private readonly router: Router,
        private readonly notificationService: NotificationService,
    ) {}

    public async ngOnInit(): Promise<void> {
        await this.loginService.logout();
        await this.router.navigateByUrl('login');
        this.notificationService.success('You have successfully logged out.');
    }
}
