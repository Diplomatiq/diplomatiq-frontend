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
 * 
 * @export
 * @interface ElevateAuthenticationSessionCompleteV1Request
 */
export interface ElevateAuthenticationSessionCompleteV1Request {
    /**
     * The multi-factor authentication code
     * @type {string}
     * @memberof ElevateAuthenticationSessionCompleteV1Request
     */
    requestCode: string;
}

export function ElevateAuthenticationSessionCompleteV1RequestFromJSON(json: any): ElevateAuthenticationSessionCompleteV1Request {
    return ElevateAuthenticationSessionCompleteV1RequestFromJSONTyped(json, false);
}

export function ElevateAuthenticationSessionCompleteV1RequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): ElevateAuthenticationSessionCompleteV1Request {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'requestCode': json['requestCode'],
    };
}

export function ElevateAuthenticationSessionCompleteV1RequestToJSON(value?: ElevateAuthenticationSessionCompleteV1Request | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'requestCode': value.requestCode,
    };
}


