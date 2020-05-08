import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { LoginService } from '../../services/login.service';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'diplomatiq-frontend-mfa',
    templateUrl: './mfa.component.html',
    styleUrls: ['./mfa.component.scss'],
})
export class MfaComponent {
    public state: 'mfa' | 'mfa-progress' = 'mfa';

    public verificationCode = '';

    public get heading(): string {
        switch (this.state) {
            case 'mfa':
                return 'A 2nd security check';
            case 'mfa-progress':
                return 'Verifying code…';
        }
    }

    public get subheading(): string {
        switch (this.state) {
            case 'mfa':
                return 'Enter the code your received in email.';
            case 'mfa-progress':
                return 'Please wait…';
        }
    }

    public constructor(
        private readonly loginService: LoginService,
        private readonly notificationService: NotificationService,
        private readonly apiService: ApiService,
        private readonly router: Router,
    ) {}

    public validateForm(): boolean {
        return this.verificationCode !== '';
    }

    public async verifyCode(): Promise<void> {
        try {
            this.state = 'mfa-progress';
            await Promise.all([
                this.loginService.completeLogin(this.verificationCode),
                new Promise((resolve): unknown => setTimeout(resolve, 3000)),
            ]);
            await this.router.navigateByUrl('dashboard');
            this.notificationService.success('You have successfully logged in.');
        } catch (ex) {
            this.notificationService.danger("We couldn't verify your code. Please check your credentials.");
            this.verificationCode = '';
            this.state = 'mfa';
        }
    }

    public async logout(): Promise<void> {
        /* noawait */ this.loginService.logout();
        await this.router.navigateByUrl('login');
        this.notificationService.success('You have successfully logged out.');
    }

    public async resendVerificationCode(): Promise<void> {
        await this.apiService.passwordElevatedAuthenticationSessionMethodsApi.elevateAuthenticationSessionInitV1();
        this.notificationService.success('The code was sent to your email.');
    }
}
