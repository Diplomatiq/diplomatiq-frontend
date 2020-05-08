import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export enum ForgotPasswordModalResultEnum {
    Cancel,
    Confirm,
}

export type ForgotPasswordModalResult =
    | {
          result: ForgotPasswordModalResultEnum.Cancel;
          emailAddress: undefined;
      }
    | {
          result: ForgotPasswordModalResultEnum.Confirm;
          emailAddress: string;
      };

@Component({
    selector: 'diplomatiq-frontend-forgot-password-modal',
    templateUrl: './forgot-password-modal.component.html',
    styleUrls: ['./forgot-password-modal.component.scss'],
})
export class ForgotPasswordModalComponent {
    @Input()
    public emailAddress = '';

    public constructor(private readonly activeModal: NgbActiveModal) {}

    public validateForm(): boolean {
        return this.emailAddress !== '';
    }

    public cancel(): void {
        this.activeModal.close({
            result: ForgotPasswordModalResultEnum.Cancel,
            emailAddress: undefined,
        });
    }

    public confirm(): void {
        this.activeModal.close({
            result: ForgotPasswordModalResultEnum.Confirm,
            emailAddress: this.emailAddress,
        });
    }
}
