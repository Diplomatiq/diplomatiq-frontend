import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export enum ChangePasswordModalResultEnum {
    Cancel,
    Confirm,
}

export type ChangePasswordModalResult =
    | {
          result: ChangePasswordModalResultEnum.Cancel;
          newPassword: undefined;
      }
    | {
          result: ChangePasswordModalResultEnum.Confirm;
          newPassword: string;
      };

@Component({
    selector: 'diplomatiq-frontend-change-password-modal',
    templateUrl: './change-password-modal.component.html',
    styleUrls: ['./change-password-modal.component.scss'],
})
export class ChangePasswordModalComponent {
    public newPassword = '';

    public constructor(private readonly activeModal: NgbActiveModal) {}

    public validateForm(): boolean {
        return this.newPassword !== '';
    }

    public cancel(): void {
        this.activeModal.close({
            result: ChangePasswordModalResultEnum.Cancel,
            oldPassword: undefined,
            newPassword: undefined,
        });
    }

    public confirm(): void {
        this.activeModal.close({
            result: ChangePasswordModalResultEnum.Confirm,
            newPassword: this.newPassword,
        });
    }
}
