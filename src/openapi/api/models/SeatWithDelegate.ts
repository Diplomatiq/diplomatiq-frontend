/* tslint:disable */
/* eslint-disable */
/**
 * Diplomatiq API
 * This is the OpenAPI documentation of the Diplomatiq API.
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * The list of seats (represented countries) with the representing delegate
 * @export
 * @interface SeatWithDelegate
 */
export interface SeatWithDelegate {
    /**
     * The ISO3166-1 alpha-2 two letter country code of the represented country
     * @type {string}
     * @memberof SeatWithDelegate
     */
    representedCountry: string;
    /**
     * The email address of the representing delegate
     * @type {string}
     * @memberof SeatWithDelegate
     */
    delegateEmailAddress: string;
    /**
     * The first name of the representing delegate
     * @type {string}
     * @memberof SeatWithDelegate
     */
    delegateFirstName: string;
    /**
     * The last name of the representing delegate
     * @type {string}
     * @memberof SeatWithDelegate
     */
    delegateLastName: string;
}

export function SeatWithDelegateFromJSON(json: any): SeatWithDelegate {
    return SeatWithDelegateFromJSONTyped(json, false);
}

export function SeatWithDelegateFromJSONTyped(json: any, ignoreDiscriminator: boolean): SeatWithDelegate {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'representedCountry': json['representedCountry'],
        'delegateEmailAddress': json['delegateEmailAddress'],
        'delegateFirstName': json['delegateFirstName'],
        'delegateLastName': json['delegateLastName'],
    };
}

export function SeatWithDelegateToJSON(value?: SeatWithDelegate | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'representedCountry': value.representedCountry,
        'delegateEmailAddress': value.delegateEmailAddress,
        'delegateFirstName': value.delegateFirstName,
        'delegateLastName': value.delegateLastName,
    };
}


