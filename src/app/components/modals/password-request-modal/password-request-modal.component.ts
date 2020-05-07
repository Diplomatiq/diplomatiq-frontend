import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export enum PasswordRequestModalResultEnum {
    Cancel,
    Confirm,
}

export type PasswordRequestModalResult =
    | {
          result: PasswordRequestModalResultEnum.Cancel;
          password: undefined;
      }
    | {
          result: PasswordRequestModalResultEnum.Confirm;
          password: string;
      };

@Component({
    selector: 'diplomatiq-frontend-password-request-modal',
    templateUrl: './password-request-modal.component.html',
    styleUrls: ['./password-request-modal.component.scss'],
})
export class PasswordRequestModalComponent {
    public password = '';

    public constructor(private readonly activeModal: NgbActiveModal) {}

    public cancel(): void {
        this.activeModal.close({
            result: PasswordRequestModalResultEnum.Cancel,
            password: undefined,
        });
    }

    public confirm(): void {
        this.activeModal.close({
            result: PasswordRequestModalResultEnum.Confirm,
            password: this.password,
        });
    }
}
