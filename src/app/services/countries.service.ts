import { Injectable } from '@angular/core';
import en from 'i18n-iso-countries/langs/en.json';

@Injectable({
    providedIn: 'root',
})
export class CountriesService {
    private readonly countryDisplayNamesByAlpha2CountryCode: ReadonlyMap<string, string>;
    private readonly alpha2CountryCodeByCountryDisplayNames: ReadonlyMap<string, string>;

    public constructor() {
        this.countryDisplayNamesByAlpha2CountryCode = new Map(Object.entries(en.countries));
        this.alpha2CountryCodeByCountryDisplayNames = new Map(
            Object.entries(en.countries).map(([alpha2CountryCode, countryDisplayName]): [string, string] => {
                return [countryDisplayName, alpha2CountryCode];
            }),
        );
    }

    public getAlpha2CountryCodes(): readonly string[] {
        return Array.from(this.alpha2CountryCodeByCountryDisplayNames.values());
    }

    public getCountryDisplayNames(): readonly string[] {
        return Array.from(this.countryDisplayNamesByAlpha2CountryCode.values());
    }

    public getCountryDisplayName(alpha2CountryCode: string): string | undefined {
        return this.countryDisplayNamesByAlpha2CountryCode.get(alpha2CountryCode);
    }

    public getAlpha2CountryCode(countryDisplayName: string): string | undefined {
        return this.alpha2CountryCodeByCountryDisplayNames.get(countryDisplayName);
    }
}
