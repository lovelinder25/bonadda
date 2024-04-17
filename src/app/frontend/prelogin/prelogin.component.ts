import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../api/product.service';

@Component({
  selector: 'app-prelogin',
  templateUrl: './prelogin.component.html',
})
export class PreloginComponent implements OnInit {
  
  constructor(private ActiveRoute: ActivatedRoute, private API :ProductService) { }
  
  ngOnInit(): void {

    console.log(this.ActiveRoute.snapshot.queryParams)
    this.API.MobileLogin(this.ActiveRoute.snapshot.queryParams);


  }




}
