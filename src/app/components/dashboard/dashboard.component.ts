import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faPlusSquare } from '@fortawesome/free-regular-svg-icons';
import { faTable, faTrashAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
    CommitteeWithSeatsWithDelegate,
    GetMyConferencesV1Response,
    GetMyOrganizedConferencesV1Response,
} from '../../../openapi/api';
import { ConferenceService } from '../../services/conference.service';
import { CountriesService } from '../../services/countries.service';
import { NotificationService } from '../../services/notification.service';
import {
    CancelConferenceModalComponent,
    CancelConferenceModalResultEnum,
} from '../modals/cancel-conference-modal/cancel-conference-modal.component';
import { CountryMatrixModalComponent } from '../modals/country-matrix-modal/country-matrix-modal.component';
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
    public readonly faUserPlus = faUserPlus;
    public readonly faTrashAlt = faTrashAlt;
    public readonly faTable = faTable;

    public role: 'participant' | 'organizer' = 'participant';

    public participantConferences: GetMyConferencesV1Response[] = [];
    public organizerConferences: GetMyOrganizedConferencesV1Response[] = [];

    public constructor(
        private readonly conferenceService: ConferenceService,
        private readonly modalService: NgbModal,
        private readonly countriesService: CountriesService,
        private readonly notificationService: NotificationService,
        private readonly router: Router,
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

        this.notificationService.success('The conference was successfully organized and opened.');

        await this.getConferences();
    }

    public async applyConference(): Promise<void> {
        await this.router.navigateByUrl('explore');
    }

    public getCountryDisplayName(alpha2CountryCode: string): string {
        return this.countriesService.getCountryDisplayName(alpha2CountryCode);
    }

    public getDisplayedDate(localDateString: string): string {
        return localDateString.replace(/-/gu, '/');
    }

    public async cancelConference(conference: GetMyOrganizedConferencesV1Response): Promise<void> {
        const modal = this.modalService.open(CancelConferenceModalComponent);
        modal.componentInstance.conference = conference;
        const modalResult: CancelConferenceModalResultEnum = await modal.result;
        if (modalResult === CancelConferenceModalResultEnum.Confirm) {
            await this.conferenceService.cancelConference(conference.conferenceId);
            this.notificationService.success(
                'The conference was successfully cancelled. All participants received an email about the cancellation.',
            );
            await this.getConferences();
        }
    }

    public async viewCountryMatrix(conference: GetMyOrganizedConferencesV1Response): Promise<void> {
        const countryMatrix: CommitteeWithSeatsWithDelegate[] = await this.conferenceService.getCountryMatrix(
            conference.conferenceId,
        );
        const modal = this.modalService.open(CountryMatrixModalComponent, { size: 'lg' });
        modal.componentInstance.countryMatrix = countryMatrix;
    }

    public async cancelApplication(conference: GetMyConferencesV1Response): Promise<void> {
        await this.conferenceService.cancelApplication(conference.committeeSeatId);
        this.notificationService.success('Your application has been successfully cancelled.');
    }

    private async getConferences(): Promise<void> {
        this.participantConferences = await this.conferenceService.getMyConferences(false);
        this.organizerConferences = await this.conferenceService.getMyOrganizedConferences(false);
    }
}
