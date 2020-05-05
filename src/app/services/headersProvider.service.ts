import { Injectable } from '@angular/core';
import { DefaultBinaryConverter, DefaultStringConverter } from '@diplomatiq/convertibles';
import { HTTPHeaders } from '../../openapi/api/index';
import { DiplomatiqAuthenticationScheme } from '../types/diplomatiqAuthenticationScheme';
import { BaseHeadersProviderService } from './baseHeadersProvider.service';
import { CryptoService } from './crypto.service';
import { DeviceContainerService } from './deviceContainer.service';

@Injectable({
    providedIn: 'root',
})
export class HeadersProviderService {
    private readonly binaryConverter = new DefaultBinaryConverter();
    private readonly stringConverter = new DefaultStringConverter();

    public constructor(
        private readonly baseHeadersProviderService: BaseHeadersProviderService,
        private readonly deviceContainerService: DeviceContainerService,
        private readonly cryptoService: CryptoService,
    ) {}

    public async provideHeaders(
        authenticationScheme: DiplomatiqAuthenticationScheme,
        url: string,
        request: RequestInit,
    ): Promise<void> {
        switch (authenticationScheme) {
            case DiplomatiqAuthenticationScheme.Unauthenticated:
                return this.unauthenticated(url, request);

            case DiplomatiqAuthenticationScheme.AuthenticationSessionSignatureV1:
                return this.authenticationSessionSignatureV1(authenticationScheme, url, request);

            case DiplomatiqAuthenticationScheme.DeviceSignatureV1:
                return this.deviceSignatureV1(authenticationScheme, url, request);

            case DiplomatiqAuthenticationScheme.SessionSignatureV1:
                return this.sessionSignatureV1(authenticationScheme, url, request);
        }
    }

    private unauthenticated(_url: string, request: RequestInit): void {
        this.baseHeadersProviderService.provideHeaders(request);
    }

    private async authenticationSessionSignatureV1(
        authenticationScheme: DiplomatiqAuthenticationScheme,
        url: string,
        request: RequestInit,
    ): Promise<void> {
        const headers = this.baseHeadersProviderService.provideHeaders(request);

        headers['AuthenticationSessionId'] = await this.deviceContainerService.getAuthenticationSessionId();

        const signedHeaderNames: string[] = ['AuthenticationSessionId', 'ClientId', 'Instant', 'SignedHeaders'];
        headers['SignedHeaders'] = Array.from(signedHeaderNames)
            .map((h: string): string => h.toLowerCase())
            .join(';');

        const requestSignatureBase64 = await this.getRequestSignatureBase64(
            authenticationScheme,
            url,
            request,
            signedHeaderNames,
        );

        headers['Authorization'] = `${authenticationScheme} ${requestSignatureBase64}`;
    }

    private async deviceSignatureV1(
        authenticationScheme: DiplomatiqAuthenticationScheme,
        url: string,
        request: RequestInit,
    ): Promise<void> {
        const headers = this.baseHeadersProviderService.provideHeaders(request);

        headers['DeviceId'] = await this.deviceContainerService.getDeviceId();

        const signedHeaderNames: string[] = ['ClientId', 'DeviceId', 'Instant', 'SignedHeaders'];
        headers['SignedHeaders'] = Array.from(signedHeaderNames)
            .map((h: string): string => h.toLowerCase())
            .join(';');

        const requestSignatureBase64 = await this.getRequestSignatureBase64(
            authenticationScheme,
            url,
            request,
            signedHeaderNames,
        );

        headers['Authorization'] = `${authenticationScheme} ${requestSignatureBase64}`;
    }

    private async sessionSignatureV1(
        authenticationScheme: DiplomatiqAuthenticationScheme,
        url: string,
        request: RequestInit,
    ): Promise<void> {
        const headers = this.baseHeadersProviderService.provideHeaders(request);

        headers['DeviceId'] = await this.deviceContainerService.getDeviceId();
        headers['SessionId'] = await this.deviceContainerService.getSessionId();

        const signedHeaderNames: string[] = ['ClientId', 'DeviceId', 'Instant', 'SessionId', 'SignedHeaders'];
        headers['SignedHeaders'] = Array.from(signedHeaderNames)
            .map((h: string): string => h.toLowerCase())
            .join(';');

        const requestSignatureBase64 = await this.getRequestSignatureBase64(
            authenticationScheme,
            url,
            request,
            signedHeaderNames,
        );

        headers['Authorization'] = `${authenticationScheme} ${requestSignatureBase64}`;
    }

    private getHeaders(request: RequestInit): HTTPHeaders {
        if (request.headers === undefined) {
            request.headers = {};
        }
        return request.headers as HTTPHeaders;
    }

    private async getRequestSignatureBase64(
        authenticationScheme: DiplomatiqAuthenticationScheme,
        url: string,
        request: RequestInit,
        signedHeaderNames: string[],
    ): Promise<string> {
        const parsedUrl = new URL(url);
        const uri = parsedUrl.pathname;
        const queryString = parsedUrl.search.replace(/^\?/u, '');

        const headers = this.getHeaders(request);
        const signedHeaders = signedHeaderNames
            .map((headerName: string): string => `${headerName.toLowerCase()}:${headers[headerName]}`)
            .join('\n');

        const payloadString = request.body !== undefined ? (request.body as string) : '';
        const payloadBytes = this.stringConverter.encodeToBytes(payloadString);
        const payloadSha256 = await this.cryptoService.sha256(payloadBytes);
        const payloadSha256Base64 = this.binaryConverter.encodeToBase64(payloadSha256);

        const canonicalRequestString = [request.method, uri, queryString, signedHeaders, payloadSha256Base64].join(
            '\n',
        );
        const canonicalRequestBytes = this.stringConverter.encodeToBytes(canonicalRequestString);
        const canonicalRequestSha256 = await this.cryptoService.sha256(canonicalRequestBytes);
        const canonicalRequestSha256Base64 = this.binaryConverter.encodeToBase64(canonicalRequestSha256);

        const toSignString = `${authenticationScheme} ${canonicalRequestSha256Base64}`;
        const toSignBytes = this.stringConverter.encodeToBytes(toSignString);

        let signingKey: Uint8Array;
        switch (authenticationScheme) {
            case DiplomatiqAuthenticationScheme.AuthenticationSessionSignatureV1:
                signingKey = await this.deviceContainerService.getAuthenticationSessionKey();
                break;

            case DiplomatiqAuthenticationScheme.DeviceSignatureV1:
            case DiplomatiqAuthenticationScheme.SessionSignatureV1:
                signingKey = await this.deviceContainerService.getDeviceKey();
                break;

            default:
                throw new Error('AssertError: no signature needed for request');
        }

        const signatureBytes = await this.cryptoService.hmacSha256(toSignBytes, signingKey);
        const signatureBase64 = this.binaryConverter.encodeToBase64(signatureBytes);

        return signatureBase64;
    }
}
