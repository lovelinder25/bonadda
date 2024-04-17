import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddonPipe } from './addon.pipe';
import { SubcatPipe } from './frontend/subcat.pipe';
import { LocationsComponent } from './frontend/locations/locations.component';
import { OrderViewComponent } from './frontend/order-view/order-view.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { BookedTablesComponent } from './admin/booked-tables/booked-tables.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { RestaurantComponent } from './admin/restaurant/restaurant.component';
import { SuccessComponent } from './success/success.component';
import { FailedComponent } from './failed/failed.component';
import { AppLayoutComponent } from './frontend/app-layout/app-layout.component';
import { AppLocationComponent } from './frontend/app-location/app-location.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { PreloginComponent } from './frontend/prelogin/prelogin.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HomepageComponent,
    MenuComponent,
    RetailserviceComponent,
    CorporateserviceComponent,
    CateringserviceComponent,
    ContactComponent,
    TableBookComponent,
    AccountComponent,
    CheckoutComponent,
    LoginComponent,
    AddonPipe,
    SubcatPipe,
    LocationsComponent,
    OrderViewComponent,
    BookedTablesComponent,
    AdminLayoutComponent,
    AdminLoginComponent,
    RestaurantComponent,
    SuccessComponent,
    FailedComponent,
    AppLayoutComponent,
    AppLocationComponent,
    PreloginComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatTableModule,
    MatExpansionModule,
    MatDialogModule
  ],
  providers: [
    // enableServerSideRendering(),
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    // { provide: HTTP_INTERCEPTORS, useClass: AdminInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
// function enableServerSideRendering(): import("@angular/core").Provider | import("@angular/core").EnvironmentProviders {
//   throw new Error('Function not implemented.');
// }

