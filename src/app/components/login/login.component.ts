import { Component } from '@angular/core';
import { EmailAddressValidationService } from '../../services/emailAddressValidation.service';
import { LoginService } from '../../services/login.service';
import { NotificationService } from '../../services/notification.service';
import { SignupService } from '../../services/signup.service';

@Component({
    selector: 'diplomatiq-frontend-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
    public signup = false;
    public signupCompleted = false;

    public emailAddress = '';
    public password = '';
    public firstName = '';
    public lastName = '';

    public get heading(): string {
        if (this.signupCompleted) {
            return 'Validate your email address';
        }

        return this.signup ? 'Sign up for Diplomatiq' : 'Log in to Diplomatiq';
    }

    public get subheading(): string {
        if (this.signupCompleted) {
            return 'You should have received an email by now. Please visit your inbox.';
        }

        return this.signup ? 'Experience the power of the diplomatiq networking.' : 'Welcome back!';
    }

    public get primaryButtonLabel(): string {
        return this.signup ? 'Sign up' : 'Log in';
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
        private readonly loginService: LoginService,
        private readonly signupService: SignupService,
        private readonly emailAddressValidationService: EmailAddressValidationService,
        private readonly notificationService: NotificationService,
    ) {}

    public switchToSignUp(): void {
        this.signup = true;
    }

    public validateForm(): boolean {
        const emailValid = this.emailAddressValidationService.validate(this.emailAddress);
        const emailAndPassword = emailValid && this.password !== '';

        if (!this.signup) {
            return emailAndPassword;
        }

        const name = this.firstName !== '' && this.lastName !== '';
        return emailAndPassword && name;
    }

    public async submit(): Promise<void> {
        if (this.signup) {
            await this.doSignup();
        } else {
            await this.doLogin();
        }
    }

    private async doSignup(): Promise<void> {
        try {
            await this.signupService.signUp(this.emailAddress, this.password, this.firstName, this.lastName);
            this.signupCompleted = true;
        } catch (ex) {
            this.notificationService.danger('An error happened. Please try again later.');
        }
    }

    private async doLogin(): Promise<void> {
        await this.loginService.login(this.emailAddress, this.password);
    }
}
