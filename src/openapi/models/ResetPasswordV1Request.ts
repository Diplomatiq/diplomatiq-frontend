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
 * @interface ResetPasswordV1Request
 */
export interface ResetPasswordV1Request {
    /**
     * The password reset key the user received in email
     * @type {string}
     * @memberof ResetPasswordV1Request
     */
    passwordResetKey: string;
    /**
     * The SRP salt (s) as a Hex string
     * @type {string}
     * @memberof ResetPasswordV1Request
     */
    srpSaltHex: string;
    /**
     * The SRP verifier (s) as a Hex string
     * @type {string}
     * @memberof ResetPasswordV1Request
     */
    srpVerifierHex: string;
    /**
     * The hash function used for calculating the exponent of the SRP verifier (v)
     * @type {string}
     * @memberof ResetPasswordV1Request
     */
    passwordStretchingAlgorithm: ResetPasswordV1RequestPasswordStretchingAlgorithmEnum;
}

export function ResetPasswordV1RequestFromJSON(json: any): ResetPasswordV1Request {
    return ResetPasswordV1RequestFromJSONTyped(json, false);
}

export function ResetPasswordV1RequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): ResetPasswordV1Request {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'passwordResetKey': json['passwordResetKey'],
        'srpSaltHex': json['srpSaltHex'],
        'srpVerifierHex': json['srpVerifierHex'],
        'passwordStretchingAlgorithm': json['passwordStretchingAlgorithm'],
    };
}

export function ResetPasswordV1RequestToJSON(value?: ResetPasswordV1Request | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'passwordResetKey': value.passwordResetKey,
        'srpSaltHex': value.srpSaltHex,
        'srpVerifierHex': value.srpVerifierHex,
        'passwordStretchingAlgorithm': value.passwordStretchingAlgorithm,
    };
}

/**
* @export
* @enum {string}
*/
export enum ResetPasswordV1RequestPasswordStretchingAlgorithmEnum {
    ScryptV1 = 'Scrypt_v1'
}


