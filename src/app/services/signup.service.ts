import { Injectable } from '@angular/core';
import { DefaultBinaryConverter, DefaultStringConverter } from '@diplomatiq/convertibles';
import * as srp6Client from 'secure-remote-password/client';
import { RegisterUserV1RequestPasswordStretchingAlgorithmEnum } from '../../openapi/api';
import { ApiService } from './api.service';
import { CryptoService } from './crypto.service';

@Injectable({
    providedIn: 'root',
})
export class SignupService {
    private readonly binaryConverter = new DefaultBinaryConverter();
    private readonly stringConverter = new DefaultStringConverter();

    public constructor(private readonly cryptoService: CryptoService, private readonly apiService: ApiService) {}

    public async signUp(emailAddress: string, password: string, firstName: string, lastName: string): Promise<void> {
        const passwordBytes = this.stringConverter.encodeToBytes(password);
        const saltBytes = await this.cryptoService.randomGenerator.bytes(32);
        const passwordHashBytes = await this.cryptoService.scrypt(passwordBytes, saltBytes);

        const saltHex = this.binaryConverter.encodeToHex(saltBytes);
        const passwordHashHex = this.binaryConverter.encodeToHex(passwordHashBytes);
        const privateKey = srp6Client.derivePrivateKey(saltHex, emailAddress, passwordHashHex);

        const srpVerifierHex = srp6Client.deriveVerifier(privateKey);

        await this.apiService.unauthenticatedMethodsApi.registerUserV1({
            registerUserV1Request: {
                emailAddress,
                firstName,
                lastName,
                srpSaltHex: saltHex,
                srpVerifierHex,
                passwordStretchingAlgorithm: RegisterUserV1RequestPasswordStretchingAlgorithmEnum.ScryptV1,
            },
        });
    }
}
