import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EmailAddressValidationService } from '../../services/email-address-validation.service';
import { NotificationService } from '../../services/notification.service';
import { SignupService } from '../../services/signup.service';

@Component({
    selector: 'diplomatiq-frontend-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
    public state: 'signup' | 'signup-progress' = 'signup';

    public emailAddress = '';
    public password = '';
    public firstName = '';
    public lastName = '';

    public get heading(): string {
        switch (this.state) {
            case 'signup':
                return 'Sign up for Diplomatiq';
            case 'signup-progress':
                return 'Signing you up…';
        }
    }

    public get subheading(): string {
        switch (this.state) {
            case 'signup':
                return 'Experience the power of the diplomatiq networking.';
            case 'signup-progress':
                return 'Please wait.';
        }
    }

    public get primaryButtonLabel(): string {
        switch (this.state) {
            case 'signup':
                return 'Sign up';
        }
    }

    public get nameHelper(): string {
        if (this.firstName !== '' && this.lastName !== '') {
            return `Welcome aboard, ${this.firstName} ${this.lastName}!`;
        }

        if (this.firstName !== '') {
            return `Welcome aboard, ${this.firstName}!`;
        }

        return 'Welcome aboard!';
    }

    public constructor(
        private readonly signupService: SignupService,
        private readonly emailAddressValidationService: EmailAddressValidationService,
        private readonly notificationService: NotificationService,
        private readonly router: Router,
    ) {}

    public validateForm(): boolean {
        return (
            this.emailAddressValidationService.validate(this.emailAddress) &&
            this.password !== '' &&
            this.firstName !== '' &&
            this.lastName !== ''
        );
    }

    public async signup(): Promise<void> {
        try {
            this.state = 'signup-progress';
            await Promise.all([
                this.signupService.signup(this.emailAddress, this.password, this.firstName, this.lastName),
                new Promise((resolve): unknown => setTimeout(resolve, 3000)),
            ]);
            await this.router.navigateByUrl('validate-your-email');
        } catch (ex) {
            this.notificationService.danger('An error happened. Please try again later.');
            this.password = '';
            this.state = 'signup';
        }
    }

    public async switchToLogin(): Promise<void> {
        await this.router.navigateByUrl('login');
    }
}
