import { Component } from '@angular/core';
import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'diplomatiq-frontend',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    public constructor(ngbModalConfigService: NgbModalConfig) {
        ngbModalConfigService.backdrop = 'static';
        ngbModalConfigService.centered = true;
        ngbModalConfigService.keyboard = false;
    }
}
