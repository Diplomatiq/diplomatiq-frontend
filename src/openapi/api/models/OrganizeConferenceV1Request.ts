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
    CommitteeWithSeats,
    CommitteeWithSeatsFromJSON,
    CommitteeWithSeatsFromJSONTyped,
    CommitteeWithSeatsToJSON,
} from './';

/**
 * 
 * @export
 * @interface OrganizeConferenceV1Request
 */
export interface OrganizeConferenceV1Request {
    /**
     * The full name of the conference
     * @type {string}
     * @memberof OrganizeConferenceV1Request
     */
    conferenceName: string;
    /**
     * The code name of the conference
     * @type {string}
     * @memberof OrganizeConferenceV1Request
     */
    conferenceCodeName: string;
    /**
     * The start date of the conference
     * @type {string}
     * @memberof OrganizeConferenceV1Request
     */
    conferenceFrom: string;
    /**
     * The end date of the conference
     * @type {string}
     * @memberof OrganizeConferenceV1Request
     */
    conferenceTo: string;
    /**
     * The country of the conference address as an ISO3166-1 alpha-2 two letter country code
     * @type {string}
     * @memberof OrganizeConferenceV1Request
     */
    conferenceCountry: string;
    /**
     * The city of the conference address
     * @type {string}
     * @memberof OrganizeConferenceV1Request
     */
    conferenceCity: string;
    /**
     * The address of the conference
     * @type {string}
     * @memberof OrganizeConferenceV1Request
     */
    conferenceAddress: string;
    /**
     * The postal code of the conference address
     * @type {string}
     * @memberof OrganizeConferenceV1Request
     */
    conferencePostalCode: string;
    /**
     * The list of the committees of the conference with seats
     * @type {Array<CommitteeWithSeats>}
     * @memberof OrganizeConferenceV1Request
     */
    committeeList: Array<CommitteeWithSeats>;
}

export function OrganizeConferenceV1RequestFromJSON(json: any): OrganizeConferenceV1Request {
    return OrganizeConferenceV1RequestFromJSONTyped(json, false);
}

export function OrganizeConferenceV1RequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): OrganizeConferenceV1Request {
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
        'committeeList': ((json['committeeList'] as Array<any>).map(CommitteeWithSeatsFromJSON)),
    };
}

export function OrganizeConferenceV1RequestToJSON(value?: OrganizeConferenceV1Request | null): any {
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
        'committeeList': ((value.committeeList as Array<any>).map(CommitteeWithSeatsToJSON)),
    };
}


