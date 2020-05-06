import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { LoginService } from '../services/login.service';

@Injectable({
    providedIn: 'root',
})
export class NotLoggedInGuard implements CanActivate {
    public constructor(private readonly loginService: LoginService, private readonly router: Router) {}

    public async canActivate(): Promise<boolean | UrlTree> {
        const isLoggedIn = await this.loginService.isLoggedIn();
        return isLoggedIn ? this.router.parseUrl('dashboard') : true;
    }
}
