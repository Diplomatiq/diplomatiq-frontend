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
 * @interface PasswordAuthenticationCompleteV1Response
 */
export interface PasswordAuthenticationCompleteV1Response {
    /**
     * The ID of the created authentication session as UTF-8 bytes, encrypted with the SRP session key (K), as a Base64 string (in DiplomatiqAEAD format = AES-GCM without padding, serialized to binary `[1-byte ivLength | 4-byte aadLength (big-endian) | 4-byte ciphertextLength (big-endian) | 1-byte tagLength | ivLength-byte initialization vector | aadLength-byte additional authenticated data | ciphertextLength-byte ciphertext | tagLength-byte authentication tag]`)
     * @type {string}
     * @memberof PasswordAuthenticationCompleteV1Response
     */
    authenticationSessionIdAeadBase64: string;
}

export function PasswordAuthenticationCompleteV1ResponseFromJSON(json: any): PasswordAuthenticationCompleteV1Response {
    return PasswordAuthenticationCompleteV1ResponseFromJSONTyped(json, false);
}

export function PasswordAuthenticationCompleteV1ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): PasswordAuthenticationCompleteV1Response {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'authenticationSessionIdAeadBase64': json['authenticationSessionIdAeadBase64'],
    };
}

export function PasswordAuthenticationCompleteV1ResponseToJSON(value?: PasswordAuthenticationCompleteV1Response | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'authenticationSessionIdAeadBase64': value.authenticationSessionIdAeadBase64,
    };
}


