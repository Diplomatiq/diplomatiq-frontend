import { Injectable } from '@angular/core';
import { DefaultBinaryConverter } from '@diplomatiq/convertibles';
import { ApiService } from './api.service';
import { DeviceContainerService } from './deviceContainer.service';

@Injectable({
    providedIn: 'root',
})
export class AppInitializerService {
    private readonly binaryConverter = new DefaultBinaryConverter();

    public constructor(
        private readonly deviceContainerService: DeviceContainerService,
        private readonly apiService: ApiService,
    ) {}

    public async initialize(): Promise<void> {
        await this.initializeDeviceContainer();
    }

    private async initializeDeviceContainer(): Promise<void> {
        const deviceContainerKeyGetter = async (deviceId: string): Promise<Uint8Array> => {
            const getDeviceContainerKeyV1Response = await this.apiService.unauthenticatedMethodsApi.getDeviceContainerKeyV1(
                { deviceId },
            );
            return this.binaryConverter.decodeFromBase64(getDeviceContainerKeyV1Response.deviceContainerKeyBase64);
        };

        await this.deviceContainerService.initializeFromPersistedContainer(deviceContainerKeyGetter);
    }
}
