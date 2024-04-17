import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../api/product.service';
import * as CryptoJS from 'crypto-js';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order-view',
  templateUrl: './order-view.component.html',
})
export class OrderViewComponent implements OnInit {

  constructor(private api: ProductService, private router: Router,private ActiveRoute: ActivatedRoute,) { }

  
  Usermobile: any
  user_id: any
  addressFind: any
  orderinfo: any
  my_orders:any
  userMobile:any
  OrderTax:any
  GST_in_INR:any
  subTotal:any
  order_detail:any
  delivery_charges:any
  DiscountAmount:any
  GrandTotal:any
  ngOnInit(): void {




    // console.log(Math.floor(1000 + Math.random() * 900000))

// this.userMobile = this.ActiveRoute.snapshot.params['id']
    if (localStorage.getItem('user')) {
      let UserStore = localStorage.getItem('user');
      let UserData = UserStore && JSON.parse(UserStore);
      var bytes = JSON.parse(CryptoJS.AES.decrypt(UserData.reFreshToken, 'hiddenKey').toString(CryptoJS.enc.Utf8));
      this.Usermobile = bytes.mobile
    }
    this.api.getSingleOrder(this.ActiveRoute.snapshot.params['id']).subscribe((res: any) => {
      // this.api.getSingleOrder(this.userMobile).subscribe((res: any) => {
      console.log('this.userMobile', res.body)

      // let obj ={
      //   order_items: res.body[0].order_items 
      // }
      // JSON.parse(res.body[0].customer)

      res.body.forEach((element:any) => {
    
        element.order_items = JSON.parse(element.order_items),
          element.order_detail = JSON.parse(element.order_detail),

          element.date = element.order_detail.details.created_on,
          element.total = element.order_detail.details.total,
          element.customer = JSON.parse(element.customer)
        this.OrderTax = JSON.parse(element.tax)
        this.order_detail = element.order_detail
      });
      console.log('sdsd', this.OrderTax)
        // for(let o of res.body){
        //   console.log(o.order_items)
        //   // console.log(JSON.parse(o.order_items))
        //   o.order_items = JSON.parse(o.order_items),
        //   o.order_detail =  JSON.parse(o.order_detail),
        //   o.date = o.order_detail.details.created_on,
        //   o.total = o.order_detail.details.total,
        //   o.customer = JSON.parse(o.customer)
        //   this.OrderTax = JSON.parse(o.tax)
        //   this.order_detail = o.order_detail
          
        // }
        
        console.log(res.body)
    
    this.my_orders = res.body

this.delivery_charges = this.order_detail.details.delivery_charges

this.DiscountAmount = this.order_detail.details.discount_total;
this.GrandTotal = this.order_detail.details.total
// console.log(this.order_detail.details.discount_total)
// for(let i of this.my_orders){

//   this.subTotal = i.order_items.reduce(function (acc: any, item: any) {
//     return acc + item.final_price;
//   }, 0);

//   console.log(this.subTotal )
// }
this.my_orders.forEach((item: any) => {
  console.log('item', item.order_items.final_price)
  // for(let orderItm of item.order_items){
  //   console.log(orderItm.final_price)
  // }
  this.subTotal = item.order_items.reduce(function (acc: any, item: any) {
    console.log(item.final_price)
    return acc + parseFloat(item.final_price);
  }, 0);
});

      console.log(this.subTotal)


for (let o of this.OrderTax) {
  // console.log('dsdsdsdsdsd',o)
this.GST_in_INR = (o.tax * parseInt(this.subTotal)) / 100;

// this.GrandTotal =
//   parseInt(this.subTotal) -
//   parseInt(this.discount_total) +
//   parseInt(this.GST_in_INR) +
//   parseInt(this.dataSend.orderinfo.OrderInfo.Order.details.delivery_charges);
}
// console.log(this.my_orders)
   
    })

        




    
  


  }

















}
