import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '../components/app/app.component';
import { LoginComponent } from '../components/login/login.component';
import { MfaComponent } from '../components/mfa/mfa.component';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { NotificationsComponent } from '../components/notification/notifications.component';
import { SignupComponent } from '../components/signup/signup.component';
import { ValidateEmailAddressComponent } from '../components/validate-email-address/validate-email-address.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        LoginComponent,
        NotificationsComponent,
        ValidateEmailAddressComponent,
        SignupComponent,
        MfaComponent,
    ],
    imports: [BrowserModule, AppRoutingModule, FormsModule, NgbModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
