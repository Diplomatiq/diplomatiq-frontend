import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GetMyOrganizedConferencesV1Response } from '../../../../openapi/api';

export enum CancelConferenceModalResultEnum {
    Cancel,
    Confirm,
}

@Component({
    selector: 'diplomatiq-frontend-cancel-conference-modal',
    templateUrl: './cancel-conference-modal.component.html',
    styleUrls: ['./cancel-conference-modal.component.scss'],
})
export class CancelConferenceModalComponent {
    @Input()
    public conference: GetMyOrganizedConferencesV1Response;

    public constructor(private readonly activeModal: NgbActiveModal) {}

    public cancel(): void {
        this.activeModal.close(CancelConferenceModalResultEnum.Cancel);
    }

    public confirm(): void {
        this.activeModal.close(CancelConferenceModalResultEnum.Confirm);
    }
}
