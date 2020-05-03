import { Injectable } from '@angular/core';
import { DefaultBinaryConverter, DefaultStringConverter } from '@diplomatiq/convertibles';
import { Deferred } from '../utils/deferred';
import { AeadService } from './aead.service';
import { DeviceContainerKeyService } from './deviceContainerKey.service';

@Injectable({
    providedIn: 'root',
})
export class DeviceContainerService {
    private static readonly DEVICE_ID_KEY = 'lastDeviceId';
    private static readonly DEVICE_CONTAINER_ENTRY_PREFIX = 'deviceContainer';

    private readonly localStorage = window.localStorage;

    private readonly binaryConverter = new DefaultBinaryConverter();
    private readonly stringConverter = new DefaultStringConverter();

    private loadingDeferred?: Deferred<void>;
    private deviceContainerKeyDeferred?: Deferred<void>;

    private deviceId?: string;

    private deviceContainerKey?: Uint8Array;
    private deviceContainer?: {
        [key: string]: string;
    };

    public constructor(
        private readonly aeadService: AeadService,
        private readonly deviceContainerKeyService: DeviceContainerKeyService,
    ) {
        const deviceId = this.localStorage.getItem(DeviceContainerService.DEVICE_ID_KEY);
        if (deviceId !== null) {
            this.initialize(deviceId);
        }
    }

    public initialize(deviceId: string): void {
        this.clear();
        this.deviceId = deviceId;
        this.localStorage.setItem(DeviceContainerService.DEVICE_ID_KEY, this.deviceId);
    }

    public async getAuthenticationSessionId(): Promise<string> {
        await this.load();
        return 'asd';
    }

    public async getDeviceId(): Promise<string> {
        await this.load();
        return 'asd';
    }

    public async getSessionId(): Promise<string> {
        await this.load();
        return 'asd';
    }

    public async getAuthenticationSessionKey(): Promise<Uint8Array> {
        await this.load();
        return new Uint8Array();
    }

    public async getDeviceKey(): Promise<Uint8Array> {
        await this.load();
        return new Uint8Array();
    }

    public purge(): void {
        this.deleteDeviceContainerEntry();
        this.clear();
    }

    private async load(): Promise<void> {
        if (this.deviceId === undefined) {
            this.clear();
            throw new Error('DeviceContainerNotInitialized');
        }

        try {
            if (this.loadingDeferred !== undefined) {
                await this.loadingDeferred.promise;
            } else {
                this.loadingDeferred = new Deferred();
            }

            if (this.deviceContainer !== undefined) {
                return;
            }

            const deviceContainerKey = await this.getDeviceContainerKey();

            const deviceContainerEntry = this.getDeviceContainerEntry();

            if (deviceContainerEntry === null) {
                this.deviceContainer = {};
                return;
            }

            const deviceContainerAeadBytes = this.binaryConverter.decodeFromBase64(deviceContainerEntry);
            const { plaintext: deviceContainerBytes } = await this.aeadService.fromBytes(
                deviceContainerAeadBytes,
                deviceContainerKey,
            );
            const deviceContainerJson = this.stringConverter.decodeFromBytes(deviceContainerBytes);
            this.deviceContainer = JSON.parse(deviceContainerJson);
        } catch (ex) {
            this.deviceContainer = {};
        } finally {
            if (this.loadingDeferred !== undefined) {
                this.loadingDeferred.resolve();
                this.loadingDeferred = undefined;
            }
        }
    }

    private async save(): Promise<void> {
        if (this.deviceId === undefined) {
            this.clear();
            throw new Error('DeviceContainerNotInitialized');
        }

        if (this.deviceContainer === undefined) {
            return;
        }

        const deviceContainerKey = await this.getDeviceContainerKey();

        try {
            const deviceContainerJson = JSON.stringify(this.deviceContainer);
            const deviceContainerBytes = this.stringConverter.encodeToBytes(deviceContainerJson);
            const deviceContainerAeadBytes = await this.aeadService.toBytes(
                deviceContainerBytes,
                new Uint8Array(),
                deviceContainerKey,
            );
            const deviceContainerAeadBase64 = this.binaryConverter.encodeToBase64(deviceContainerAeadBytes);
            this.localStorage.setItem(this.deviceId, deviceContainerAeadBase64);
        } catch (ex) {
            this.initialize(this.deviceId);
        }
    }

    private async getDeviceContainerKey(): Promise<Uint8Array> {
        if (this.deviceId === undefined) {
            this.clear();
            throw new Error('DeviceContainerNotInitialized');
        }

        try {
            this.deviceContainerKeyDeferred = new Deferred();

            if (this.deviceContainerKey === undefined) {
                const deviceContainerKeyResponse = await this.deviceContainerKeyService.getDeviceContainerKey(
                    this.deviceId,
                );
                this.deviceContainerKey = this.binaryConverter.decodeFromBase64(
                    deviceContainerKeyResponse.deviceContainerKeyBase64,
                );
            }

            return this.deviceContainerKey;
        } finally {
            if (this.deviceContainerKeyDeferred !== undefined) {
                this.deviceContainerKeyDeferred.resolve();
                this.deviceContainerKeyDeferred = undefined;
            }
        }
    }

    private getDeviceContainerEntry(): string | null {
        if (this.deviceId === undefined) {
            this.clear();
            throw new Error('DeviceContainerNotInitialized');
        }

        const deviceContainerEntryId = this.getDeviceContainerEntryId();
        return this.localStorage.getItem(deviceContainerEntryId);
    }

    private deleteDeviceContainerEntry(): void {
        if (this.deviceId === undefined) {
            this.clear();
            throw new Error('DeviceContainerNotInitialized');
        }

        const deviceContainerEntryId = this.getDeviceContainerEntryId();
        this.localStorage.removeItem(deviceContainerEntryId);
        this.localStorage.removeItem(DeviceContainerService.DEVICE_ID_KEY);
    }

    private getDeviceContainerEntryId(): string {
        if (this.deviceId === undefined) {
            this.clear();
            throw new Error('DeviceContainerNotInitialized');
        }

        return `${DeviceContainerService.DEVICE_CONTAINER_ENTRY_PREFIX}_${this.deviceId}`;
    }

    private clear(): void {
        this.deviceId = undefined;
        this.deviceContainer = undefined;
        this.deviceContainerKey = undefined;

        this.loadingDeferred = undefined;
        this.deviceContainerKeyDeferred = undefined;
    }
}
