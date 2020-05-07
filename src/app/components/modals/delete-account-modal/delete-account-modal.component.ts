import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export enum DeleteAccountModalResultEnum {
    Confirm,
    Cancel,
}

@Component({
    selector: 'diplomatiq-frontend-delete-account-modal',
    templateUrl: './delete-account-modal.component.html',
    styleUrls: ['./delete-account-modal.component.scss'],
})
export class DeleteAccountModalComponent {
    public constructor(private readonly activeModal: NgbActiveModal) {}

    public confirm(): void {
        this.activeModal.close(DeleteAccountModalResultEnum.Confirm);
    }

    public cancel(): void {
        this.activeModal.close(DeleteAccountModalResultEnum.Cancel);
    }
}
