import { Component, Input, OnInit } from '@angular/core';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommitteeWithSeatsWithDelegate } from '../../../../openapi/api';
import { CountriesService } from '../../../services/countries.service';

@Component({
    selector: 'diplomatiq-frontend-country-matrix-modal',
    templateUrl: './country-matrix-modal.component.html',
    styleUrls: ['./country-matrix-modal.component.scss'],
})
export class CountryMatrixModalComponent implements OnInit {
    @Input()
    public countryMatrix: CommitteeWithSeatsWithDelegate[] = [];

    public readonly faQuestionCircle = faQuestionCircle;

    public constructor(
        private readonly countriesService: CountriesService,
        private readonly activeModal: NgbActiveModal,
    ) {}

    public ngOnInit(): void {
        this.countryMatrix = this.countryMatrix.sort((a, b): number => a.name.localeCompare(b.name));
        this.countryMatrix.forEach((committee): void => {
            committee.seatsWithDelegate = committee.seatsWithDelegate.sort((a, b): number => {
                const aCountryDisplayName = this.getCountryDisplayName(a.representedCountry);
                const bCountryDisplayName = this.getCountryDisplayName(b.representedCountry);
                return aCountryDisplayName.localeCompare(bCountryDisplayName);
            });
        });
    }

    public close(): void {
        this.activeModal.close();
    }

    public getCountryDisplayName(alpha2CountryCode: string): string {
        return this.countriesService.getCountryDisplayName(alpha2CountryCode);
    }
}
