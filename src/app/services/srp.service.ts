import { Injectable } from '@angular/core';
import { BigInteger } from 'jsbn';
import { SRPClientSession, SRPConfig, SRPParameters } from 'tssrp6a';
import { createVerifier } from 'tssrp6a/dist/utils';
import { gHex, nHex } from '../constants/srpConstants';
import { Srp6aRoutines } from '../utils/srp6aroutines';

@Injectable({
    providedIn: 'root',
})
export class SrpService {
    public createVerifier(emailAddress: string, passwordScryptHex: string, saltHex: string): string {
        const config = this.getSrpConfig();
        const saltBigInteger = new BigInteger(saltHex, 16);
        const verifierBigInteger = createVerifier(config, emailAddress, saltBigInteger, passwordScryptHex);
        return verifierBigInteger.toString(16);
    }

    public getSrpClient(): SRPClientSession {
        const config = this.getSrpConfig();
        return new SRPClientSession(config);
    }

    private getSrpConfig(): SRPConfig {
        const parameters = new SRPParameters(new BigInteger(nHex, 16), new BigInteger(gHex, 16), 'SHA256');
        const routinesFactory = (p: SRPParameters): Srp6aRoutines => new Srp6aRoutines(p);
        return new SRPConfig(parameters, routinesFactory);
    }
}
