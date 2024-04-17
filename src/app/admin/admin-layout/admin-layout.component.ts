import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ProductService } from 'src/app/frontend/api/product.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent implements OnInit{
  constructor(private api: ProductService, private router: Router){}
  hideNav:boolean=true
  ngOnInit(): void {
    
    this.router.events
    .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
    .subscribe((ev: NavigationEnd) => {
      let url = ev.url;
      if(url == '/Admin/admin-login'){
        this.hideNav = false
      }else{
        this.hideNav = true
      }
    });
    if(this.router.url == '/Admin/admin-login'){
      this.hideNav = false
    } else{
      this.hideNav = true
    }
  }
  
  logout(){
    this.api.Adminlogout()
  }
}
