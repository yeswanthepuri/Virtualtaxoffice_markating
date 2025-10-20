import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { PricingComponent } from './components/pricing/pricing.component';
import { PartnersComponent } from './components/partners/partners.component';
import { PublicRegisterComponent } from './components/public-register/public-register.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard.component';
import { ResourcesComponent } from './components/resources/resources.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'pricing', component: PricingComponent },
  { path: 'partners', component: PartnersComponent },
  { path: 'resources', component: ResourcesComponent },
  { path: 'register', component: PublicRegisterComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
