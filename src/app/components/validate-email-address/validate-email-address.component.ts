import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'diplomatiq-frontend-validate-email-address',
    templateUrl: './validate-email-address.component.html',
})
export class ValidateEmailAddressComponent implements OnInit {
    public constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly apiService: ApiService,
        private readonly notificationService: NotificationService,
        private readonly router: Router,
    ) {}

    public async ngOnInit(): Promise<void> {
        try {
            const emailValidationKey = this.activatedRoute.snapshot.queryParamMap.get('email-validation-key');
            await this.apiService.unauthenticatedMethodsApi.validateEmailAddressV1({
                validateEmailAddressV1Request: {
                    emailValidationKey,
                },
            });
            this.notificationService.success('Email successfully validated. You may log in.');
        } catch (ex) {
            this.notificationService.danger('An error happened. Please try again later.');
        } finally {
            await this.router.navigateByUrl('login');
        }
    }
}
