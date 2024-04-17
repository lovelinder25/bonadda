import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductService } from '../frontend/api/product.service';
// import { ProductService } from './frontend/api/product.service';

Injectable({
  providedIn: 'root'
})
export const adminAuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {

    // return true;
  const authService = inject(ProductService);

  if (localStorage.getItem('uD1XOyRKsw85ZGm4Sr') && authService.isAdminLoggedIn) {
    return true;
  } else {
    return false;
  }


};

