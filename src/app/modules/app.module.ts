import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '../components/app/app.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { LoginComponent } from '../components/login/login.component';
import { MfaComponent } from '../components/mfa/mfa.component';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { NotificationsComponent } from '../components/notification/notifications.component';
import { SettingsComponent } from '../components/settings/settings.component';
import { SignupComponent } from '../components/signup/signup.component';
import { ValidateEmailAddressComponent } from '../components/validate-email-address/validate-email-address.component';
import { ValidateYourEmailComponent } from '../components/validate-your-email/validate-your-email.component';
import { AppInitializerService } from '../services/appInitializer.service';
import { AppRoutingModule } from './app-routing.module';

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
    ],
    imports: [BrowserModule, AppRoutingModule, FormsModule, NgbModule],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializerFactory,
            deps: [AppInitializerService],
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
