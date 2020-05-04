/* eslint-disable no-useless-escape */
/* eslint-disable prefer-named-capture-group */
/* eslint-disable require-unicode-regexp */
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class EmailAddressValidationService {
    private static readonly EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    public validate(emailAddress: string): boolean {
        return EmailAddressValidationService.EMAIL_REGEX.test(emailAddress);
    }
}
