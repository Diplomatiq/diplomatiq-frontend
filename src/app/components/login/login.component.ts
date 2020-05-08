import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DiplomatiqApiErrorErrorCodeEnum } from '../../../openapi/api';
import { DiplomatiqApiException } from '../../exceptions/diplomatiq-api-exception';
import { ChangePasswordService } from '../../services/change-password.service';
import { EmailAddressValidationService } from '../../services/email-address-validation.service';
import { LoginService } from '../../services/login.service';
import { NotificationService } from '../../services/notification.service';
import {
    ForgotPasswordModalComponent,
    ForgotPasswordModalResult,
    ForgotPasswordModalResultEnum,
} from '../modals/forgot-password-modal/forgot-password-modal.component';
import {
    ResetPasswordModalComponent,
    ResetPasswordModalResult,
    ResetPasswordModalResultEnum,
} from '../modals/reset-password-modal/reset-password-modal.component';

@Component({
    selector: 'diplomatiq-frontend-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
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
        private readonly changePasswordService: ChangePasswordService,
        private readonly emailAddressValidationService: EmailAddressValidationService,
        private readonly notificationService: NotificationService,
        private readonly router: Router,
        private readonly modalService: NgbModal,
        private readonly activatedRoute: ActivatedRoute,
    ) {}

    public async ngOnInit(): Promise<void> {
        const emailAddress = this.activatedRoute.snapshot.queryParamMap.get('email-address');
        const passwordResetKey = this.activatedRoute.snapshot.queryParamMap.get('password-reset-key');
        if (emailAddress !== null) {
            this.emailAddress = decodeURIComponent(emailAddress);
            if (passwordResetKey !== null) {
                await this.resetPassword(emailAddress, passwordResetKey);
            }
        }
    }

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
            if (
                ex instanceof DiplomatiqApiException &&
                ex.errorCode === DiplomatiqApiErrorErrorCodeEnum.EmailAddressNotValidated
            ) {
                await this.router.navigateByUrl('validate-your-email');
            } else {
                this.notificationService.danger("We couldn't log you in. Please check your credentials.");
                this.password = '';
                this.state = 'login';
            }
        }
    }

    public async switchToSignUp(): Promise<void> {
        await this.router.navigateByUrl('signup');
    }

    public async forgotPassword(): Promise<void> {
        const modal = this.modalService.open(ForgotPasswordModalComponent);
        modal.componentInstance.emailAddress = this.emailAddress;
        const modalResult: ForgotPasswordModalResult = await modal.result;
        if (modalResult.result === ForgotPasswordModalResultEnum.Confirm) {
            const emailAddress = modalResult.emailAddress;
            await this.changePasswordService.requestPasswordReset(emailAddress);
            this.notificationService.success('The password reset link was successfully sent.');
        }
    }

    private async resetPassword(emailAddress: string, passwordResetKey: string): Promise<void> {
        const modal = this.modalService.open(ResetPasswordModalComponent);
        const modalResult: ResetPasswordModalResult = await modal.result;
        if (modalResult.result === ResetPasswordModalResultEnum.Confirm) {
            const newPassword = modalResult.newPassword;

            try {
                await this.changePasswordService.resetPassword(emailAddress, newPassword, passwordResetKey);
                this.notificationService.success('Your password was successfully reset. You can log in.');
            } catch (ex) {
                this.notificationService.danger('An error happened. Please try again later.');
            }
        }
    }
}
