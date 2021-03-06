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
 * @interface PasswordAuthenticationInitV1Response
 */
export interface PasswordAuthenticationInitV1Response {
    /**
     * The SRP server ephemeral (B) as a Hex string
     * @type {string}
     * @memberof PasswordAuthenticationInitV1Response
     */
    serverEphemeralHex: string;
    /**
     * The SRP salt (s) as a Hex string
     * @type {string}
     * @memberof PasswordAuthenticationInitV1Response
     */
    srpSaltHex: string;
    /**
     * The hash function used for calculating the exponent of the SRP verifier (v)
     * @type {string}
     * @memberof PasswordAuthenticationInitV1Response
     */
    passwordStretchingAlgorithm: PasswordAuthenticationInitV1ResponsePasswordStretchingAlgorithmEnum;
}

export function PasswordAuthenticationInitV1ResponseFromJSON(json: any): PasswordAuthenticationInitV1Response {
    return PasswordAuthenticationInitV1ResponseFromJSONTyped(json, false);
}

export function PasswordAuthenticationInitV1ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): PasswordAuthenticationInitV1Response {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'serverEphemeralHex': json['serverEphemeralHex'],
        'srpSaltHex': json['srpSaltHex'],
        'passwordStretchingAlgorithm': json['passwordStretchingAlgorithm'],
    };
}

export function PasswordAuthenticationInitV1ResponseToJSON(value?: PasswordAuthenticationInitV1Response | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'serverEphemeralHex': value.serverEphemeralHex,
        'srpSaltHex': value.srpSaltHex,
        'passwordStretchingAlgorithm': value.passwordStretchingAlgorithm,
    };
}

/**
* @export
* @enum {string}
*/
export enum PasswordAuthenticationInitV1ResponsePasswordStretchingAlgorithmEnum {
    ScryptV1 = 'Scrypt_v1'
}


