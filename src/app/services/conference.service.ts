import { Injectable } from '@angular/core';
import {
    CommitteeWithSeatsWithDelegate,
    ExploreConferencesV1Response,
    GetMyConferencesV1Response,
    GetMyOrganizedConferencesV1Response,
    OrganizeConferenceV1Request,
} from '../../openapi/api';
import { ApiService } from './api.service';
import { SessionService } from './session.service';

@Injectable({
    providedIn: 'root',
})
export class ConferenceService {
    public constructor(private readonly apiService: ApiService, private readonly sessionService: SessionService) {}

    public async getMyConferences(includePast: boolean): Promise<GetMyConferencesV1Response[]> {
        return this.sessionService.withRegularSession(
            async (): Promise<GetMyConferencesV1Response[]> => {
                return this.apiService.regularSessionMethodsApi.getMyConferencesV1({
                    includePast,
                });
            },
        );
    }

    public async getMyOrganizedConferences(includePast: boolean): Promise<GetMyOrganizedConferencesV1Response[]> {
        return this.sessionService.withRegularSession(
            async (): Promise<GetMyOrganizedConferencesV1Response[]> => {
                return this.apiService.regularSessionMethodsApi.getMyOrganizedConferencesV1({
                    includePast,
                });
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

    public async getCountryMatrix(conferenceId: string): Promise<CommitteeWithSeatsWithDelegate[]> {
        return this.sessionService.withRegularSession(
            async (): Promise<CommitteeWithSeatsWithDelegate[]> => {
                return this.apiService.regularSessionMethodsApi.getCountryMatrixV1({
                    conferenceId,
                });
            },
        );
    }

    public async exploreConferences(): Promise<ExploreConferencesV1Response[]> {
        return this.sessionService.withRegularSession(
            async (): Promise<ExploreConferencesV1Response[]> => {
                return this.apiService.regularSessionMethodsApi.exploreConferencesV1();
            },
        );
    }
}
