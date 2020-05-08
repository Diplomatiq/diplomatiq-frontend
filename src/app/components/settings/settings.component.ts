import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountDeletionService } from '../../services/account-deletion.service';
import { ChangePasswordService } from '../../services/change-password.service';
import { LoginService } from '../../services/login.service';
import { NotificationService } from '../../services/notification.service';
import {
    ChangePasswordModalComponent,
    ChangePasswordModalResult,
    ChangePasswordModalResultEnum,
} from '../modals/change-password-modal/change-password-modal.component';
import {
    DeleteAccountModalComponent,
    DeleteAccountModalResultEnum,
} from '../modals/delete-account-modal/delete-account-modal.component';

@Component({
    selector: 'diplomatiq-frontend-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
    public constructor(
        private readonly modalService: NgbModal,
        private readonly accountDeletionService: AccountDeletionService,
        private readonly router: Router,
        private readonly notificationService: NotificationService,
        private readonly loginService: LoginService,
        private readonly changePasswordService: ChangePasswordService,
    ) {}

    public async deleteAccount(): Promise<void> {
        const modal = this.modalService.open(DeleteAccountModalComponent);
        const result: DeleteAccountModalResultEnum = await modal.result;
        if (result === DeleteAccountModalResultEnum.Confirm) {
            await this.accountDeletionService.deleteAccount();
            await this.loginService.logout();
            await this.router.navigateByUrl('login');
            this.notificationService.success('Your account has been deleted.');
        }
    }

    public async changePassword(): Promise<void> {
        const modal = this.modalService.open(ChangePasswordModalComponent);
        const modalResult: ChangePasswordModalResult = await modal.result;
        if (modalResult.result === ChangePasswordModalResultEnum.Confirm) {
            await this.changePasswordService.changePassword(modalResult.newPassword);
            this.notificationService.success('You have successfully changed your password.');
        }
    }
}
