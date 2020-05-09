import { Component, Input } from '@angular/core';

@Component({
    selector: 'diplomatiq-frontend-component-wrapper',
    templateUrl: './component-wrapper.component.html',
    styleUrls: ['./component-wrapper.component.scss'],
})
export class ComponentWrapperComponent {
    @Input()
    public readonly title: string;
}
