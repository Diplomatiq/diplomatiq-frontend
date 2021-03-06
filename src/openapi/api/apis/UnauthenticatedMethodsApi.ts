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
    GetDeviceContainerKeyV1Response,
    GetDeviceContainerKeyV1ResponseFromJSON,
    GetDeviceContainerKeyV1ResponseToJSON,
    PasswordAuthenticationCompleteV1Request,
    PasswordAuthenticationCompleteV1RequestFromJSON,
    PasswordAuthenticationCompleteV1RequestToJSON,
    PasswordAuthenticationCompleteV1Response,
    PasswordAuthenticationCompleteV1ResponseFromJSON,
    PasswordAuthenticationCompleteV1ResponseToJSON,
    PasswordAuthenticationInitV1Request,
    PasswordAuthenticationInitV1RequestFromJSON,
    PasswordAuthenticationInitV1RequestToJSON,
    PasswordAuthenticationInitV1Response,
    PasswordAuthenticationInitV1ResponseFromJSON,
    PasswordAuthenticationInitV1ResponseToJSON,
    RegisterUserV1Request,
    RegisterUserV1RequestFromJSON,
    RegisterUserV1RequestToJSON,
    RequestPasswordResetV1Request,
    RequestPasswordResetV1RequestFromJSON,
    RequestPasswordResetV1RequestToJSON,
    ResetPasswordV1Request,
    ResetPasswordV1RequestFromJSON,
    ResetPasswordV1RequestToJSON,
    ValidateEmailAddressV1Request,
    ValidateEmailAddressV1RequestFromJSON,
    ValidateEmailAddressV1RequestToJSON,
} from '../models';

export interface UnauthenticatedMethodsApiGetDeviceContainerKeyV1Request {
    deviceId: string;
}

export interface UnauthenticatedMethodsApiPasswordAuthenticationCompleteV1Request {
    passwordAuthenticationCompleteV1Request: PasswordAuthenticationCompleteV1Request;
}

export interface UnauthenticatedMethodsApiPasswordAuthenticationInitV1Request {
    passwordAuthenticationInitV1Request: PasswordAuthenticationInitV1Request;
}

export interface UnauthenticatedMethodsApiRegisterUserV1Request {
    registerUserV1Request: RegisterUserV1Request;
}

export interface UnauthenticatedMethodsApiRequestPasswordResetV1Request {
    requestPasswordResetV1Request: RequestPasswordResetV1Request;
}

export interface UnauthenticatedMethodsApiResendValidationEmailRequest {
    emailAddress: string;
}

export interface UnauthenticatedMethodsApiResetPasswordV1Request {
    resetPasswordV1Request: ResetPasswordV1Request;
}

export interface UnauthenticatedMethodsApiValidateEmailAddressV1Request {
    validateEmailAddressV1Request: ValidateEmailAddressV1Request;
}

/**
 * no description
 */
export class UnauthenticatedMethodsApi extends runtime.BaseAPI {

    /**
     * Returns the key of the device container with the given ID.
     * Get the key of a device container
     */
    async getDeviceContainerKeyV1Raw(requestParameters: UnauthenticatedMethodsApiGetDeviceContainerKeyV1Request): Promise<runtime.ApiResponse<GetDeviceContainerKeyV1Response>> {
        if (requestParameters.deviceId === null || requestParameters.deviceId === undefined) {
            throw new runtime.RequiredError('deviceId','Required parameter requestParameters.deviceId was null or undefined when calling getDeviceContainerKeyV1.');
        }

        const queryParameters: runtime.HTTPQuery = {};

        if (requestParameters.deviceId !== undefined) {
            queryParameters['deviceId'] = requestParameters.deviceId;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/get-device-container-key-v1`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => GetDeviceContainerKeyV1ResponseFromJSON(jsonValue));
    }

    /**
     * Returns the key of the device container with the given ID.
     * Get the key of a device container
     */
    async getDeviceContainerKeyV1(requestParameters: UnauthenticatedMethodsApiGetDeviceContainerKeyV1Request): Promise<GetDeviceContainerKeyV1Response> {
        const response = await this.getDeviceContainerKeyV1Raw(requestParameters);
        return await response.value();
    }

    /**
     * Completes an authentication flow for the given email address, based on the Secure Remote Password protocol (version 6a). Returns the resulting authentication session\'s ID encrypted with the session key the client and the server mutually agreed on.
     * Complete password authentication
     */
    async passwordAuthenticationCompleteV1Raw(requestParameters: UnauthenticatedMethodsApiPasswordAuthenticationCompleteV1Request): Promise<runtime.ApiResponse<PasswordAuthenticationCompleteV1Response>> {
        if (requestParameters.passwordAuthenticationCompleteV1Request === null || requestParameters.passwordAuthenticationCompleteV1Request === undefined) {
            throw new runtime.RequiredError('passwordAuthenticationCompleteV1Request','Required parameter requestParameters.passwordAuthenticationCompleteV1Request was null or undefined when calling passwordAuthenticationCompleteV1.');
        }

        const queryParameters: runtime.HTTPQuery = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/password-authentication-complete-v1`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: PasswordAuthenticationCompleteV1RequestToJSON(requestParameters.passwordAuthenticationCompleteV1Request),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => PasswordAuthenticationCompleteV1ResponseFromJSON(jsonValue));
    }

    /**
     * Completes an authentication flow for the given email address, based on the Secure Remote Password protocol (version 6a). Returns the resulting authentication session\'s ID encrypted with the session key the client and the server mutually agreed on.
     * Complete password authentication
     */
    async passwordAuthenticationCompleteV1(requestParameters: UnauthenticatedMethodsApiPasswordAuthenticationCompleteV1Request): Promise<PasswordAuthenticationCompleteV1Response> {
        const response = await this.passwordAuthenticationCompleteV1Raw(requestParameters);
        return await response.value();
    }

    /**
     * Initiates the authentication flow for the given email address, based on the Secure Remote Password protocol (version 6a).
     * Initiate password authentication
     */
    async passwordAuthenticationInitV1Raw(requestParameters: UnauthenticatedMethodsApiPasswordAuthenticationInitV1Request): Promise<runtime.ApiResponse<PasswordAuthenticationInitV1Response>> {
        if (requestParameters.passwordAuthenticationInitV1Request === null || requestParameters.passwordAuthenticationInitV1Request === undefined) {
            throw new runtime.RequiredError('passwordAuthenticationInitV1Request','Required parameter requestParameters.passwordAuthenticationInitV1Request was null or undefined when calling passwordAuthenticationInitV1.');
        }

        const queryParameters: runtime.HTTPQuery = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/password-authentication-init-v1`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: PasswordAuthenticationInitV1RequestToJSON(requestParameters.passwordAuthenticationInitV1Request),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => PasswordAuthenticationInitV1ResponseFromJSON(jsonValue));
    }

    /**
     * Initiates the authentication flow for the given email address, based on the Secure Remote Password protocol (version 6a).
     * Initiate password authentication
     */
    async passwordAuthenticationInitV1(requestParameters: UnauthenticatedMethodsApiPasswordAuthenticationInitV1Request): Promise<PasswordAuthenticationInitV1Response> {
        const response = await this.passwordAuthenticationInitV1Raw(requestParameters);
        return await response.value();
    }

    /**
     * Registers a user identified by the given email address. The email address is converted to its lowercase invariant, and is stored that way!
     * Register a user
     */
    async registerUserV1Raw(requestParameters: UnauthenticatedMethodsApiRegisterUserV1Request): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.registerUserV1Request === null || requestParameters.registerUserV1Request === undefined) {
            throw new runtime.RequiredError('registerUserV1Request','Required parameter requestParameters.registerUserV1Request was null or undefined when calling registerUserV1.');
        }

        const queryParameters: runtime.HTTPQuery = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/register-user-v1`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: RegisterUserV1RequestToJSON(requestParameters.registerUserV1Request),
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Registers a user identified by the given email address. The email address is converted to its lowercase invariant, and is stored that way!
     * Register a user
     */
    async registerUserV1(requestParameters: UnauthenticatedMethodsApiRegisterUserV1Request): Promise<void> {
        await this.registerUserV1Raw(requestParameters);
    }

    /**
     * Sends a password reset request email to the given email address if exists. If the given email address does not exist, the method still returns success to avoid revealing user data.
     * Request a password reset
     */
    async requestPasswordResetV1Raw(requestParameters: UnauthenticatedMethodsApiRequestPasswordResetV1Request): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.requestPasswordResetV1Request === null || requestParameters.requestPasswordResetV1Request === undefined) {
            throw new runtime.RequiredError('requestPasswordResetV1Request','Required parameter requestParameters.requestPasswordResetV1Request was null or undefined when calling requestPasswordResetV1.');
        }

        const queryParameters: runtime.HTTPQuery = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/request-password-reset-v1`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: RequestPasswordResetV1RequestToJSON(requestParameters.requestPasswordResetV1Request),
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Sends a password reset request email to the given email address if exists. If the given email address does not exist, the method still returns success to avoid revealing user data.
     * Request a password reset
     */
    async requestPasswordResetV1(requestParameters: UnauthenticatedMethodsApiRequestPasswordResetV1Request): Promise<void> {
        await this.requestPasswordResetV1Raw(requestParameters);
    }

    /**
     * Resends the validation email to a registered user\'s email address if the user exists and not already validated their email address. Does not throw to avoid revealing user data.
     * Resend the validation email to a registered user
     */
    async resendValidationEmailRaw(requestParameters: UnauthenticatedMethodsApiResendValidationEmailRequest): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.emailAddress === null || requestParameters.emailAddress === undefined) {
            throw new runtime.RequiredError('emailAddress','Required parameter requestParameters.emailAddress was null or undefined when calling resendValidationEmail.');
        }

        const queryParameters: runtime.HTTPQuery = {};

        if (requestParameters.emailAddress !== undefined) {
            queryParameters['emailAddress'] = requestParameters.emailAddress;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/resend-validation-email-v1`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Resends the validation email to a registered user\'s email address if the user exists and not already validated their email address. Does not throw to avoid revealing user data.
     * Resend the validation email to a registered user
     */
    async resendValidationEmail(requestParameters: UnauthenticatedMethodsApiResendValidationEmailRequest): Promise<void> {
        await this.resendValidationEmailRaw(requestParameters);
    }

    /**
     * Resets a given password by the corresponding password reset key. If the password reset key does not exist, the method still returns success to avoid revealing user data.
     * Reset a password
     */
    async resetPasswordV1Raw(requestParameters: UnauthenticatedMethodsApiResetPasswordV1Request): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.resetPasswordV1Request === null || requestParameters.resetPasswordV1Request === undefined) {
            throw new runtime.RequiredError('resetPasswordV1Request','Required parameter requestParameters.resetPasswordV1Request was null or undefined when calling resetPasswordV1.');
        }

        const queryParameters: runtime.HTTPQuery = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/reset-password-v1`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ResetPasswordV1RequestToJSON(requestParameters.resetPasswordV1Request),
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Resets a given password by the corresponding password reset key. If the password reset key does not exist, the method still returns success to avoid revealing user data.
     * Reset a password
     */
    async resetPasswordV1(requestParameters: UnauthenticatedMethodsApiResetPasswordV1Request): Promise<void> {
        await this.resetPasswordV1Raw(requestParameters);
    }

    /**
     * Sets the corresponding user\'s email address to validated. If the given email address validation key does not exist, the method still returns success to avoid revealing user data.
     * Validate the email address of a user
     */
    async validateEmailAddressV1Raw(requestParameters: UnauthenticatedMethodsApiValidateEmailAddressV1Request): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.validateEmailAddressV1Request === null || requestParameters.validateEmailAddressV1Request === undefined) {
            throw new runtime.RequiredError('validateEmailAddressV1Request','Required parameter requestParameters.validateEmailAddressV1Request was null or undefined when calling validateEmailAddressV1.');
        }

        const queryParameters: runtime.HTTPQuery = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/validate-email-address-v1`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ValidateEmailAddressV1RequestToJSON(requestParameters.validateEmailAddressV1Request),
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Sets the corresponding user\'s email address to validated. If the given email address validation key does not exist, the method still returns success to avoid revealing user data.
     * Validate the email address of a user
     */
    async validateEmailAddressV1(requestParameters: UnauthenticatedMethodsApiValidateEmailAddressV1Request): Promise<void> {
        await this.validateEmailAddressV1Raw(requestParameters);
    }

}
