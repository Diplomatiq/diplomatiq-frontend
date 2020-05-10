import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faShareSquare } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExploreConferencesV1Response } from '../../openapi/api';
import {
    ApplyConferenceModalComponent,
    ApplyConferenceModalResult,
    ApplyConferenceModalResultEnum,
} from '../components/modals/apply-conference-modal/apply-conference-modal.component';
import { ConferenceService } from '../services/conference.service';
import { CountriesService } from '../services/countries.service';
import { NotificationService } from '../services/notification.service';

@Component({
    selector: 'diplomatiq-frontend-explore',
    templateUrl: './explore.component.html',
    styleUrls: ['./explore.component.scss'],
})
export class ExploreComponent implements OnInit {
    public readonly faShareSquare = faShareSquare;

    public conferences: ExploreConferencesV1Response[] = [];

    public constructor(
        private readonly conferenceService: ConferenceService,
        private readonly countriesService: CountriesService,
        private readonly router: Router,
        private readonly modalService: NgbModal,
        private readonly notificationService: NotificationService,
    ) {}

    public async ngOnInit(): Promise<void> {
        this.conferences = await this.conferenceService.exploreConferences();
    }

    public getDisplayedDate(localDateString: string): string {
        return localDateString.replace(/-/gu, '/');
    }

    public getCountryDisplayName(alpha2CountryCode: string): string {
        return this.countriesService.getCountryDisplayName(alpha2CountryCode);
    }

    public async apply(conference: ExploreConferencesV1Response): Promise<void> {
        const modal = this.modalService.open(ApplyConferenceModalComponent);
        modal.componentInstance.conference = conference;
        const modalResult: ApplyConferenceModalResult = await modal.result;
        if (modalResult.result === ApplyConferenceModalResultEnum.Confirm) {
            const committeeSeatId = modalResult.committeeSeatId;
            await this.conferenceService.applyConference(committeeSeatId);
            this.notificationService.success('You have successfully applied to the conference.');
            await this.router.navigateByUrl('dashboard');
        }
    }
}
