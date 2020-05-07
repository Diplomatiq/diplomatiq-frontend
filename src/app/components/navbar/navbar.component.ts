import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { SessionService } from '../../services/session.service';

@Component({
    selector: 'diplomatiq-frontend-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
    public isUserMenuVisible: boolean;
    public userFullName: string;
    public userEmailAddress: string;

    public constructor(
        private readonly sessionService: SessionService,
        private readonly router: Router,
        private readonly loginService: LoginService,
    ) {}

    public async ngOnInit(): Promise<void> {
        this.loginService.loggedIn.subscribe(
            async (): Promise<void> => {
                const userIdentity = await this.sessionService.getUserIdentity();
                this.userFullName = `${userIdentity.firstName} ${userIdentity.lastName}`;
                this.userEmailAddress = userIdentity.emailAddress;
                this.isUserMenuVisible = true;
            },
        );
        this.loginService.loggedOut.subscribe((): void => {
            this.isUserMenuVisible = false;
            this.userFullName = undefined;
            this.userEmailAddress = undefined;
        });

        const isLoggedIn = await this.loginService.isLoggedIn();
        if (isLoggedIn) {
            const userIdentity = await this.sessionService.getUserIdentity();
            this.userFullName = `${userIdentity.firstName} ${userIdentity.lastName}`;
            this.userEmailAddress = userIdentity.emailAddress;
            this.isUserMenuVisible = true;
        }
    }

    public async navigateToRoot(): Promise<void> {
        await this.router.navigateByUrl('/');
    }

    public async logout(): Promise<void> {
        await this.loginService.logout();
        await this.router.navigateByUrl('login');
    }
}
