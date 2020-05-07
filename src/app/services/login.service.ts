import { EventEmitter, Injectable } from '@angular/core';
import { DefaultBinaryConverter, DefaultStringConverter } from '@diplomatiq/convertibles';
import { BigInteger } from 'jsbn';
import { AuthenticationSession } from '../types/authentication-session';
import { AeadService } from './aead.service';
import { ApiService } from './api.service';
import { CryptoService } from './crypto.service';
import { DeviceContainerService } from './device-container.service';
import { SignupService } from './signup.service';
import { SrpService } from './srp.service';

@Injectable({
    providedIn: 'root',
})
export class LoginService {
    public readonly loggedIn = new EventEmitter<void>();
    public readonly loggedOut = new EventEmitter<void>();

    private readonly binaryConverter = new DefaultBinaryConverter();
    private readonly stringConverter = new DefaultStringConverter();

    public constructor(
        private readonly cryptoService: CryptoService,
        private readonly srpService: SrpService,
        private readonly apiService: ApiService,
        private readonly aeadService: AeadService,
        private readonly deviceContainerService: DeviceContainerService,
        private readonly signupService: SignupService,
    ) {}

    public async initLogin(emailAddress: string, password: string): Promise<void> {
        try {
            const authenticationSession = await this.getAuthenticationSession(emailAddress, password);

            this.deviceContainerService.initializeTemporaryEmptyContainer();
            await this.deviceContainerService.setAuthenticationSessionId(authenticationSession.id);
            await this.deviceContainerService.setAuthenticationSessionKey(authenticationSession.key);

            this.signupService.setValidationEmailAddress(emailAddress);

            await this.apiService.passwordElevatedAuthenticationSessionMethodsApi.elevateAuthenticationSessionInitV1();
        } catch (ex) {
            this.deviceContainerService.purge();
            throw ex;
        }
    }

    public async completeLogin(verificationCode: string): Promise<void> {
        await this.apiService.passwordElevatedAuthenticationSessionMethodsApi.elevateAuthenticationSessionCompleteV1({
            elevateAuthenticationSessionCompleteV1Request: {
                requestCode: `${verificationCode}`,
            },
        });

        this.signupService.flushValidationEmailAddress();

        try {
            const {
                deviceIdAeadBase64,
                deviceKeyAeadBase64,
                sessionTokenAeadBase64,
            } = await this.apiService.multiFactorElevatedAuthenticationSessionMethodsApi.loginV1();

            const authenticationSessionKey = await this.deviceContainerService.getAuthenticationSessionKey();

            const deviceKeyAeadBytes = this.binaryConverter.decodeFromBase64(deviceKeyAeadBase64);
            const { plaintext: deviceKeyBytes } = await this.aeadService.fromBytes(
                deviceKeyAeadBytes,
                authenticationSessionKey,
            );

            const deviceIdAeadBytes = this.binaryConverter.decodeFromBase64(deviceIdAeadBase64);
            const { plaintext: deviceIdBytes } = await this.aeadService.fromBytes(deviceIdAeadBytes, deviceKeyBytes);
            const deviceId = this.stringConverter.decodeFromBytes(deviceIdBytes);

            const sessionTokenAeadBytes = this.binaryConverter.decodeFromBase64(sessionTokenAeadBase64);
            const { plaintext: sessionTokenBytes } = await this.aeadService.fromBytes(
                sessionTokenAeadBytes,
                deviceKeyBytes,
            );

            const {
                deviceContainerKeyBase64,
            } = await this.apiService.unauthenticatedMethodsApi.getDeviceContainerKeyV1({
                deviceId,
            });
            const deviceContainerKeyBytes = this.binaryConverter.decodeFromBase64(deviceContainerKeyBase64);

            this.deviceContainerService.initializeEmptyContainer(deviceId, deviceContainerKeyBytes);
            await this.deviceContainerService.setDeviceKey(deviceKeyBytes);
            await this.deviceContainerService.setSessionToken(sessionTokenBytes);

            this.loggedIn.emit();
        } catch (ex) {
            this.deviceContainerService.purge();
            throw ex;
        }
    }

    public async logout(): Promise<void> {
        try {
            await this.apiService.deviceMethodsApi.logoutV1();
            this.loggedOut.emit();
        } catch (ex) {
            // ignored
        } finally {
            this.deviceContainerService.purge();
        }
    }

    public async isLoggedIn(): Promise<boolean> {
        return this.deviceContainerService.isLoggedIn();
    }

    private async getAuthenticationSession(emailAddress: string, password: string): Promise<AuthenticationSession> {
        const initResponse = await this.apiService.unauthenticatedMethodsApi.passwordAuthenticationInitV1({
            passwordAuthenticationInitV1Request: {
                emailAddress,
            },
        });

        const saltHex = initResponse.srpSaltHex;
        const saltBytes = this.binaryConverter.decodeFromHex(saltHex);

        const passwordBytes = this.stringConverter.encodeToBytes(password);
        const passwordHashBytes = await this.cryptoService.scrypt(passwordBytes, saltBytes);
        const passwordHashHex = this.binaryConverter.encodeToHex(passwordHashBytes);

        const srpClient = this.srpService.getSrpClient();
        srpClient.step1(emailAddress, passwordHashHex);

        const saltBigInteger = new BigInteger(saltHex, 16);

        const serverEphemeralHex = initResponse.serverEphemeralHex;
        const serverEphemeralBigInteger = new BigInteger(serverEphemeralHex, 16);

        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { A: clientEphemeral, M1: clientProof } = srpClient.step2(saltBigInteger, serverEphemeralBigInteger);

        const completeResponse = await this.apiService.unauthenticatedMethodsApi.passwordAuthenticationCompleteV1({
            passwordAuthenticationCompleteV1Request: {
                emailAddress,
                clientEphemeralHex: clientEphemeral.toString(16),
                clientProofHex: clientProof.toString(16),
                serverEphemeralHex,
            },
        });

        const clientKeyHex = srpClient.S.toString(16);
        const clientKeyBytes = this.binaryConverter.decodeFromHex(clientKeyHex);
        const authenticationSessionKey = await this.cryptoService.sha256(clientKeyBytes);

        const authenticationSessionIdAeadBase64 = completeResponse.authenticationSessionIdAeadBase64;
        const authenticationSessionIdAeadBytes = this.binaryConverter.decodeFromBase64(
            authenticationSessionIdAeadBase64,
        );
        const authenticationSessionIdAead = await this.aeadService.fromBytes(
            authenticationSessionIdAeadBytes,
            authenticationSessionKey,
        );
        const authenticationSessionIdBytes = authenticationSessionIdAead.plaintext;
        const authenticationSessionId = this.stringConverter.decodeFromBytes(authenticationSessionIdBytes);

        return {
            id: authenticationSessionId,
            key: authenticationSessionKey,
        };
    }
}
