import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class LoginService {
    public async login(emailAddress: string, password: string): Promise<void> {}
}
