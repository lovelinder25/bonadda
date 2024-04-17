import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductService } from './frontend/api/product.service';


Injectable({
  providedIn: 'root'
})

export const userAuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {


  const authService = inject(ProductService);

  if (localStorage.getItem('user') && authService.isUserLoggedIn) {
    return true;
  } else {
    return false;
  }


};
