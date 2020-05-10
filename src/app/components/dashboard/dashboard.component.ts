import { Component, OnInit } from '@angular/core';
import { faPlusSquare } from '@fortawesome/free-regular-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConferenceService } from '../../services/conference.service';
import {
    OrganizeConferenceModalComponent,
    OrganizeConferenceModalResult,
    OrganizeConferenceModalResultEnum,
} from '../modals/organize-conference-modal/organize-conference-modal.component';

@Component({
    selector: 'diplomatiq-frontend-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    public readonly faPlusSquare = faPlusSquare;

    public emailAddress: string;

    public constructor(
        private readonly conferenceService: ConferenceService,
        private readonly modalService: NgbModal,
    ) {}

    public async ngOnInit(): Promise<void> {
        await this.getConferences();
    }

    public async organizeConference(): Promise<void> {
        const modal = this.modalService.open(OrganizeConferenceModalComponent, {
            size: 'lg',
        });
        const modalResult: OrganizeConferenceModalResult = await modal.result;
        if (modalResult.result === OrganizeConferenceModalResultEnum.Cancel) {
            return;
        }

        const organizeConferenceRequest = modalResult.organizeConferenceRequest;
        await this.conferenceService.organizeConference(organizeConferenceRequest);

        await this.getConferences();
    }

    private async getConferences(): Promise<void> {
        const participating = await this.conferenceService.getMyConferences();
        console.log(participating);
        const organizing = await this.conferenceService.getMyOrganizedConferences();
        console.log(organizing);
    }
}
