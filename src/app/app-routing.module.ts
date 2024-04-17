import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './frontend/layout/layout.component';
import { HomepageComponent } from './frontend/homepage/homepage.component';
import { MenuComponent } from './frontend/menu/menu.component';
import { RetailserviceComponent } from './frontend/retailservice/retailservice.component';
import { CorporateserviceComponent } from './frontend/corporateservice/corporateservice.component';
import { CateringserviceComponent } from './frontend/cateringservice/cateringservice.component';
import { ContactComponent } from './frontend/contact/contact.component';
import { TableBookComponent } from './frontend/table-book/table-book.component';
import { AccountComponent } from './frontend/account/account.component';
import { CheckoutComponent } from './frontend/checkout/checkout.component';
import { LoginComponent } from './frontend/login/login.component';
import { userAuthGuard } from './auth.guard';
import { LocationsComponent } from './frontend/locations/locations.component';
import { OrderViewComponent } from './frontend/order-view/order-view.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { BookedTablesComponent } from './admin/booked-tables/booked-tables.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { adminAuthGuard } from './admin/admin-auth.guard';
import { RestaurantComponent } from './admin/restaurant/restaurant.component';
import { SuccessComponent } from './success/success.component';
import { FailedComponent } from './failed/failed.component';
import { AppLayoutComponent } from './frontend/app-layout/app-layout.component';
import { AppLocationComponent } from './frontend/app-location/app-location.component';
import { PreloginComponent } from './frontend/prelogin/prelogin.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'Locations' },
  { path: 'Locations', component: LocationsComponent },
  {
    path: '', component: LayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'Home' },


      { path: 'Home', component: HomepageComponent },
      { path: 'Menu', component: MenuComponent },
      { path: 'pre-login', component: PreloginComponent },
      { path: 'Retail-service', component: RetailserviceComponent },
      { path: 'Corporate-service', component: CorporateserviceComponent },
      { path: 'Catering-service', component: CateringserviceComponent },
      { path: 'Contact', component: ContactComponent },
      { path: 'Book-table', component: TableBookComponent },
      { path: 'Account', component: AccountComponent, canActivate: [userAuthGuard] },
      { path: 'checkout', component: CheckoutComponent, canActivate: [userAuthGuard] },
      { path: 'view-order/:id', component: OrderViewComponent, canActivate: [userAuthGuard] },
      { path: 'success', component: SuccessComponent, canActivate: [userAuthGuard] },
      { path: 'failed', component: FailedComponent, canActivate: [userAuthGuard] },
      { path: 'login', component: LoginComponent },
    ]
  },

  {
    path: 'Admin', component: AdminLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'Restaurants' },


      { path: 'admin-login', component: AdminLoginComponent },
      { path: 'Book-tables', component: BookedTablesComponent, canActivate: [adminAuthGuard] },
      { path: 'Restaurants', component: RestaurantComponent, canActivate: [adminAuthGuard] },

    ]
  },

  { path: 'app-location', component: AppLocationComponent },
  {
    path: 'app', component: AppLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'Menu' },
      { path: 'Home', component: HomepageComponent },
      { path: 'Menu', component: MenuComponent },
      { path: 'Book-table', component: TableBookComponent },
      { path: 'Account', component: AccountComponent, canActivate: [userAuthGuard] },
      { path: 'checkout', component: CheckoutComponent, canActivate: [userAuthGuard] },
      { path: 'view-order/:id', component: OrderViewComponent, canActivate: [userAuthGuard] },
      { path: 'success', component: SuccessComponent, canActivate: [userAuthGuard] },
      { path: 'failed', component: FailedComponent, canActivate: [userAuthGuard] },
      { path: 'login', component: LoginComponent },
    ]
  },
];



@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
