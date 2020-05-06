import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EmailAddressValidationService } from '../../services/emailAddressValidation.service';
import { LoginService } from '../../services/login.service';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'diplomatiq-frontend-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
    public state: 'login' | 'login-progress' = 'login';

    public emailAddress = '';
    public password = '';

    public get heading(): string {
        switch (this.state) {
            case 'login':
                return 'Log in to Diplomatiq';
            case 'login-progress':
                return 'Logging you in…';
        }
    }

    public get subheading(): string {
        switch (this.state) {
            case 'login':
                return 'Welcome back!';
            case 'login-progress':
                return 'Please wait.';
        }
    }

    public constructor(
        private readonly loginService: LoginService,
        private readonly emailAddressValidationService: EmailAddressValidationService,
        private readonly notificationService: NotificationService,
        private readonly router: Router,
    ) {}

    public validateForm(): boolean {
        return this.emailAddressValidationService.validate(this.emailAddress) && this.password !== '';
    }

    public async initLogin(): Promise<void> {
        try {
            this.state = 'login-progress';
            await Promise.all([
                this.loginService.initLogin(this.emailAddress, this.password),
                new Promise((resolve): unknown => setTimeout(resolve, 3000)),
            ]);
            await this.router.navigateByUrl('mfa');
        } catch (ex) {
            this.notificationService.danger("We couldn't log you in. Please check your credentials.");
            this.password = '';
            this.state = 'login';
        }
    }

    public async switchToSignUp(): Promise<void> {
        await this.router.navigateByUrl('signup');
    }
}
