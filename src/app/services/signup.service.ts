import { Injectable } from '@angular/core';
import { DefaultBinaryConverter, DefaultStringConverter } from '@diplomatiq/convertibles';
import { RegisterUserV1RequestPasswordStretchingAlgorithmEnum } from '../../openapi/api';
import { ApiService } from './api.service';
import { CryptoService } from './crypto.service';
import { SrpService } from './srp.service';

@Injectable({
    providedIn: 'root',
})
export class SignupService {
    private readonly binaryConverter = new DefaultBinaryConverter();
    private readonly stringConverter = new DefaultStringConverter();

    private lastSignupEmailAddress?: string;

    public constructor(
        private readonly cryptoService: CryptoService,
        private readonly srpService: SrpService,
        private readonly apiService: ApiService,
    ) {}

    public async signup(emailAddress: string, password: string, firstName: string, lastName: string): Promise<void> {
        const saltBytes = await this.cryptoService.randomGenerator.bytes(32);
        const saltHex = this.binaryConverter.encodeToHex(saltBytes);

        const passwordBytes = this.stringConverter.encodeToBytes(password);
        const passwordScryptBytes = await this.cryptoService.scrypt(passwordBytes, saltBytes);
        const passwordScryptHex = this.binaryConverter.encodeToHex(passwordScryptBytes);

        const verifierHex = this.srpService.createVerifier(emailAddress, passwordScryptHex, saltHex);

        await this.apiService.unauthenticatedMethodsApi.registerUserV1({
            registerUserV1Request: {
                emailAddress,
                firstName,
                lastName,
                srpSaltHex: saltHex,
                srpVerifierHex: verifierHex,
                passwordStretchingAlgorithm: RegisterUserV1RequestPasswordStretchingAlgorithmEnum.ScryptV1,
            },
        });

        this.setValidationEmailAddress(emailAddress);
    }

    public setValidationEmailAddress(emailAddress: string): void {
        this.lastSignupEmailAddress = emailAddress;
    }

    public flushValidationEmailAddress(): string | undefined {
        const emailAddress = this.lastSignupEmailAddress;
        this.lastSignupEmailAddress = undefined;
        return emailAddress;
    }
}
