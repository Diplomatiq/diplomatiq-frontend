import { Component, OnInit } from '@angular/core';
import { UserIdentityService } from '../../services/userIdentity.service';

@Component({
    selector: 'diplomatiq-frontend-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    public emailAddress: string;

    public constructor(private readonly userIdentityService: UserIdentityService) {}

    public async ngOnInit(): Promise<void> {
        const { emailAddress } = await this.userIdentityService.getUserIdentity();
        this.emailAddress = emailAddress;
    }
}
