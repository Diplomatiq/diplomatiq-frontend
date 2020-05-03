import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {
    Configuration,
    FetchParams,
    GetDeviceContainerKeyV1Response,
    RequestContext,
    UnauthenticatedMethodsApi,
} from '../../openapi';
import { clientId } from '../constants/clientId';

@Injectable({
    providedIn: 'root',
})
export class DeviceContainerKeyService {
    public readonly unauthenticatedMethodsApi: UnauthenticatedMethodsApi;

    public constructor() {
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
                    // eslint-disable-next-line @typescript-eslint/require-await
                    pre: async (context: RequestContext): Promise<FetchParams | void> => {
                        if (context.init.headers === undefined) {
                            context.init.headers = {};
                        }

                        context.init.headers['ClientId'] = clientId;
                        context.init.headers['Instant'] = new Date().toISOString();
                    },
                },
            ],
        };
        return new Configuration(apiConfigurationParameters);
    }
}
