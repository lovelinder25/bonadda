import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../api/product.service';
import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  constructor(
    private LoginApi: ProductService
  ) { }
  loginUserId: any
  ngOnInit(): void {

    this.getUserFromLocal()
    console.log(this.loginUserId)
  }


  
  getUserFromLocal() {
    if (localStorage.getItem('user')) {
      let UserStore = localStorage.getItem('user');
      let UserData = UserStore && JSON.parse(UserStore);
      var bytes = JSON.parse(CryptoJS.AES.decrypt(UserData.reFreshToken, 'hiddenKey').toString(CryptoJS.enc.Utf8));
      this.loginUserId = bytes.mobile
    }
  }
  LoginForm = new FormGroup({
    'mobile': new FormControl('', [Validators.required, Validators.pattern('[6-9]\\d{9}')]),
  })


  otpForm = new FormGroup({
    'otp': new FormControl('', [Validators.required]),
  })
  otp: any
  getData: any

  getValue() {

    this.LoginApi.getOtp(this.LoginForm.value).subscribe((res: any) => {
      console.log(res)
      this.otp = res.body.otp
      this.getData = res.body
    })
  }

  getValueOtp() {

    let obj = {
      ...this.otpForm.value,
      mobile: this.getData.Mobile,
      ActiveUser: this.getData.user
    }
    this.LoginApi.VerifyOtp(obj)
    this.getUserFromLocal()
  }

}