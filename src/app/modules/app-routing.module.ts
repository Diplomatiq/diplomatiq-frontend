import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { LoginComponent } from '../components/login/login.component';
import { MfaComponent } from '../components/mfa/mfa.component';
import { SettingsComponent } from '../components/settings/settings.component';
import { SignupComponent } from '../components/signup/signup.component';
import { ValidateEmailAddressComponent } from '../components/validate-email-address/validate-email-address.component';
import { ValidateYourEmailComponent } from '../components/validate-your-email/validate-your-email.component';
import { LoggedInGuard } from '../guards/logged-in.guard';
import { NotLoggedInGuard } from '../guards/not-logged-in.guard';

const routes: Routes = [
    { path: 'signup', component: SignupComponent, canActivate: [NotLoggedInGuard] },
    { path: 'login', component: LoginComponent, canActivate: [NotLoggedInGuard] },
    { path: 'mfa', component: MfaComponent, canActivate: [NotLoggedInGuard] },
    { path: 'validate-your-email', component: ValidateYourEmailComponent, canActivate: [NotLoggedInGuard] },
    { path: 'validate-email-address', component: ValidateEmailAddressComponent, canActivate: [NotLoggedInGuard] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [LoggedInGuard] },
    { path: 'settings', component: SettingsComponent, canActivate: [LoggedInGuard] },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
