import { Injectable } from '@angular/core';
import { OrganizeConferenceV1Request } from 'src/openapi/api';
import { ApiService } from './api.service';
import { SessionService } from './session.service';

@Injectable({
    providedIn: 'root',
})
export class ConferenceService {
    constructor(private readonly apiService: ApiService, private readonly sessionService: SessionService) {}

    public async getMyConferences(): Promise<string[]> {
        return this.sessionService.withRegularSession(
            async (): Promise<string[]> => {
                return this.apiService.regularSessionMethodsApi.getMyConferencesV1();
            },
        );
    }

    public async getMyOrganizedConferences(): Promise<string[]> {
        return this.sessionService.withRegularSession(
            async (): Promise<string[]> => {
                return this.apiService.regularSessionMethodsApi.getMyOrganizedConferencesV1();
            },
        );
    }

    public async organizeConference(organizeConferenceRequest: OrganizeConferenceV1Request): Promise<void> {
        return this.sessionService.withRegularSession(
            async (): Promise<void> => {
                return this.apiService.regularSessionMethodsApi.organizeConferenceV1({
                    organizeConferenceV1Request: organizeConferenceRequest,
                });
            },
        );
    }

    public async cancelConference(conferenceId: string): Promise<void> {
        return this.sessionService.withMultiFactorElevatedSession(
            async (): Promise<void> => {
                return this.apiService.multiFactorElevatedSessionMethodsApi.cancelConferenceV1({
                    cancelConferenceV1Request: {
                        conferenceId,
                    },
                });
            },
        );
    }

    public async applyConference(committeeSeatId: string): Promise<void> {
        return this.sessionService.withRegularSession(
            async (): Promise<void> => {
                return this.apiService.regularSessionMethodsApi.applyConferenceV1({
                    applyConferenceV1Request: {
                        committeeSeatId,
                    },
                });
            },
        );
    }

    public async cancelApplication(committeeSeatId: string): Promise<void> {
        return this.sessionService.withPasswordElevatedSession(
            async (): Promise<void> => {
                return this.apiService.passwordElevatedSessionMethodsApi.cancelApplicationV1({
                    cancelApplicationV1Request: {
                        committeeSeatId,
                    },
                });
            },
        );
    }
}
