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

/**
 * no description
 */
export class NonAPIMethodsApi extends runtime.BaseAPI {

    /**
     * This endpoint issues a temporary redirect (HTTP 307) to [https://www.diplomatiq.org](https://www.diplomatiq.org).
     * Redirect to www.diplomatiq.org
     */
    async rootRedirectRaw(): Promise<runtime.ApiResponse<void>> {
        const queryParameters: runtime.HTTPQuery = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     * This endpoint issues a temporary redirect (HTTP 307) to [https://www.diplomatiq.org](https://www.diplomatiq.org).
     * Redirect to www.diplomatiq.org
     */
    async rootRedirect(): Promise<void> {
        await this.rootRedirectRaw();
    }

}