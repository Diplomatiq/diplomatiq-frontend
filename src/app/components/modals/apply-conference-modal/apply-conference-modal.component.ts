import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CountriesService } from '../../../services/countries.service';
import { ExploreConferencesV1Response } from '../../../../openapi/api';

export enum ApplyConferenceModalResultEnum {
    Cancel,
    Confirm,
}

export type ApplyConferenceModalResult =
    | {
          result: ApplyConferenceModalResultEnum.Cancel;
          committeeSeatId: undefined;
      }
    | {
          result: ApplyConferenceModalResultEnum.Confirm;
          committeeSeatId: string;
      };

@Component({
    selector: 'diplomatiq-frontend-apply-conference-modal',
    templateUrl: './apply-conference-modal.component.html',
    styleUrls: ['./apply-conference-modal.component.scss'],
})
export class ApplyConferenceModalComponent implements OnInit {
    @Input()
    public conference: ExploreConferencesV1Response;

    public constructor(
        private readonly activeModal: NgbActiveModal,
        private readonly countriesService: CountriesService,
    ) {}

    public ngOnInit(): void {
        this.conference.committeesWithEmptySeats = this.conference.committeesWithEmptySeats.sort((a, b): number =>
            a.name.localeCompare(b.name),
        );
        this.conference.committeesWithEmptySeats.forEach((c): void => {
            c.emptyCommitteeSeats = c.emptyCommitteeSeats.sort((a, b): number => {
                const aDisplayName = this.getCountryDisplayName(a.representedCountry);
                const bDisplayName = this.getCountryDisplayName(b.representedCountry);
                return aDisplayName.localeCompare(bDisplayName);
            });
        });
    }

    public getCountryDisplayName(alpha2CountryCode: string): string {
        return this.countriesService.getCountryDisplayName(alpha2CountryCode);
    }

    public apply(committeeSeatId: string): void {
        this.activeModal.close({
            result: ApplyConferenceModalResultEnum.Confirm,
            committeeSeatId,
        });
    }

    public cancel(): void {
        this.activeModal.close({
            result: ApplyConferenceModalResultEnum.Cancel,
            committeeSeatId: undefined,
        });
    }
}
