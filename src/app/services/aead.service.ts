import { Injectable } from '@angular/core';
import { CryptoService } from './crypto.service';

/**
 * Lightweight AEAD (Authenticated Encryption with Associated Data) structure
 * with binary serialization and deserialization features.
 *
 * Serialization scheme:
 * HEADER:
 * - 1 byte                     ivLength = initialization vector length in bytes
 * - 4 bytes                    aadLength = additional authenticated data length in bytes, big-endian
 * - 4 bytes                    ciphertextLength = ciphertext length in bytes, big-endian
 * - 1 byte                     tagLength = authentication tag length in bytes
 * BODY:
 * - ivLength bytes             the initialization vector
 * - aadLength bytes            the additional authenticated data
 * - ciphertextLength bytes     the ciphertext
 * - tagLength bytes            the authentication tag
 */
@Injectable({
    providedIn: 'root',
})
export class AeadService {
    private static readonly INITIALIZATION_VECTOR_LENGTH_BYTES = 12;
    private static readonly AUTHENTICATION_TAG_LENGTH_BYTES = 16;

    public constructor(private readonly cryptoService: CryptoService) {}

    public async toBytes(plaintext: Uint8Array, aad: Uint8Array, key: Uint8Array): Promise<Uint8Array> {
        const iv = await this.cryptoService.randomGenerator.bytes(AeadService.INITIALIZATION_VECTOR_LENGTH_BYTES);
        const ciphertextWithAuthenticationTag = await this.cryptoService.encrypt(
            plaintext,
            aad,
            iv,
            key,
            AeadService.AUTHENTICATION_TAG_LENGTH_BYTES,
        );

        const ivLength = this.convertPositiveNumberToFixLengthBigEndianUint8Array(
            1,
            AeadService.INITIALIZATION_VECTOR_LENGTH_BYTES,
        );
        const aadLength = this.convertPositiveNumberToFixLengthBigEndianUint8Array(4, aad.length);
        const ciphertextLength = this.convertPositiveNumberToFixLengthBigEndianUint8Array(4, plaintext.length);
        const tagLength = this.convertPositiveNumberToFixLengthBigEndianUint8Array(
            1,
            AeadService.AUTHENTICATION_TAG_LENGTH_BYTES,
        );

        return this.concatUint8Arrays([
            ivLength,
            aadLength,
            ciphertextLength,
            tagLength,
            iv,
            aad,
            ciphertextWithAuthenticationTag,
        ]);
    }

    public async fromBytes(bytes: Uint8Array, key: Uint8Array): Promise<{ plaintext: Uint8Array; aad: Uint8Array }> {
        let cursor = 0;
        let reading = 0;

        reading = 1;
        const ivLengthBytes = bytes.subarray(cursor, cursor + reading);
        const ivLength = this.convertBigEndianUint8ArrayToPositiveNumber(ivLengthBytes);
        cursor += reading;

        reading = 4;
        const aadLengthBytes = bytes.subarray(cursor, cursor + reading);
        const aadLength = this.convertBigEndianUint8ArrayToPositiveNumber(aadLengthBytes);
        cursor += reading;

        reading = 4;
        const ciphertextLengthBytes = bytes.subarray(cursor, cursor + reading);
        const ciphertextLength = this.convertBigEndianUint8ArrayToPositiveNumber(ciphertextLengthBytes);
        cursor += reading;

        reading = 1;
        const tagLengthBytes = bytes.subarray(cursor, cursor + reading);
        const tagLength = this.convertBigEndianUint8ArrayToPositiveNumber(tagLengthBytes);
        cursor += reading;

        reading = ivLength;
        const iv = bytes.subarray(cursor, cursor + reading);
        cursor += reading;

        reading = aadLength;
        const aad = bytes.subarray(cursor, cursor + reading);
        cursor += reading;

        reading = ciphertextLength + tagLength;
        const ciphertextWithAuthenticationTag = bytes.subarray(cursor, cursor + reading);
        cursor += reading;

        const plaintext = await this.cryptoService.decrypt(ciphertextWithAuthenticationTag, aad, iv, key, tagLength);

        return {
            plaintext,
            aad,
        };
    }

    private concatUint8Arrays(arrays: Uint8Array[]): Uint8Array {
        const length = arrays
            .map((a: Uint8Array): number => a.length)
            .reduce((acc: number, curr: number): number => acc + curr, 0);

        const result = new Uint8Array(length);

        let cursor = 0;
        for (const array of arrays) {
            result.set(array, cursor);
            cursor += array.length;
        }

        return result;
    }

    private convertPositiveNumberToFixLengthBigEndianUint8Array(byteLength: number, number: number): Uint8Array {
        if (byteLength <= 0) {
            throw new Error('byteLength must be > 0');
        }

        if (number < 0) {
            throw new Error('number most be >= 0');
        }

        if (number === 0) {
            return new Uint8Array(byteLength);
        }

        const storageUpperBound = 2 ** (8 * byteLength) - 1;
        if (number > storageUpperBound) {
            throw new Error('number must be <= 2 ** (8 * byteLength) - 1');
        }

        const result = new Uint8Array(byteLength);
        for (let cursor = 0; cursor < byteLength; cursor++) {
            const shiftRightWith = 8 * (byteLength - cursor - 1);
            const byteValue = (number >> shiftRightWith) % 256;
            result.set([byteValue], cursor);
        }

        return result;
    }

    private convertBigEndianUint8ArrayToPositiveNumber(bytes: Uint8Array): number {
        if (bytes.length === 0) {
            return 0;
        }

        const byteLength = bytes.length;

        let result = 0;
        for (let cursor = 0; cursor < byteLength; cursor++) {
            const shiftLeftWith = 8 * (byteLength - cursor - 1);
            const realValue = bytes[cursor] << shiftLeftWith;
            result += realValue;
        }

        return result;
    }
}
