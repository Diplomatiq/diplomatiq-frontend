import { Injectable } from '@angular/core';
import { DefaultStringConverter } from '@diplomatiq/convertibles';
import * as scrypt from 'scrypt-async';

@Injectable({
    providedIn: 'root',
})
export class CryptoService {
    private readonly subtleCrypto = window.crypto.subtle;
    private readonly stringConverter = new DefaultStringConverter();

    public async sha256(payload: Uint8Array): Promise<Uint8Array> {
        const arrayBuffer = await this.subtleCrypto.digest('SHA-256', payload);
        return new Uint8Array(arrayBuffer);
    }

    public async hmacSha256(payload: Uint8Array, signingKey: Uint8Array): Promise<Uint8Array> {
        const cryptoKey = await this.subtleCrypto.importKey(
            'raw',
            signingKey,
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign'],
        );
        const arrayBuffer = await this.subtleCrypto.sign('HMAC', cryptoKey, payload);
        return new Uint8Array(arrayBuffer);
    }

    public async scrypt(password: Uint8Array, salt: Uint8Array): Promise<Uint8Array> {
        return new Promise<Uint8Array>((resolve): void => {
            scrypt(
                Array.from(password),
                Array.from(salt),
                {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    N: 32768,
                    r: 8,
                    p: 1,
                    dkLen: 32,
                    interruptStep: 0,
                    encoding: 'binary',
                },
                (derivedKey: string | number[]): void => {
                    resolve(Uint8Array.from(derivedKey as number[]));
                },
            );
        });
    }

    public async encrypt(
        plaintext: Uint8Array,
        aad: Uint8Array,
        iv: Uint8Array,
        encryptionKey: Uint8Array,
        tagLengthBytes: number,
    ): Promise<Uint8Array> {
        const cryptoKey = await this.subtleCrypto.importKey(
            'raw',
            encryptionKey,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt'],
        );
        const arrayBuffer = await this.subtleCrypto.encrypt(
            {
                name: 'AES-GCM',
                iv,
                additionalData: aad,
                tagLength: tagLengthBytes * 8,
            },
            cryptoKey,
            plaintext,
        );
        return new Uint8Array(arrayBuffer);
    }

    public async decrypt(
        ciphertext: Uint8Array,
        aad: Uint8Array,
        iv: Uint8Array,
        decryptionKey: Uint8Array,
        tagLengthBytes: number,
    ): Promise<Uint8Array> {
        const cryptoKey = await this.subtleCrypto.importKey(
            'raw',
            decryptionKey,
            { name: 'AES-GCM', length: 256 },
            false,
            ['decrypt'],
        );
        const arrayBuffer = await this.subtleCrypto.decrypt(
            {
                name: 'AES-GCM',
                iv,
                additionalData: aad,
                tagLength: tagLengthBytes * 8,
            },
            cryptoKey,
            ciphertext,
        );
        return new Uint8Array(arrayBuffer);
    }
}
