import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export enum MfaRequestModalResultEnum {
    Cancel,
    Confirm,
}

export type MfaRequestModalResult =
    | {
          result: MfaRequestModalResultEnum.Cancel;
          verificationCode: undefined;
      }
    | {
          result: MfaRequestModalResultEnum.Confirm;
          verificationCode: string;
      };

@Component({
    selector: 'diplomatiq-frontend-mfa-request-modal',
    templateUrl: './mfa-request-modal.component.html',
    styleUrls: ['./mfa-request-modal.component.scss'],
})
export class MfaRequestModalComponent {
    public verificationCode = '';

    public constructor(private readonly activeModal: NgbActiveModal) {}

    public validateForm(): boolean {
        return this.verificationCode !== '';
    }

    public cancel(): void {
        this.activeModal.close({
            result: MfaRequestModalResultEnum.Cancel,
            verificationCode: undefined,
        });
    }

    public confirm(): void {
        this.activeModal.close({
            result: MfaRequestModalResultEnum.Confirm,
            verificationCode: this.verificationCode,
        });
    }
}
