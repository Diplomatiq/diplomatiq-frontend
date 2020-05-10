import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { faCalendarAlt, faPlusSquare } from '@fortawesome/free-regular-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { NgbActiveModal, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { CommitteeWithSeats, OrganizeConferenceV1Request } from '../../../../openapi/api';
import { CountriesService } from '../../../services/countries.service';
import { NotificationService } from '../../../services/notification.service';
import {
    AddCommitteeModalComponent,
    AddCommitteeModalResult,
    AddCommitteeModalResultEnum,
} from '../add-committee-modal/add-committee-modal.component';

export enum OrganizeConferenceModalResultEnum {
    Cancel,
    Confirm,
}

export type OrganizeConferenceModalResult =
    | {
          result: OrganizeConferenceModalResultEnum.Cancel;
          organizeConferenceRequest: undefined;
      }
    | {
          result: OrganizeConferenceModalResultEnum.Confirm;
          organizeConferenceRequest: OrganizeConferenceV1Request;
      };

@Component({
    selector: 'diplomatiq-frontend-organize-conference-modal',
    templateUrl: './organize-conference-modal.component.html',
    styleUrls: ['./organize-conference-modal.component.scss'],
})
export class OrganizeConferenceModalComponent {
    public readonly faCalendarAlt = faCalendarAlt;
    public readonly faPlusSquare = faPlusSquare;
    public readonly faTrashAlt = faTrashAlt;

    public committeeList: CommitteeWithSeats[] = [];

    public conferenceForm = new FormGroup({
        conferenceName: new FormControl(),
        conferenceCodeName: new FormControl(),
        conferenceFrom: new FormControl(),
        conferenceTo: new FormControl(),
        conferenceCountry: new FormControl(),
        conferenceCity: new FormControl(),
        conferenceAddress: new FormControl(),
        conferencePostalCode: new FormControl(),
    });

    public constructor(
        private readonly modalService: NgbModal,
        private readonly activeModal: NgbActiveModal,
        private readonly notificationService: NotificationService,
        private readonly countriesService: CountriesService,
    ) {}

    public getMinFromDate(): NgbDateStruct {
        const now = new Date();
        return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
    }

    public getMinToDate(): NgbDateStruct {
        const from: Date = this.conferenceForm.get('conferenceFrom').value;
        if (from === null || !(from instanceof Date)) {
            const now = new Date();
            return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
        }

        return { year: from.getFullYear(), month: from.getMonth() + 1, day: from.getDate() };
    }

    public cancel(): void {
        this.activeModal.close({
            result: OrganizeConferenceModalResultEnum.Cancel,
            organizeConferenceRequest: undefined,
        });
    }

    public confirm(): void {
        this.activeModal.close({
            result: OrganizeConferenceModalResultEnum.Confirm,
            organizeConferenceRequest: this.buildRequest(),
        });
    }

    public async addCommittee(): Promise<void> {
        const modal = this.modalService.open(AddCommitteeModalComponent, { size: 'lg' });
        const modalResult: AddCommitteeModalResult = await modal.result;
        if (modalResult.result === AddCommitteeModalResultEnum.Confirm) {
            const committee = modalResult.committee;
            if (
                this.committeeList.filter(
                    (c): boolean => c.name === committee.name || c.codeName === committee.codeName,
                ).length === 0
            ) {
                this.committeeList.push(committee);
            } else {
                this.notificationService.danger('Cannot add committee with the same name or code name.');
            }
        }
    }

    public deleteCommittee(committee: CommitteeWithSeats): void {
        this.committeeList = this.committeeList.filter(
            (c): boolean => c.name !== committee.name || c.codeName !== committee.codeName,
        );
    }

    public validate(): boolean {
        return this.conferenceForm.valid && this.validateDates() && this.validateCommitteeList();
    }

    public getRepresentedCountryNamesAsCommaSeparatedString(committee: CommitteeWithSeats): string {
        return committee.representedCountries
            .map((alpha2CountryCode): string => {
                return this.countriesService.getCountryDisplayName(alpha2CountryCode);
            })
            .sort()
            .join(', ');
    }

    public search(text$: Observable<string>): Observable<string[]> {
        const candidates = this.countriesService.getCountryDisplayNames();
        return text$.pipe(
            debounceTime(100),
            distinctUntilChanged(),
            map((searchTerm): string[] =>
                candidates.filter((c): boolean => c.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 5),
            ),
        );
    }

    private validateDates(): boolean {
        const from: Date = this.conferenceForm.get('conferenceFrom').value;
        const to: Date = this.conferenceForm.get('conferenceTo').value;
        if (from === null || to === null || !(from instanceof Date) || !(to instanceof Date)) {
            return false;
        }

        const now = new Date();
        const fromOk = from.getTime() >= now.getTime();
        const toOk = to.getTime() >= from.getTime();
        return fromOk && toOk;
    }

    private validateCommitteeList(): boolean {
        const hasCommittees = this.committeeList.length > 0;

        const committeeNames = this.committeeList.map((c): string => c.name);
        const committeeNamesAreUnique = committeeNames.length === new Set(committeeNames).size;

        const committeeCodeNames = this.committeeList.map((c): string => c.codeName);
        const committeeCodeNamesAreUnique = committeeCodeNames.length === new Set(committeeCodeNames).size;

        const everyCommitteeHasCountries = this.committeeList.every((c): boolean => c.representedCountries.length > 0);
        const everyCommitteeHasUniqueCountries = this.committeeList.every(
            (c): boolean => c.representedCountries.length === new Set(c.representedCountries).size,
        );

        return (
            hasCommittees &&
            committeeNamesAreUnique &&
            committeeCodeNamesAreUnique &&
            everyCommitteeHasCountries &&
            everyCommitteeHasUniqueCountries
        );
    }

    private buildRequest(): OrganizeConferenceV1Request {
        return {
            conferenceName: this.conferenceForm.get('conferenceName').value,
            conferenceCodeName: this.conferenceForm.get('conferenceCodeName').value,
            conferenceFrom: this.transformDateToLocalDateString(this.conferenceForm.get('conferenceFrom').value),
            conferenceTo: this.transformDateToLocalDateString(this.conferenceForm.get('conferenceTo').value),
            conferenceCountry: this.countriesService.getAlpha2CountryCode(
                this.conferenceForm.get('conferenceCountry').value,
            ),
            conferenceCity: this.conferenceForm.get('conferenceCity').value,
            conferenceAddress: this.conferenceForm.get('conferenceAddress').value,
            conferencePostalCode: this.conferenceForm.get('conferencePostalCode').value,
            committeeList: this.committeeList,
        };
    }

    private transformDateToLocalDateString(date: Date): string {
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, '0');
        const day = `${date.getDate()}`.padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}
