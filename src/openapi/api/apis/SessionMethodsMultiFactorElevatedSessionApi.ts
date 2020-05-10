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
    CancelConferenceV1Request,
    CancelConferenceV1RequestFromJSON,
    CancelConferenceV1RequestToJSON,
    DiplomatiqApiError,
    DiplomatiqApiErrorFromJSON,
    DiplomatiqApiErrorToJSON,
} from '../models';

export interface SessionMethodsMultiFactorElevatedSessionApiCancelConferenceV1Request {
    cancelConferenceV1Request: CancelConferenceV1Request;
}

/**
 * no description
 */
export class SessionMethodsMultiFactorElevatedSessionApi extends runtime.BaseAPI {

    /**
     * Cancels a conference, unregisters all applied delegates, and deleted conference data.
     * Cancel a conference
     */
    async cancelConferenceV1Raw(requestParameters: SessionMethodsMultiFactorElevatedSessionApiCancelConferenceV1Request): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.cancelConferenceV1Request === null || requestParameters.cancelConferenceV1Request === undefined) {
            throw new runtime.RequiredError('cancelConferenceV1Request','Required parameter requestParameters.cancelConferenceV1Request was null or undefined when calling cancelConferenceV1.');
        }

        const queryParameters: runtime.HTTPQuery = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // Authorization authentication
        }

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["ClientId"] = this.configuration.apiKey("ClientId"); // ClientId authentication
        }

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["DeviceId"] = this.configuration.apiKey("DeviceId"); // DeviceId authentication
        }

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Instant"] = this.configuration.apiKey("Instant"); // Instant authentication
        }

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["SessionId"] = this.configuration.apiKey("SessionId"); // SessionId authentication
        }

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["SignedHeaders"] = this.configuration.apiKey("SignedHeaders"); // SignedHeaders authentication
        }

        const response = await this.request({
            path: `/cancel-conference-v1`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CancelConferenceV1RequestToJSON(requestParameters.cancelConferenceV1Request),
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Cancels a conference, unregisters all applied delegates, and deleted conference data.
     * Cancel a conference
     */
    async cancelConferenceV1(requestParameters: SessionMethodsMultiFactorElevatedSessionApiCancelConferenceV1Request): Promise<void> {
        await this.cancelConferenceV1Raw(requestParameters);
    }

    /**
     * Deletes the account of the user with all associated data in the system.
     * Delete the user\'s account
     */
    async deleteUserAccountV1Raw(): Promise<runtime.ApiResponse<void>> {
        const queryParameters: runtime.HTTPQuery = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // Authorization authentication
        }

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["ClientId"] = this.configuration.apiKey("ClientId"); // ClientId authentication
        }

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["DeviceId"] = this.configuration.apiKey("DeviceId"); // DeviceId authentication
        }

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Instant"] = this.configuration.apiKey("Instant"); // Instant authentication
        }

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["SessionId"] = this.configuration.apiKey("SessionId"); // SessionId authentication
        }

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["SignedHeaders"] = this.configuration.apiKey("SignedHeaders"); // SignedHeaders authentication
        }

        const response = await this.request({
            path: `/delete-user-account-v1`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Deletes the account of the user with all associated data in the system.
     * Delete the user\'s account
     */
    async deleteUserAccountV1(): Promise<void> {
        await this.deleteUserAccountV1Raw();
    }

}
