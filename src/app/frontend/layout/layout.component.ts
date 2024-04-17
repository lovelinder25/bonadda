import { Component, OnInit } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { ProductService } from '../api/product.service';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';
register();

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
 
})
export class LayoutComponent implements OnInit {

  constructor(private Api:ProductService,
    private router: Router){

  }
  loginAcc:boolean=false
  ngOnInit(): void {

    if (localStorage.getItem('user')) {
      let UserStore = localStorage.getItem('user');
      let UserData = UserStore && JSON.parse(UserStore);
      var bytes = JSON.parse(CryptoJS.AES.decrypt(UserData.reFreshToken, 'hiddenKey').toString(CryptoJS.enc.Utf8));
    
      this.loginAcc = true
    } else {
      this.loginAcc = false

    }

    console.log(this.loginAcc)
  }


  redirect(){
    if (localStorage.getItem('user')) {
      let UserStore = localStorage.getItem('user');
      let UserData = UserStore && JSON.parse(UserStore);
      var bytes = JSON.parse(CryptoJS.AES.decrypt(UserData.reFreshToken, 'hiddenKey').toString(CryptoJS.enc.Utf8));
      this.loginAcc = true
    } else {
      this.loginAcc = false

    }
    if (!this.loginAcc){
      this.router.navigate(['login']);
      console.log(this.loginAcc)
    } else{
      this.router.navigate(['Account']);
      console.log(this.loginAcc)

    }
  }
  cartShow:boolean = false
  isOpened: boolean = false;
  CartOpened: boolean = false;

  cartToggle(){
    this.CartOpened = !this.CartOpened;
  }
  toggle() {
    this.isOpened = !this.isOpened;
  }


  logout(){


    let PermissionsLogout = confirm("Are u want to logout");
    if (PermissionsLogout == true) {
      if (localStorage.getItem('user')) {
        localStorage.removeItem('user')
        this.router.navigate(['login']);
      }
    } else {

      // do nothing
    }
  }


}
