import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { CommitteeWithSeats } from '../../../../openapi/api';
import { CountriesService } from '../../../services/countries.service';
import { CryptoService } from '../../../services/crypto.service';

export enum AddCommitteeModalResultEnum {
    Cancel,
    Confirm,
}

export type AddCommitteeModalResult =
    | {
          result: AddCommitteeModalResultEnum.Cancel;
          committee: undefined;
      }
    | {
          result: AddCommitteeModalResultEnum.Confirm;
          committee: CommitteeWithSeats;
      };

@Component({
    selector: 'diplomatiq-frontend-add-committee-modal',
    templateUrl: './add-committee-modal.component.html',
    styleUrls: ['./add-committee-modal.component.scss'],
})
export class AddCommitteeModalComponent {
    public readonly faTrashAlt = faTrashAlt;

    public committeeForm: FormGroup;
    public randomCountries: string[] = [];

    public get countries(): FormArray {
        return this.committeeForm.get('countries') as FormArray;
    }

    public constructor(
        private readonly formBuilder: FormBuilder,
        private readonly activeModal: NgbActiveModal,
        private readonly countriesService: CountriesService,
        private readonly cryptoService: CryptoService,
    ) {
        this.committeeForm = this.formBuilder.group({
            committeeName: [''],
            committeeCodeName: [''],
            countries: this.formBuilder.array([]),
        });

        this.fillRandomCountries();
    }

    public addCountry(): void {
        this.countries.push(this.formBuilder.control('', Validators.required.bind(this)));
    }

    public removeCountry(i: number): void {
        this.countries.removeAt(i);
    }

    public search(text$: Observable<string>): Observable<string[]> {
        const candidates = this.countriesService
            .getCountryDisplayNames()
            .filter((c): boolean => !(this.countries.value as string[]).includes(c));
        return text$.pipe(
            debounceTime(100),
            distinctUntilChanged(),
            map((searchTerm): string[] =>
                candidates.filter((c): boolean => c.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 5),
            ),
        );
    }

    public validateForm(): boolean {
        return (
            this.committeeForm.valid &&
            this.countries.length > 0 &&
            this.countries.valid &&
            this.countries.value.length === new Set(this.countries.value).size
        );
    }

    public cancel(): void {
        this.activeModal.close({
            result: AddCommitteeModalResultEnum.Cancel,
            committee: undefined,
        });
    }

    public confirm(): void {
        this.activeModal.close({
            result: AddCommitteeModalResultEnum.Confirm,
            committee: this.buildCommittee(),
        });
    }

    public getRandomCountryName(): string {
        const name = this.randomCountries.shift();
        this.randomCountries.push(name);
        return name;
    }

    private buildCommittee(): CommitteeWithSeats {
        return {
            name: this.committeeForm.get('committeeName').value,
            codeName: this.committeeForm.get('committeeCodeName').value,
            representedCountries: (this.countries.value as string[]).map((c): string =>
                this.countriesService.getAlpha2CountryCode(c),
            ),
        };
    }

    private async fillRandomCountries(): Promise<void> {
        const countryDisplayNames = this.countriesService.getCountryDisplayNames();
        const randomCountryIndexes = await this.cryptoService.randomGenerator.integer(
            0,
            countryDisplayNames.length - 1,
            100,
        );
        randomCountryIndexes.forEach((i): void => {
            this.randomCountries.push(countryDisplayNames[i]);
        });
    }
}
