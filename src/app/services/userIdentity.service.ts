import { Injectable } from '@angular/core';
import { CachePolicy } from '@diplomatiq/resily';
import { GetUserIdentityV1Response } from '../../openapi/api';
import { ApiService } from './api.service';
import { SessionService } from './session.service';

@Injectable({
    providedIn: 'root',
})
export class UserIdentityService {
    private readonly userIdentityCache: CachePolicy<GetUserIdentityV1Response>;

    public constructor(private readonly sessionService: SessionService, private readonly apiService: ApiService) {
        this.userIdentityCache = new CachePolicy<GetUserIdentityV1Response>();
        this.userIdentityCache.timeToLive('relative', 60000);
    }

    public async getUserIdentity(): Promise<GetUserIdentityV1Response> {
        return this.userIdentityCache.execute(
            async (): Promise<GetUserIdentityV1Response> => {
                return this.sessionService.withSession(
                    async (): Promise<GetUserIdentityV1Response> => {
                        return this.apiService.regularSessionMethodsApi.getUserIdentityV1();
                    },
                );
            },
        );
    }
}
