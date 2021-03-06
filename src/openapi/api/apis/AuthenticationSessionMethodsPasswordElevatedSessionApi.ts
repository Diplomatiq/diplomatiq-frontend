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


import * as runtime from '../runtime';
import {
    DiplomatiqApiError,
    DiplomatiqApiErrorFromJSON,
    DiplomatiqApiErrorToJSON,
    ElevateAuthenticationSessionCompleteV1Request,
    ElevateAuthenticationSessionCompleteV1RequestFromJSON,
    ElevateAuthenticationSessionCompleteV1RequestToJSON,
} from '../models';

export interface AuthenticationSessionMethodsPasswordElevatedSessionApiElevateAuthenticationSessionCompleteV1Request {
    elevateAuthenticationSessionCompleteV1Request: ElevateAuthenticationSessionCompleteV1Request;
}

/**
 * no description
 */
export class AuthenticationSessionMethodsPasswordElevatedSessionApi extends runtime.BaseAPI {

    /**
     * Verifies a multi-factor authentication code previously sent to the user\'s email address. If successful, the current authentication session was elevated to `MultiFactorElevatedSession` assurance level.
     * Complete authentication session elevation to MultiFactorElevatedSession assurance level
     */
    async elevateAuthenticationSessionCompleteV1Raw(requestParameters: AuthenticationSessionMethodsPasswordElevatedSessionApiElevateAuthenticationSessionCompleteV1Request): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.elevateAuthenticationSessionCompleteV1Request === null || requestParameters.elevateAuthenticationSessionCompleteV1Request === undefined) {
            throw new runtime.RequiredError('elevateAuthenticationSessionCompleteV1Request','Required parameter requestParameters.elevateAuthenticationSessionCompleteV1Request was null or undefined when calling elevateAuthenticationSessionCompleteV1.');
        }

        const queryParameters: runtime.HTTPQuery = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["AuthenticationSessionId"] = this.configuration.apiKey("AuthenticationSessionId"); // AuthenticationSessionId authentication
        }

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // Authorization authentication
        }

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["ClientId"] = this.configuration.apiKey("ClientId"); // ClientId authentication
        }

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Instant"] = this.configuration.apiKey("Instant"); // Instant authentication
        }

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["SignedHeaders"] = this.configuration.apiKey("SignedHeaders"); // SignedHeaders authentication
        }

        const response = await this.request({
            path: `/elevate-authentication-session-complete-v1`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ElevateAuthenticationSessionCompleteV1RequestToJSON(requestParameters.elevateAuthenticationSessionCompleteV1Request),
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Verifies a multi-factor authentication code previously sent to the user\'s email address. If successful, the current authentication session was elevated to `MultiFactorElevatedSession` assurance level.
     * Complete authentication session elevation to MultiFactorElevatedSession assurance level
     */
    async elevateAuthenticationSessionCompleteV1(requestParameters: AuthenticationSessionMethodsPasswordElevatedSessionApiElevateAuthenticationSessionCompleteV1Request): Promise<void> {
        await this.elevateAuthenticationSessionCompleteV1Raw(requestParameters);
    }

    /**
     * Sends an email to the email address of the currently authenticated user with a multi-factor authentication code.
     * Initiate authentication session elevation to MultiFactorElevatedSession assurance level
     */
    async elevateAuthenticationSessionInitV1Raw(): Promise<runtime.ApiResponse<void>> {
        const queryParameters: runtime.HTTPQuery = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["AuthenticationSessionId"] = this.configuration.apiKey("AuthenticationSessionId"); // AuthenticationSessionId authentication
        }

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // Authorization authentication
        }

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["ClientId"] = this.configuration.apiKey("ClientId"); // ClientId authentication
        }

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Instant"] = this.configuration.apiKey("Instant"); // Instant authentication
        }

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["SignedHeaders"] = this.configuration.apiKey("SignedHeaders"); // SignedHeaders authentication
        }

        const response = await this.request({
            path: `/elevate-authentication-session-init-v1`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Sends an email to the email address of the currently authenticated user with a multi-factor authentication code.
     * Initiate authentication session elevation to MultiFactorElevatedSession assurance level
     */
    async elevateAuthenticationSessionInitV1(): Promise<void> {
        await this.elevateAuthenticationSessionInitV1Raw();
    }

}
