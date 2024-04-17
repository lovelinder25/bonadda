import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ProductService } from 'src/app/frontend/api/product.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',

})
export class AdminLoginComponent implements OnInit{
  constructor(private api: ProductService,  private router: Router){}

  loading:boolean=false
  ngOnInit(): void {


  
this.api.reloadAdmin()

  }


  AdminLoginForm = new FormGroup({
    'username': new FormControl('', [Validators.required]),
    'password': new FormControl('', [Validators.required]),
  })



  getValue(){
    this.api.adminLogin(this.AdminLoginForm.value)
  }

}
