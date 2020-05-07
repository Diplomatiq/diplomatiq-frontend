import { Injectable } from '@angular/core';
import { HTTPHeaders } from '../../openapi/api';
import { clientId } from '../constants/client-id';

@Injectable({
    providedIn: 'root',
})
export class BaseHeadersProviderService {
    public provideHeaders(request: RequestInit): HTTPHeaders {
        const headers = this.getHeaders(request);
        headers['ClientId'] = clientId;
        headers['Instant'] = new Date().toISOString();
        return headers;
    }

    private getHeaders(request: RequestInit): HTTPHeaders {
        if (request.headers === undefined) {
            request.headers = {};
        }
        return request.headers as HTTPHeaders;
    }
}
