import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {
    AuthenticationSessionMethodsMultiFactorElevatedSessionApi,
    AuthenticationSessionMethodsPasswordElevatedSessionApi,
    Configuration,
    ConfigurationParameters,
    DeviceMethodsApi,
    SessionMethodsMultiFactorElevatedSessionApi,
    SessionMethodsPasswordElevatedSessionApi,
    SessionMethodsRegularSessionApi,
    UnauthenticatedMethodsApi,
} from '../../openapi/api';
import { DiplomatiqAuthenticationScheme } from '../types/diplomatiq-authentication-scheme';
import { AllHeadersProvidingRequestContextConsumerFactoryService } from './all-headers-providing-request-context-consumer-factory.service';
import { ApiErrorHandlingResponseContextConsumerFactoryService } from './api-error-handling-response-context-consumer-factory.service';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    public readonly unauthenticatedMethodsApi: UnauthenticatedMethodsApi;

    public readonly passwordElevatedAuthenticationSessionMethodsApi: AuthenticationSessionMethodsPasswordElevatedSessionApi;
    public readonly multiFactorElevatedAuthenticationSessionMethodsApi: AuthenticationSessionMethodsMultiFactorElevatedSessionApi;

    public readonly deviceMethodsApi: DeviceMethodsApi;

    public readonly regularSessionMethodsApi: SessionMethodsRegularSessionApi;
    public readonly passwordElevatedSessionMethodsApi: SessionMethodsPasswordElevatedSessionApi;
    public readonly multiFactorElevatedSessionMethodsApi: SessionMethodsMultiFactorElevatedSessionApi;

    public constructor(
        private readonly allHeadersProvidingRequestContextConsumerFactoryService: AllHeadersProvidingRequestContextConsumerFactoryService,
        private readonly apiErrorHandlingResponseContextConsumerFactoryService: ApiErrorHandlingResponseContextConsumerFactoryService,
    ) {
        const unauthenticatedConfiguration = this.openApiConfigurationFactory(
            DiplomatiqAuthenticationScheme.Unauthenticated,
        );
        this.unauthenticatedMethodsApi = new UnauthenticatedMethodsApi(unauthenticatedConfiguration);

        const authenticationSessionSignatureV1Configuration = this.openApiConfigurationFactory(
            DiplomatiqAuthenticationScheme.AuthenticationSessionSignatureV1,
        );
        this.passwordElevatedAuthenticationSessionMethodsApi = new AuthenticationSessionMethodsPasswordElevatedSessionApi(
            authenticationSessionSignatureV1Configuration,
        );
        this.multiFactorElevatedAuthenticationSessionMethodsApi = new AuthenticationSessionMethodsMultiFactorElevatedSessionApi(
            authenticationSessionSignatureV1Configuration,
        );

        const deviceSignatureV1Configuration = this.openApiConfigurationFactory(
            DiplomatiqAuthenticationScheme.DeviceSignatureV1,
        );
        this.deviceMethodsApi = new DeviceMethodsApi(deviceSignatureV1Configuration);

        const sessionSignatureV1Configuration = this.openApiConfigurationFactory(
            DiplomatiqAuthenticationScheme.SessionSignatureV1,
        );
        this.regularSessionMethodsApi = new SessionMethodsRegularSessionApi(sessionSignatureV1Configuration);
        this.passwordElevatedSessionMethodsApi = new SessionMethodsPasswordElevatedSessionApi(
            sessionSignatureV1Configuration,
        );
        this.multiFactorElevatedSessionMethodsApi = new SessionMethodsMultiFactorElevatedSessionApi(
            sessionSignatureV1Configuration,
        );
    }

    private openApiConfigurationFactory(authenticationScheme: DiplomatiqAuthenticationScheme): Configuration {
        const apiConfigurationParameters: ConfigurationParameters = {
            basePath: environment.apiUrl,
            middleware: [
                {
                    pre: this.allHeadersProvidingRequestContextConsumerFactoryService.getRequestContextConsumer(
                        authenticationScheme,
                    ),
                    post: this.apiErrorHandlingResponseContextConsumerFactoryService.getResponseContextConsumer(),
                },
            ],
            credentials: 'omit',
        };
        return new Configuration(apiConfigurationParameters);
    }
}
