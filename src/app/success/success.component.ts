import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as CryptoJS from 'crypto-js';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ProductService } from '../frontend/api/product.service';
@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',

})
export class SuccessComponent implements OnInit {
  OrderTax: any;
  newAddress: boolean = false;
  restaurants_lat: any;
  restaurants_long: any;
  restaurants_city: any;
  paymentDetails: any;

  urlSafe: SafeResourceUrl | undefined;

  constructor(
    private api: ProductService,
    private router: Router,
    public sanitizer: DomSanitizer
  ) {

  }
  dbdata:any
  __tax:any
  orderPayload:any
  msg: any
  ngOnInit(): void {
    let d: any = localStorage.getItem('review_order');
    let d2 = JSON.parse(d)
   
    console.log(d2.orderinfo.OrderInfo.Order)

    let data: any = localStorage.getItem('db_order')
    this.dbdata = JSON.parse(data)

    // this.dbdata.restID = JSON.parse(this.dbdata.restID)
    this.dbdata.payment_status ='success'

    console.log(this.dbdata)

    this.__tax = sessionStorage.getItem('taxes');

    
    this.orderPayload = {
      clientorderID: d2.orderinfo.OrderInfo.Order.details.orderID,
      restID: localStorage.getItem('restID'),
      order_detail: d2.orderinfo.OrderInfo.Order,
      order_items: d2.orderinfo.OrderInfo.OrderItem.details,
      userMobile: d2.orderinfo.OrderInfo.Customer.details.phone,
      customer: d2.orderinfo.OrderInfo.Customer.details,
      tax: JSON.parse(this.__tax),
      payment_status: 'success'
    };

    

    this.api.oredrsave(d2).subscribe((res: any) => {
      if ((res.body.success = '1')) {
        this.msg = `
          <p> Message : ${res.body.message} </p>
          <p> clientOrderID : ${res.body.clientOrderID} </p>
          <p>Payment: Success </p>
        `;
        this.saveOrder()
        sessionStorage.removeItem('OrderItem');
        sessionStorage.removeItem('taxes');
        sessionStorage.removeItem('discount');
      }
    });


  }


  goto(){
    this.router.navigate(['Account']);
  }
 
  saveOrder() {
   this.api.saveOrder(this.orderPayload).subscribe((orderRes: any) => {
     if (orderRes.body.success == 1) {
      //  this.router.navigate(['Account']);
     }
   });
  }
}
