import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export enum ResetPasswordModalResultEnum {
    Cancel,
    Confirm,
}

export type ResetPasswordModalResult =
    | {
          result: ResetPasswordModalResultEnum.Cancel;
          newPassword: undefined;
      }
    | {
          result: ResetPasswordModalResultEnum.Confirm;
          newPassword: string;
      };

@Component({
    selector: 'diplomatiq-frontend-reset-password-modal',
    templateUrl: './reset-password-modal.component.html',
    styleUrls: ['./reset-password-modal.component.scss'],
})
export class ResetPasswordModalComponent {
    public newPassword = '';

    public constructor(private readonly activeModal: NgbActiveModal) {}

    public validateForm(): boolean {
        return this.newPassword !== '';
    }

    public cancel(): void {
        this.activeModal.close({
            result: ResetPasswordModalResultEnum.Cancel,
            newPassword: undefined,
        });
    }

    public confirm(): void {
        this.activeModal.close({
            result: ResetPasswordModalResultEnum.Confirm,
            newPassword: this.newPassword,
        });
    }
}
