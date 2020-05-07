import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { SessionService } from './session.service';

@Injectable({
    providedIn: 'root',
})
export class AccountDeletionService {
    public constructor(private readonly sessionService: SessionService, private readonly apiService: ApiService) {}

    public async deleteAccount(): Promise<void> {
        await this.sessionService.withMultiFactorElevatedSession(
            async (): Promise<void> => {
                return this.apiService.multiFactorElevatedSessionMethodsApi.deleteUserAccountV1();
            },
        );
    }
}
