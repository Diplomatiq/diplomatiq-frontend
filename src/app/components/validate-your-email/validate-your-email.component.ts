import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { ApiService } from '../../services/api.service';
import { NotificationService } from '../../services/notification.service';
import { SignupService } from '../../services/signup.service';

@Component({
    selector: 'diplomatiq-frontend-validate-your-email',
    templateUrl: './validate-your-email.component.html',
    styleUrls: ['./validate-your-email.component.scss'],
})
export class ValidateYourEmailComponent implements OnInit {
    private emailAddress?: string;

    public constructor(
        private readonly signupService: SignupService,
        private readonly apiService: ApiService,
        private readonly notificationService: NotificationService,
        private readonly loginService: LoginService,
        private readonly router: Router,
    ) {}

    public ngOnInit(): void {
        this.emailAddress = this.signupService.flushValidationEmailAddress();
    }

    public async resendValidationEmail(): Promise<void> {
        await this.apiService.unauthenticatedMethodsApi.resendValidationEmail({ emailAddress: this.emailAddress });
        this.notificationService.success('The email was successfully sent.');
    }

    public async logout(): Promise<void> {
        /* noawait */ this.loginService.logout();
        await this.router.navigateByUrl('login');
        this.notificationService.success('You have successfully logged out.');
    }
}
