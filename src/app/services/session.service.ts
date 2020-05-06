import { Injectable } from '@angular/core';
import { DefaultBinaryConverter, DefaultStringConverter } from '@diplomatiq/convertibles';
import { RetryPolicy } from '@diplomatiq/resily';
import { DiplomatiqApiException } from '../exceptions/diplomatiqApiException';
import { AeadService } from './aead.service';
import { ApiService } from './api.service';
import { DeviceContainerService } from './deviceContainer.service';

@Injectable({
    providedIn: 'root',
})
export class SessionService {
    private readonly binaryConverter = new DefaultBinaryConverter();
    private readonly stringConverter = new DefaultStringConverter();

    public constructor(
        private readonly apiService: ApiService,
        private readonly deviceContainerService: DeviceContainerService,
        private readonly aeadService: AeadService,
    ) {}

    public async withSession<T>(apiCall: () => Promise<T>): Promise<T> {
        const sessionId = await this.deviceContainerService.getSessionId();
        if (sessionId === undefined) {
            await this.getNewSession();
        }

        const policy = new RetryPolicy<T>();
        policy.reactOnException((ex: DiplomatiqApiException): boolean => ex.errorCode === 'Unauthorized');
        policy.retryCount(1);
        policy.onRetry(
            async (): Promise<void> => {
                await this.getNewSession();
            },
        );
        return policy.execute(async (): Promise<T> => apiCall());
    }

    private async getNewSession(): Promise<void> {
        const deviceKey = await this.deviceContainerService.getDeviceKey();
        const sessionToken = await this.deviceContainerService.getSessionToken();
        const sessionTokenAeadBytes = await this.aeadService.toBytes(sessionToken, new Uint8Array(), deviceKey);
        const sessionTokenAeadBase64 = this.binaryConverter.encodeToBase64(sessionTokenAeadBytes);
        const { sessionIdAeadBase64 } = await this.apiService.deviceMethodsApi.getSessionV1({
            getSessionV1Request: {
                sessionTokenAeadBase64,
            },
        });
        const sessionIdAeadBytes = this.binaryConverter.decodeFromBase64(sessionIdAeadBase64);
        const { plaintext: sessionIdBytes } = await this.aeadService.fromBytes(sessionIdAeadBytes, deviceKey);
        const sessionId = this.stringConverter.decodeFromBytes(sessionIdBytes);
        this.deviceContainerService.setSessionId(sessionId);
    }
}
