import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Configuration, GetDeviceContainerKeyV1Response, UnauthenticatedMethodsApi } from '../../openapi/api';
import { BaseHeadersProvidingRequestContextConsumerFactoryService } from './baseHeadersProvidingRequestContextConsumerFactory.service';
import { ApiErrorHandlingResponseContextConsumerFactoryService } from './responseContextConsumerFactory.service';

@Injectable({
    providedIn: 'root',
})
export class DeviceContainerKeyService {
    private readonly unauthenticatedMethodsApi: UnauthenticatedMethodsApi;

    public constructor(
        private readonly baseHeadersProvidingRequestContextConsumerFactoryService: BaseHeadersProvidingRequestContextConsumerFactoryService,
        private readonly apiErrorHandlingResponseContextConsumerFactoryService: ApiErrorHandlingResponseContextConsumerFactoryService,
    ) {
        const unauthenticatedConfiguration = this.openApiConfigurationFactory();
        this.unauthenticatedMethodsApi = new UnauthenticatedMethodsApi(unauthenticatedConfiguration);
    }

    public async getDeviceContainerKey(deviceId: string): Promise<GetDeviceContainerKeyV1Response> {
        return this.unauthenticatedMethodsApi.getDeviceContainerKeyV1({
            deviceId,
        });
    }

    private openApiConfigurationFactory(): Configuration {
        const apiConfigurationParameters = {
            basePath: environment.apiUrl,
            middleware: [
                {
                    pre: this.baseHeadersProvidingRequestContextConsumerFactoryService.getRequestContextConsumer(),
                    post: this.apiErrorHandlingResponseContextConsumerFactoryService.getResponseContextConsumer(),
                },
            ],
        };
        return new Configuration(apiConfigurationParameters);
    }
}
