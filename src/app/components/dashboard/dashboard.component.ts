import { Component, OnInit } from '@angular/core';
import { faPlusSquare } from '@fortawesome/free-regular-svg-icons';
import { SessionService } from '../../services/session.service';

@Component({
    selector: 'diplomatiq-frontend-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    public readonly faPlusSquare = faPlusSquare;

    public emailAddress: string;

    public constructor(private readonly sessionService: SessionService) {}

    public async ngOnInit(): Promise<void> {
        const { emailAddress } = await this.sessionService.getUserIdentity();
        this.emailAddress = emailAddress;
    }
}
