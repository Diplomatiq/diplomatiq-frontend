import { SRPRoutines } from 'tssrp6a';
import { HashWordArray, stringToWordArray } from 'tssrp6a/dist/utils';

export class Srp6aRoutines extends SRPRoutines {
    public computeIdentityHash(identity: string, password: string): HashWordArray {
        return this.hash(stringToWordArray(`${identity}:${password}`));
    }
}
