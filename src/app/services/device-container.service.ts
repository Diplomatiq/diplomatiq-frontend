import { Injectable } from '@angular/core';
import { DefaultBinaryConverter, DefaultStringConverter } from '@diplomatiq/convertibles';
import { DeviceContainer } from '../types/device-container';
import { Deferred } from '../utils/deferred';
import { AeadService } from './aead.service';

@Injectable({
    providedIn: 'root',
})
export class DeviceContainerService {
    private static readonly DEVICE_ID_KEY = 'deviceId';
    private static readonly DEVICE_CONTAINER_ENTRY_PREFIX = 'deviceContainer';

    private static readonly TEMPORARY_DEVICE_ID = 'TEMPORARY_DEVICE_ID';
    private static readonly TEMPORARY_DEVICE_CONTAINER_KEY = Uint8Array.from([
        61,
        116,
        101,
        109,
        112,
        111,
        114,
        97,
        114,
        121,
        32,
        100,
        101,
        118,
        105,
        99,
        101,
        32,
        99,
        111,
        110,
        116,
        97,
        105,
        110,
        101,
        114,
        32,
        107,
        101,
        121,
        61,
    ]);

    private readonly localStorage = window.localStorage;

    private readonly binaryConverter = new DefaultBinaryConverter();
    private readonly stringConverter = new DefaultStringConverter();

    private deviceId?: string;
    private deviceContainerKey?: Uint8Array;
    private deviceContainer?: DeviceContainer;

    private initDeferred?: Deferred<void>;

    public constructor(private readonly aeadService: AeadService) {}

    public initializeTemporaryEmptyContainer(): void {
        this.initializeInternal(
            DeviceContainerService.TEMPORARY_DEVICE_ID,
            DeviceContainerService.TEMPORARY_DEVICE_CONTAINER_KEY,
            {},
        );
    }

    public initializeEmptyContainer(deviceId: string, deviceContainerKey: Uint8Array): void {
        this.initializeInternal(deviceId, deviceContainerKey, {});
    }

    public async initializeFromPersistedContainer(
        deviceContainerKeyGetter: (deviceId: string) => Promise<Uint8Array>,
    ): Promise<void> {
        const deviceId = this.localStorage.getItem(DeviceContainerService.DEVICE_ID_KEY);
        if (deviceId === null) {
            this.purge();
            return;
        }

        try {
            const deviceContainerEntryId = this.getDeviceContainerEntryId(deviceId);
            const deviceContainerEntry = this.localStorage.getItem(deviceContainerEntryId);
            const deviceContainerAeadBytes = this.binaryConverter.decodeFromBase64(deviceContainerEntry);
            const deviceContainerKey = await deviceContainerKeyGetter(deviceId);
            const { plaintext: deviceContainerBytes } = await this.aeadService.fromBytes(
                deviceContainerAeadBytes,
                deviceContainerKey,
            );
            const deviceContainerJson = this.stringConverter.decodeFromBytes(deviceContainerBytes);
            const deviceContainer = JSON.parse(deviceContainerJson);

            this.initializeInternal(deviceId, deviceContainerKey, deviceContainer);
        } catch (ex) {
            this.purge();
        }
    }

    public async getDeviceId(): Promise<string | undefined> {
        await this.initGuard();
        return this.deviceId;
    }

    public async isLoggedIn(): Promise<boolean> {
        try {
            await this.initGuard();
            return (
                this.deviceId !== undefined &&
                this.deviceId !== DeviceContainerService.TEMPORARY_DEVICE_ID &&
                this.deviceContainer.deviceKeyBase64 !== undefined &&
                this.deviceContainer.sessionTokenBase64 !== undefined
            );
        } catch (ex) {
            return false;
        }
    }

    public async getAuthenticationSessionId(): Promise<string | undefined> {
        await this.initGuard();
        return this.deviceContainer.authenticationSessionId;
    }

    public async setAuthenticationSessionId(authenticationSessionId: string): Promise<void> {
        await this.initGuard();
        this.deviceContainer.authenticationSessionId = authenticationSessionId;
        await this.save();
    }

    public async getAuthenticationSessionKey(): Promise<Uint8Array | undefined> {
        await this.initGuard();
        return this.binaryConverter.decodeFromBase64(this.deviceContainer.authenticationSessionKeyBase64);
    }

    public async setAuthenticationSessionKey(authenticationSessionKey: Uint8Array): Promise<void> {
        await this.initGuard();
        this.deviceContainer.authenticationSessionKeyBase64 = this.binaryConverter.encodeToBase64(
            authenticationSessionKey,
        );
        await this.save();
    }

    public async getDeviceKey(): Promise<Uint8Array | undefined> {
        await this.initGuard();
        return this.binaryConverter.decodeFromBase64(this.deviceContainer.deviceKeyBase64);
    }

    public async setDeviceKey(deviceKey: Uint8Array): Promise<void> {
        await this.initGuard();
        this.deviceContainer.deviceKeyBase64 = this.binaryConverter.encodeToBase64(deviceKey);
        await this.save();
    }

    public async getSessionId(): Promise<string | undefined> {
        await this.initGuard();
        return this.deviceContainer.sessionId;
    }

    public async setSessionId(sessionId: string): Promise<void> {
        await this.initGuard();
        this.deviceContainer.sessionId = sessionId;
        await this.save();
    }

    public async getSessionToken(): Promise<Uint8Array | undefined> {
        await this.initGuard();
        return this.binaryConverter.decodeFromBase64(this.deviceContainer.sessionTokenBase64);
    }

    public async setSessionToken(sessionToken: Uint8Array): Promise<void> {
        await this.initGuard();
        this.deviceContainer.sessionTokenBase64 = this.binaryConverter.encodeToBase64(sessionToken);
        await this.save();
    }

    public async clear(): Promise<void> {
        await this.initGuard();
        this.deviceContainer = {};
        await this.save();
    }

    public purge(): void {
        this.localStorage.clear();
        this.reset();
    }

    private initializeInternal(
        deviceId: string,
        deviceContainerKey: Uint8Array,
        deviceContainer: DeviceContainer,
    ): void {
        if (this.initDeferred !== undefined) {
            this.initDeferred.reject();
            this.purge();
        } else {
            this.reset();
        }

        this.initDeferred = new Deferred();

        this.deviceId = deviceId;
        this.deviceContainerKey = deviceContainerKey;
        this.deviceContainer = deviceContainer;

        this.initDeferred.resolve();
    }

    private async save(): Promise<void> {
        await this.initGuard();

        const deviceContainerJson = JSON.stringify(this.deviceContainer);
        const deviceContainerBytes = this.stringConverter.encodeToBytes(deviceContainerJson);
        const deviceContainerAeadBytes = await this.aeadService.toBytes(
            deviceContainerBytes,
            new Uint8Array(),
            this.deviceContainerKey,
        );
        const deviceContainerAeadBase64 = this.binaryConverter.encodeToBase64(deviceContainerAeadBytes);

        const deviceContainerEntryId = this.getDeviceContainerEntryId(this.deviceId);
        this.localStorage.setItem(deviceContainerEntryId, deviceContainerAeadBase64);
        this.localStorage.setItem(DeviceContainerService.DEVICE_ID_KEY, this.deviceId);
    }

    private getDeviceContainerEntryId(deviceId: string): string {
        return `${DeviceContainerService.DEVICE_CONTAINER_ENTRY_PREFIX}_${deviceId}`;
    }

    private reset(): void {
        this.deviceId = undefined;
        this.deviceContainerKey = undefined;
        this.deviceContainer = undefined;

        this.initDeferred = undefined;
    }

    private async initGuard(): Promise<void> {
        if (this.initDeferred === undefined) {
            throw new Error('DeviceContainerNotInitialized');
        }

        await this.initDeferred.promise;
    }
}
