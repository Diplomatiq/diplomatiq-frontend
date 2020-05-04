import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { ValidateEmailAddressComponent } from '../components/validate-email-address/validate-email-address.component';

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'validate-email-address', component: ValidateEmailAddressComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
