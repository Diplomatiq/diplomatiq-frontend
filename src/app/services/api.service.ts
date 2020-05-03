import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {
    AuthenticationSessionMethodsMultiFactorElevatedSessionApi,
    AuthenticationSessionMethodsPasswordElevatedSessionApi,
    Configuration,
    DeviceMethodsApi,
    FetchParams,
    RequestContext,
    SessionMethodsPasswordElevatedSessionApi,
    SessionMethodsRegularSessionApi,
    UnauthenticatedMethodsApi,
} from '../../openapi';
import { DiplomatiqAuthenticationScheme } from '../types/diplomatiqAuthenticationScheme';
import { HeadersProviderService } from './headersProvider.service';

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

    public constructor(private readonly headersProviderService: HeadersProviderService) {
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
    }

    private openApiConfigurationFactory(authenticationScheme: DiplomatiqAuthenticationScheme): Configuration {
        const apiConfigurationParameters = {
            basePath: environment.apiUrl,
            middleware: [
                {
                    pre: async (context: RequestContext): Promise<FetchParams | void> => {
                        await this.headersProviderService.provideHeaders(
                            authenticationScheme,
                            context.url,
                            context.init,
                        );
                    },
                },
            ],
        };
        return new Configuration(apiConfigurationParameters);
    }
}
