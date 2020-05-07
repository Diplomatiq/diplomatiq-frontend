import { Injectable } from '@angular/core';
import { FetchParams, RequestContext } from '../../openapi/api';
import { BaseHeadersProviderService } from './base-headers-provider.service';

@Injectable({
    providedIn: 'root',
})
export class BaseHeadersProvidingRequestContextConsumerFactoryService {
    constructor(private readonly baseHeadersProviderService: BaseHeadersProviderService) {}

    public getRequestContextConsumer(): (context: RequestContext) => Promise<FetchParams | void> {
        return async (context: RequestContext): Promise<FetchParams | void> => {
            this.baseHeadersProviderService.provideHeaders(context.init);
        };
    }
}
