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
import {
    CommitteeWithEmptySeats,
    CommitteeWithEmptySeatsFromJSON,
    CommitteeWithEmptySeatsFromJSONTyped,
    CommitteeWithEmptySeatsToJSON,
} from './';

/**
 * 
 * @export
 * @interface ExploreConferencesV1Response
 */
export interface ExploreConferencesV1Response {
    /**
     * The full name of the conference
     * @type {string}
     * @memberof ExploreConferencesV1Response
     */
    conferenceName: string;
    /**
     * The code name of the conference
     * @type {string}
     * @memberof ExploreConferencesV1Response
     */
    conferenceCodeName: string;
    /**
     * The start date of the conference
     * @type {string}
     * @memberof ExploreConferencesV1Response
     */
    conferenceFrom: string;
    /**
     * The end date of the conference
     * @type {string}
     * @memberof ExploreConferencesV1Response
     */
    conferenceTo: string;
    /**
     * The country of the conference address as an ISO3166-1 alpha-2 two letter country code
     * @type {string}
     * @memberof ExploreConferencesV1Response
     */
    conferenceCountry: string;
    /**
     * The city of the conference address
     * @type {string}
     * @memberof ExploreConferencesV1Response
     */
    conferenceCity: string;
    /**
     * The address of the conference
     * @type {string}
     * @memberof ExploreConferencesV1Response
     */
    conferenceAddress: string;
    /**
     * The postal code of the conference address
     * @type {string}
     * @memberof ExploreConferencesV1Response
     */
    conferencePostalCode: string;
    /**
     * The list of committees which have empty seats, with empty seats
     * @type {Array<CommitteeWithEmptySeats>}
     * @memberof ExploreConferencesV1Response
     */
    committeesWithEmptySeats: Array<CommitteeWithEmptySeats>;
}

export function ExploreConferencesV1ResponseFromJSON(json: any): ExploreConferencesV1Response {
    return ExploreConferencesV1ResponseFromJSONTyped(json, false);
}

export function ExploreConferencesV1ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): ExploreConferencesV1Response {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'conferenceName': json['conferenceName'],
        'conferenceCodeName': json['conferenceCodeName'],
        'conferenceFrom': json['conferenceFrom'],
        'conferenceTo': json['conferenceTo'],
        'conferenceCountry': json['conferenceCountry'],
        'conferenceCity': json['conferenceCity'],
        'conferenceAddress': json['conferenceAddress'],
        'conferencePostalCode': json['conferencePostalCode'],
        'committeesWithEmptySeats': ((json['committeesWithEmptySeats'] as Array<any>).map(CommitteeWithEmptySeatsFromJSON)),
    };
}

export function ExploreConferencesV1ResponseToJSON(value?: ExploreConferencesV1Response | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'conferenceName': value.conferenceName,
        'conferenceCodeName': value.conferenceCodeName,
        'conferenceFrom': value.conferenceFrom,
        'conferenceTo': value.conferenceTo,
        'conferenceCountry': value.conferenceCountry,
        'conferenceCity': value.conferenceCity,
        'conferenceAddress': value.conferenceAddress,
        'conferencePostalCode': value.conferencePostalCode,
        'committeesWithEmptySeats': ((value.committeesWithEmptySeats as Array<any>).map(CommitteeWithEmptySeatsToJSON)),
    };
}


