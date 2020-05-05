import { Injectable } from '@angular/core';
import { DefaultBinaryConverter, DefaultStringConverter } from '@diplomatiq/convertibles';
import { DeviceContainer } from '../types/deviceContainer';
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
    private loadedDeferred?: Deferred<void>;

    public constructor(private readonly aeadService: AeadService) {}

    public async initializeTemporaryContainer(): Promise<void> {
        await this.initialize(
            DeviceContainerService.TEMPORARY_DEVICE_ID,
            DeviceContainerService.TEMPORARY_DEVICE_CONTAINER_KEY,
        );
    }

    public async initialize(deviceId: string, deviceContainerKey: Uint8Array): Promise<void> {
        if (this.initDeferred !== undefined && this.loadedDeferred !== undefined) {
            this.initDeferred.reject();
            this.loadedDeferred.reject();
            this.purge();
        } else {
            this.reset();
        }

        this.initDeferred = new Deferred();
        this.loadedDeferred = new Deferred();

        this.deviceId = deviceId;
        this.deviceContainerKey = deviceContainerKey;

        this.initDeferred.resolve();

        const deviceContainerEntryId = await this.getDeviceContainerEntryId();
        const deviceContainerEntry = this.localStorage.getItem(deviceContainerEntryId);

        if (deviceContainerEntry === null) {
            this.deviceContainer = {};
        } else {
            try {
                const deviceContainerAeadBytes = this.binaryConverter.decodeFromBase64(deviceContainerEntry);
                const { plaintext: deviceContainerBytes } = await this.aeadService.fromBytes(
                    deviceContainerAeadBytes,
                    this.deviceContainerKey,
                );
                const deviceContainerJson = this.stringConverter.decodeFromBytes(deviceContainerBytes);
                this.deviceContainer = JSON.parse(deviceContainerJson);
            } catch (ex) {
                this.deviceContainer = {};
            }
        }

        this.loadedDeferred.resolve();

        await this.save();
        this.localStorage.setItem(DeviceContainerService.DEVICE_ID_KEY, this.deviceId);
    }

    public async getDeviceId(): Promise<string | undefined> {
        await this.initGuard();
        return this.deviceId;
    }

    public async getAuthenticationSessionId(): Promise<string | undefined> {
        await this.loadedGuard();
        return this.deviceContainer.authenticationSessionId;
    }

    public async setAuthenticationSessionId(authenticationSessionId: string): Promise<void> {
        await this.loadedGuard();
        this.deviceContainer.authenticationSessionId = authenticationSessionId;
        await this.save();
    }

    public async getAuthenticationSessionKey(): Promise<Uint8Array | undefined> {
        await this.loadedGuard();
        return this.binaryConverter.decodeFromBase64(this.deviceContainer.authenticationSessionKeyBase64);
    }

    public async setAuthenticationSessionKey(authenticationSessionKey: Uint8Array): Promise<void> {
        await this.loadedGuard();
        this.deviceContainer.authenticationSessionKeyBase64 = this.binaryConverter.encodeToBase64(
            authenticationSessionKey,
        );
        await this.save();
    }

    public async getDeviceKey(): Promise<Uint8Array | undefined> {
        await this.loadedGuard();
        return this.binaryConverter.decodeFromBase64(this.deviceContainer.deviceKeyBase64);
    }

    public async setDeviceKey(deviceKey: Uint8Array): Promise<void> {
        await this.loadedGuard();
        this.deviceContainer.deviceKeyBase64 = this.binaryConverter.encodeToBase64(deviceKey);
        await this.save();
    }

    public async getSessionId(): Promise<string | undefined> {
        await this.loadedGuard();
        return this.deviceContainer.sessionId;
    }

    public async setSessionId(sessionId: string): Promise<void> {
        await this.loadedGuard();
        this.deviceContainer.sessionId = sessionId;
        await this.save();
    }

    public async getSessionToken(): Promise<Uint8Array | undefined> {
        await this.loadedGuard();
        return this.binaryConverter.decodeFromBase64(this.deviceContainer.sessionTokenBase64);
    }

    public async setSessionToken(sessionToken: Uint8Array): Promise<void> {
        await this.loadedGuard();
        this.deviceContainer.sessionTokenBase64 = this.binaryConverter.encodeToBase64(sessionToken);
        await this.save();
    }

    public async clear(): Promise<void> {
        await this.loadedGuard();
        this.deviceContainer = {};
        await this.save();
    }

    public purge(): void {
        this.localStorage.clear();
    }

    private async save(): Promise<void> {
        await this.loadedGuard();

        const deviceContainerJson = JSON.stringify(this.deviceContainer);
        const deviceContainerBytes = this.stringConverter.encodeToBytes(deviceContainerJson);
        const deviceContainerAeadBytes = await this.aeadService.toBytes(
            deviceContainerBytes,
            new Uint8Array(),
            this.deviceContainerKey,
        );
        const deviceContainerAeadBase64 = this.binaryConverter.encodeToBase64(deviceContainerAeadBytes);
        this.localStorage.setItem(this.deviceId, deviceContainerAeadBase64);
    }

    private async getDeviceContainerEntryId(): Promise<string> {
        await this.initGuard();
        return `${DeviceContainerService.DEVICE_CONTAINER_ENTRY_PREFIX}_${this.deviceId}`;
    }

    private reset(): void {
        this.deviceId = undefined;
        this.deviceContainerKey = undefined;
        this.deviceContainer = undefined;

        this.initDeferred = undefined;
        this.loadedDeferred = undefined;
    }

    private async initGuard(): Promise<void> {
        if (this.initDeferred === undefined) {
            throw new Error('DeviceContainerNotInitialized');
        }

        await this.initDeferred.promise;
    }

    private async loadedGuard(): Promise<void> {
        await this.initGuard();

        if (this.loadedDeferred === undefined) {
            throw new Error('DeviceContainerNotInitialized');
        }

        await this.loadedDeferred.promise;
    }
}
