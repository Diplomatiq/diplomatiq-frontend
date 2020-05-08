import { Injectable } from '@angular/core';
import { DefaultBinaryConverter, DefaultStringConverter } from '@diplomatiq/convertibles';
import { ChangePasswordV1RequestPasswordStretchingAlgorithmEnum } from '../../openapi/api';
import { ApiService } from './api.service';
import { CryptoService } from './crypto.service';
import { SessionService } from './session.service';
import { SrpService } from './srp.service';

@Injectable({
    providedIn: 'root',
})
export class ChangePasswordService {
    private readonly binaryConverter = new DefaultBinaryConverter();
    private readonly stringConverter = new DefaultStringConverter();

    public constructor(
        private readonly sessionService: SessionService,
        private readonly cryptoService: CryptoService,
        private readonly srpService: SrpService,
        private readonly apiService: ApiService,
    ) {}

    public async changePassword(newPassword: string): Promise<void> {
        const { emailAddress } = await this.sessionService.getUserIdentity();

        const saltBytes = await this.cryptoService.randomGenerator.bytes(32);
        const saltHex = this.binaryConverter.encodeToHex(saltBytes);

        const passwordBytes = this.stringConverter.encodeToBytes(newPassword);
        const passwordScryptBytes = await this.cryptoService.scrypt(passwordBytes, saltBytes);
        const passwordScryptHex = this.binaryConverter.encodeToHex(passwordScryptBytes);

        const verifierHex = this.srpService.createVerifier(emailAddress, passwordScryptHex, saltHex);

        await this.sessionService.withPasswordElevatedSession(
            async (): Promise<void> => {
                await this.apiService.passwordElevatedSessionMethodsApi.changePasswordV1({
                    changePasswordV1Request: {
                        srpSaltHex: saltHex,
                        srpVerifierHex: verifierHex,
                        passwordStretchingAlgorithm: ChangePasswordV1RequestPasswordStretchingAlgorithmEnum.ScryptV1,
                    },
                });
            },
        );
    }
}
