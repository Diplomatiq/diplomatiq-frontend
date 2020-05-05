import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'diplomatiq-frontend-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
    public constructor(private readonly router: Router) {}

    public async navigateToRoot(): Promise<void> {
        await this.router.navigateByUrl('');
    }
}
