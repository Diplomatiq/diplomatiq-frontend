import { Injectable } from '@angular/core';
import { DefaultBinaryConverter, DefaultStringConverter } from '@diplomatiq/convertibles';
import { RetryPolicy } from '@diplomatiq/resily';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BigInteger } from 'jsbn';
import { DiplomatiqApiErrorErrorCodeEnum, GetUserIdentityV1Response } from '../../openapi/api';
import {
    MfaRequestModalComponent,
    MfaRequestModalResult,
    MfaRequestModalResultEnum,
} from '../components/modals/mfa-request-modal/mfa-request-modal.component';
import {
    PasswordRequestModalComponent,
    PasswordRequestModalResult,
    PasswordRequestModalResultEnum,
} from '../components/modals/password-request-modal/password-request-modal.component';
import { DiplomatiqApiException } from '../exceptions/diplomatiq-api-exception';
import { OperationCancelledException } from '../exceptions/operation-cancelled-exception';
import { ResendMfaVerificationCodeException } from '../exceptions/resend-verification-code-exception';
import { AeadService } from './aead.service';
import { ApiService } from './api.service';
import { CryptoService } from './crypto.service';
import { DeviceContainerService } from './device-container.service';
import { NotificationService } from './notification.service';
import { SrpService } from './srp.service';

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
        private readonly cryptoService: CryptoService,
        private readonly srpService: SrpService,
        private readonly modalService: NgbModal,
        private readonly notificationService: NotificationService,
    ) {}

    public async getUserIdentity(): Promise<GetUserIdentityV1Response> {
        return this.withRegularSession(
            async (): Promise<GetUserIdentityV1Response> => {
                return this.apiService.regularSessionMethodsApi.getUserIdentityV1();
            },
        );
    }

    public async withRegularSession<T>(apiCall: () => Promise<T>): Promise<T> {
        const sessionId = await this.deviceContainerService.getSessionId();
        if (sessionId === undefined) {
            await this.getNewSession();
        }

        const policy = new RetryPolicy<T>();
        policy.reactOnException(
            (ex: DiplomatiqApiException): boolean => ex.errorCode === DiplomatiqApiErrorErrorCodeEnum.Unauthorized,
        );
        policy.retryCount(1);
        policy.onRetry(
            async (): Promise<void> => {
                await this.getNewSession();
            },
        );
        return policy.execute(async (): Promise<T> => apiCall());
    }

    public async withPasswordElevatedSession<T>(apiCall: () => Promise<T>): Promise<T> {
        const policy = new RetryPolicy<T>();
        policy.reactOnException(
            (ex: DiplomatiqApiException): boolean =>
                ex.errorCode === DiplomatiqApiErrorErrorCodeEnum.SessionElevationRequired,
        );
        policy.retryCount(1);
        policy.onRetry(
            async (): Promise<void> => {
                await this.elevateSessionToPasswordElevated();
            },
        );
        return policy.execute(
            async (): Promise<T> => {
                return this.withRegularSession(
                    async (): Promise<T> => {
                        return apiCall();
                    },
                );
            },
        );
    }

    public async withMultiFactorElevatedSession<T>(apiCall: () => Promise<T>): Promise<T> {
        const policy = new RetryPolicy<T>();
        policy.reactOnException(
            (ex: DiplomatiqApiException): boolean =>
                ex.errorCode === DiplomatiqApiErrorErrorCodeEnum.SessionElevationRequired,
        );
        policy.retryCount(1);
        policy.onRetry(
            async (): Promise<void> => {
                await this.elevateSessionToMultiFactorElevated();
            },
        );
        return policy.execute(
            async (): Promise<T> => {
                return this.withPasswordElevatedSession(
                    async (): Promise<T> => {
                        return apiCall();
                    },
                );
            },
        );
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
        await this.deviceContainerService.setSessionId(sessionId);
    }

    private async elevateSessionToPasswordElevated(): Promise<void> {
        const policy = new RetryPolicy<void>();
        policy.reactOnException(
            (ex: DiplomatiqApiException): boolean => ex.errorCode === DiplomatiqApiErrorErrorCodeEnum.Unauthorized,
        );
        policy.retryForever();
        policy.onRetry((): void => {
            this.notificationService.danger('Wrong password, please try again.');
        });
        await policy.execute(
            async (): Promise<void> => {
                const modal = this.modalService.open(PasswordRequestModalComponent);
                const modalResult: PasswordRequestModalResult = await modal.result;
                if (modalResult.result === PasswordRequestModalResultEnum.Cancel) {
                    throw new OperationCancelledException();
                }

                const { emailAddress } = await this.getUserIdentity();
                const password = modalResult.password;

                await this.performPasswordVerificationHandshake(emailAddress, password);
            },
        );
    }

    private async elevateSessionToMultiFactorElevated(): Promise<void> {
        const policy = new RetryPolicy<void>();

        policy.reactOnException((ex: Error): boolean => {
            if (ex instanceof DiplomatiqApiException) {
                return ex.errorCode === DiplomatiqApiErrorErrorCodeEnum.Unauthorized;
            }

            if (ex instanceof ResendMfaVerificationCodeException) {
                return true;
            }

            return false;
        });

        policy.retryForever();

        policy.onRetry(
            async (
                _result: void,
                error: DiplomatiqApiException | ResendMfaVerificationCodeException,
            ): Promise<void> => {
                if (
                    error instanceof DiplomatiqApiException &&
                    error.errorCode === DiplomatiqApiErrorErrorCodeEnum.Unauthorized
                ) {
                    this.notificationService.danger('Wrong verification code, please try again.');
                }

                if (error instanceof ResendMfaVerificationCodeException) {
                    await this.apiService.passwordElevatedSessionMethodsApi.elevatePasswordElevatedSessionInitV1();
                    this.notificationService.success('The code was sent to your email.');
                }
            },
        );

        await this.apiService.passwordElevatedSessionMethodsApi.elevatePasswordElevatedSessionInitV1();

        await policy.execute(
            async (): Promise<void> => {
                const modal = this.modalService.open(MfaRequestModalComponent);
                const modalResult: MfaRequestModalResult = await modal.result;

                if (modalResult.result === MfaRequestModalResultEnum.Cancel) {
                    throw new OperationCancelledException();
                }

                if (modalResult.result === MfaRequestModalResultEnum.ResendVerificationCode) {
                    throw new ResendMfaVerificationCodeException();
                }

                await this.apiService.passwordElevatedSessionMethodsApi.elevatePasswordElevatedSessionCompleteV1({
                    elevatePasswordElevatedSessionCompleteV1Request: {
                        requestCode: modalResult.verificationCode,
                    },
                });
            },
        );
    }

    private async performPasswordVerificationHandshake(emailAddress: string, password: string): Promise<void> {
        const initResponse = await this.apiService.regularSessionMethodsApi.elevateRegularSessionInitV1();

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

        await this.apiService.regularSessionMethodsApi.elevateRegularSessionCompleteV1({
            elevateRegularSessionCompleteV1Request: {
                clientEphemeralHex: clientEphemeral.toString(16),
                clientProofHex: clientProof.toString(16),
                serverEphemeralHex,
            },
        });
    }
}
