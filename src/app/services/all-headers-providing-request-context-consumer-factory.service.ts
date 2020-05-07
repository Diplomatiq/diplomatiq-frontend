import { Injectable } from '@angular/core';
import { FetchParams, RequestContext } from '../../openapi/api';
import { DiplomatiqAuthenticationScheme } from '../types/diplomatiq-authentication-scheme';
import { HeadersProviderService } from './headers-provider.service';

@Injectable({
    providedIn: 'root',
})
export class AllHeadersProvidingRequestContextConsumerFactoryService {
    public constructor(private readonly headersProviderService: HeadersProviderService) {}

    public getRequestContextConsumer(
        authenticationScheme: DiplomatiqAuthenticationScheme,
    ): (context: RequestContext) => Promise<FetchParams | void> {
        return async (context: RequestContext): Promise<FetchParams | void> => {
            await this.headersProviderService.provideHeaders(authenticationScheme, context.url, context.init);
        };
    }
}
