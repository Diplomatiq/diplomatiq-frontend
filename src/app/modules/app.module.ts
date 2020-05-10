import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbDateAdapter, NgbDateNativeAdapter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '../components/app/app.component';
import { ComponentWrapperComponent } from '../components/component-wrapper/component-wrapper.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { LoginComponent } from '../components/login/login.component';
import { LogoutComponent } from '../components/logout/logout.component';
import { MfaComponent } from '../components/mfa/mfa.component';
import { ChangePasswordModalComponent } from '../components/modals/change-password-modal/change-password-modal.component';
import { DeleteAccountModalComponent } from '../components/modals/delete-account-modal/delete-account-modal.component';
import { ForgotPasswordModalComponent } from '../components/modals/forgot-password-modal/forgot-password-modal.component';
import { MfaRequestModalComponent } from '../components/modals/mfa-request-modal/mfa-request-modal.component';
import { OrganizeConferenceModalComponent } from '../components/modals/organize-conference-modal/organize-conference-modal.component';
import { PasswordRequestModalComponent } from '../components/modals/password-request-modal/password-request-modal.component';
import { ResetPasswordModalComponent } from '../components/modals/reset-password-modal/reset-password-modal.component';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { NotificationsComponent } from '../components/notification/notifications.component';
import { SettingsComponent } from '../components/settings/settings.component';
import { SignupComponent } from '../components/signup/signup.component';
import { ValidateEmailAddressComponent } from '../components/validate-email-address/validate-email-address.component';
import { ValidateYourEmailComponent } from '../components/validate-your-email/validate-your-email.component';
import { AppInitializerService } from '../services/app-initializer.service';
import { AppRoutingModule } from './app-routing.module';
import { AddCommitteeModalComponent } from '../components/modals/add-committee-modal/add-committee-modal.component';
import { CancelConferenceModalComponent } from '../components/modals/cancel-conference-modal/cancel-conference-modal.component';
import { CountryMatrixModalComponent } from '../components/modals/country-matrix-modal/country-matrix-modal.component';
import { ApplyConferenceModalComponent } from '../components/modals/apply-conference-modal/apply-conference-modal.component';
import { ExploreComponent } from '../explore/explore.component';

function appInitializerFactory(appInitializerService: AppInitializerService): () => Promise<void> {
    return async (): Promise<void> => {
        await appInitializerService.initialize();
    };
}

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        LoginComponent,
        NotificationsComponent,
        ValidateEmailAddressComponent,
        SignupComponent,
        MfaComponent,
        DashboardComponent,
        SettingsComponent,
        ValidateYourEmailComponent,
        DeleteAccountModalComponent,
        PasswordRequestModalComponent,
        MfaRequestModalComponent,
        ChangePasswordModalComponent,
        LogoutComponent,
        ForgotPasswordModalComponent,
        ResetPasswordModalComponent,
        ComponentWrapperComponent,
        OrganizeConferenceModalComponent,
        AddCommitteeModalComponent,
        CancelConferenceModalComponent,
        CountryMatrixModalComponent,
        ApplyConferenceModalComponent,
        ExploreComponent,
    ],
    imports: [BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule, NgbModule, FontAwesomeModule],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializerFactory,
            deps: [AppInitializerService],
            multi: true,
        },
        { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
