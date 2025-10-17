import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthInterceptor } from './interceptors/auth.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { PricingComponent } from './components/pricing/pricing.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard.component';
import { AdminLoginComponent } from './components/admin/admin-login.component';
import { UserRegisterComponent } from './components/admin/user-register.component';
import { RoleMaintenanceComponent } from './components/admin/role-maintenance.component';
import { PolicyMaintenanceComponent } from './components/admin/policy-maintenance.component';
import { PartnerManagementComponent } from './components/admin/partner-management.component';
import { ArticleManagementComponent } from './components/admin/article-management.component';
import { LocationMaintenanceComponent } from './components/admin/location-maintenance.component';
import { PartnersComponent } from './components/partners/partners.component';
import { PublicRegisterComponent } from './components/public-register/public-register.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    AboutComponent,
    PricingComponent,
    AdminDashboardComponent,
    AdminLoginComponent,
    UserRegisterComponent,
    RoleMaintenanceComponent,
    PolicyMaintenanceComponent,
    PartnerManagementComponent,
    ArticleManagementComponent,
    LocationMaintenanceComponent,
    PartnersComponent,
    PublicRegisterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }