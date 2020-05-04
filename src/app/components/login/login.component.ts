import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { SignupService } from '../../services/signup.service';

@Component({
    selector: 'diplomatiq-frontend-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
    public signup = false;

    public emailAddress = '';
    public password = '';
    public firstName = '';
    public lastName = '';

    public get heading(): string {
        return this.signup ? 'Sign up for Diplomatiq' : 'Log in to Diplomatiq';
    }

    public get subheading(): string {
        return this.signup ? 'Experience the power of the diplomatiq networking.' : 'Welcome back!';
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

    public constructor(private readonly loginService: LoginService, private readonly signupService: SignupService) {}

    public switchToSignUp(): void {
        this.signup = true;
    }

    public validateForm(): boolean {
        const emailAndPassword = this.emailAddress !== '' && this.password !== '';

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
        await this.signupService.signUp(this.emailAddress, this.password, this.firstName, this.lastName);
    }

    private async doLogin(): Promise<void> {
        await this.loginService.login(this.emailAddress, this.password);
    }
}
