import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../api/product.service';
import * as CryptoJS from 'crypto-js';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
})

export class CheckoutComponent implements OnInit {
  OrderTax: any;
  newAddress: boolean = false;
  restaurants_lat: any;
  restaurants_long: any;
  restaurants_city: any;
  paymentDetails: any;
  packing_charges: any
  urlSafe: SafeResourceUrl | undefined;

  subTotal: any;

  delivery_charges: any;
  todayDate = new Date();
  constructor(
    private api: ProductService,
    private router: Router,
    public sanitizer: DomSanitizer
  ) {
    this.getLatLog();

    console.log(this.todayDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: "2-digit", hour12: false }));
  }



  GST_in_INR: any;
  fulldate = `${this.todayDate.getFullYear()}-${this.todayDate.getMonth()}-${this.todayDate.getDate()} ${this.todayDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: "2-digit", hour12: false })}`;
  fullTime = `${this.todayDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: "2-digit", hour12: false })}`;


  _restID_: any;
  dataSend: any = {
    app_key: '2xmbdf5e01pjusiqokcw64nh38r9ytgv',
    app_secret: '617cde9e9fffa154ca8515f3bf692f79803261ab',
    access_token: 'ba6f62f4121aa56b042f605a45bd91f45606c8bf',
    orderinfo: {
      OrderInfo: {
        Restaurant: {
          details: {
            res_name: '',
            address: '',
            contact_information: '',
            restID: '',
          },
        },
        Customer: {
          details: {},
        },
        Order: {
          details: {
            orderID: Math.floor(
              new Date().valueOf() * Math.random()
            ).toString(),
            preorder_date: this.fulldate.toString(),
            preorder_time: this.fullTime.toString(),
            service_charge: '',
            sc_tax_amount: '',
            delivery_charges: '',
            dc_tax_amount: '',
            dc_gst_details: [
              {
                gst_liable: 'vendor',
                amount: '',
              },
              {
                gst_liable: 'restaurant',
                amount: '', //5%
              },
            ],
            packing_charges: '',
            pc_tax_amount: '',
            pc_gst_details: [
              {
                gst_liable: 'vendor',
                amount: '',
              },
              {
                gst_liable: 'restaurant',
                amount: '',
              },
            ],
            order_type: 'H',
            ondc_bap: 'BonnAdda',
            advanced_order: 'N',
            payment_type: '',
            table_no: '',
            no_of_persons: '',
            discount_total: '',
            tax_total: '',
            discount_type: 'F',
            total: '',
            description: '',
            created_on: this.fulldate.toString(),
            enable_delivery: '1',
            min_prep_time: '',
            callback_url: 'https://bongateaubakeryncafe.in/orderCallback',
          }
        },
        OrderItem: {
          details: [],
        },
        Tax: {
          details: [],
        },
        // Discount: {
        //   details: [],
        // },
      },
      udid: '',
      device_type: 'Web',
    },
  };

  Usermobile: any;
  user_id: any;
  addressFind: any;
  Cartorderinfo: any;
  DiscountAmount: any;
  GrandTotal: any;
  discount_total: any;
  texARRAY: any = [];
  cartAdons: any
  discounttotal: any
  Tax_Total: any
  ngOnInit(): void {


    let Local_Restaurant: any = sessionStorage.getItem('Restaurant')
    let JSON_Local_Restaurant = JSON.parse(Local_Restaurant);
    this.dataSend.orderinfo.OrderInfo.Restaurant = JSON_Local_Restaurant
    // let res_id: any = localStorage.getItem('restID');
    // this._restID_ = JSON.parse(res_id);


    // this.dataSend.orderinfo.OrderInfo.Restaurant.details.restID = this._restID_;

    let taxes: any = sessionStorage.getItem('taxes');
    this.OrderTax = JSON.parse(taxes);

    let discount___: any = sessionStorage.getItem('discount');
    let discounts_details = JSON.parse(discount___);

    // this.dataSend.orderinfo.OrderInfo.Tax.details = [...this.OrderTax];
    // this.dataSend.orderinfo.OrderInfo.Discount.details = [...discounts_details];

    // this.DiscountAmount = this.dataSend.orderinfo.OrderInfo.Discount.details;

    // for (let dAm of this.DiscountAmount) {
    //   this.dataSend.orderinfo.OrderInfo.Order.details.discount_total = dAm.discount.toString();
    // }
    // this.delivery_charges =
    //   this.dataSend.orderinfo.OrderInfo.Order.details.delivery_charges;

    // this.dataSend.orderinfo.OrderInfo.Order.details.dc_tax_amount = ((this.delivery_charges * 5) / 100).toString()


    // this.dataSend.orderinfo.OrderInfo.Order.details.dc_gst_details[1].amount = ((this.delivery_charges * 5) / 100).toString()
    // console.log(this.dataSend.orderinfo.OrderInfo.Order.details.dc_gst_details[1].amount)
    // dc_gst_details: [
    //   {
    //     gst_liable: 'vendor',
    //     amount: '',
    //   },
    //   {
    //     gst_liable: 'restaurant',
    //     amount: '', //5%
    //   },
    // ],


    let itemsInCart_: any = sessionStorage.getItem('OrderItem');
    let JSONDATA = JSON.parse(itemsInCart_);
    for (let j of JSONDATA) {
      j.addon = ''
      delete j.addon
      delete j.love
      // delete j.gst_total_tax_amount
      delete j.test_price


      j.final_price = (j.final_price).toString()
      j.item_discount = (j.item_discount).toString()
      j.quantity = (j.quantity).toString()

      console.log('JSONDATA', j)
      this.dataSend.orderinfo.OrderInfo.OrderItem.details.push(j);
      // this.dataSend.orderinfo.OrderInfo.OrderItem.details=[j]
    }

    this.Cartorderinfo = this.dataSend.orderinfo.OrderInfo.OrderItem.details;


    for (let c of this.Cartorderinfo) {
      // this.cartAdons = c.AddonItem.details
      // console.log(c.item_discount)
      c.gst_total_tax_amount = c.quantity * c.gst_total_tax_amount
      // discount_total
      this.discounttotal = this.Cartorderinfo.reduce(function (acc: any, item: any) {
        return acc + parseInt(item.item_discount);
      }, 0);


      if (!c.gst_total_tax_amount) {
        this.Tax_Total = '0'
      } else {
        this.Tax_Total = this.Cartorderinfo.reduce(function (acc: any, item: any) {
          return acc + parseInt(item.gst_total_tax_amount);
        }, 0);
      }


      this.dataSend.orderinfo.OrderInfo.Order.details.tax_total = (this.Tax_Total).toString()
      this.dataSend.orderinfo.OrderInfo.Order.details.discount_total = (this.discounttotal).toString()


    }



    console.log('cartAdons', this.dataSend.orderinfo.OrderInfo.OrderItem)

    this.subTotal = localStorage.getItem('subTotal')
    // this.Cartorderinfo.forEach((item: any) => {
    //   this.subTotal = this.Cartorderinfo.reduce(function (acc: any, item: any) {
    //     if (!item.addTotal) {

    //       return acc + item.final_price;
    //     } else {

    //       return acc + item.final_price + item.addTotal;
    //     }

    //     // return acc + item.final_price + item.addTotal;
    //   }, 0);
    // });

    if (localStorage.getItem('user')) {
      let UserStore = localStorage.getItem('user');
      let UserData = UserStore && JSON.parse(UserStore);
      var bytes = JSON.parse(
        CryptoJS.AES.decrypt(UserData.reFreshToken, 'hiddenKey').toString(
          CryptoJS.enc.Utf8
        )
      );
      this.Usermobile = bytes.mobile;
    }

    this.getAddressFromDB();

    // this.getUserAddress()

    if (!navigator.geolocation) {
      // console.log('Location not supported');
    }

    // this.getLatLog();

    // count dicount and GST
  }

  callTree() {
    let paymentDetails = {
      CustomerName: 'admin',
      email: 'admin@123.com',
      CustomerPhone: 9898989898,
      txnid:
        'TXN' + Math.floor(new Date().valueOf() * Math.random()).toString(),
      productinfo: 'Piza',
      amount: 1,
    };

    // this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(
    //   `https://cpeel.net/payubiz_php7/index.php?payment=${this.paymentDetails}`
    // );
    window.location.href =
      `https://bongateaubakeryncafe.in/payubiz_php7/index.php?` +
      JSON.stringify(paymentDetails);

    // this.router.navigateByUrl('https://cpeel.net/payubiz_php7/index.php');
  }

  addressSelectedStatus: any;
  getAddressFromDB() {
    this.api.getUserByMobile(this.Usermobile).subscribe((res: any) => {
      this.user_id = res[0].id;
      this.getUserAddress();
      let phone = res[0].mobile;
      this.api.getUserAddress(this.user_id).subscribe((res: any) => {
        this.addressFind = res;
        // console.log("addressFind", res)

        if (sessionStorage.getItem('address')) {
          this.addressSelectedStatus = true;
          let SessionAddress: any = sessionStorage.getItem('address');
          let SessionAddress_Pars = JSON.parse(SessionAddress);

          for (let a of this.addressFind) {
            // console.warn(a.id, SessionAddress_Pars.id)
            if (a.id == SessionAddress_Pars.id) {
              a.selected = true;
            }
          }

          this.dataSend.orderinfo.OrderInfo.Customer.details.email =
            SessionAddress_Pars.email;
          this.dataSend.orderinfo.OrderInfo.Customer.details.name =
            SessionAddress_Pars.name;
          this.dataSend.orderinfo.OrderInfo.Customer.details.address =
            SessionAddress_Pars.address;
          this.dataSend.orderinfo.OrderInfo.Customer.details.phone =
            SessionAddress_Pars.phone;

          let details = { ...this.addressFind };
          let Customer = {
            details,
          };
          let orderinfo = {
            Customer,
          };
        } else {
          this.addressSelectedStatus = false;
        }

      });
      this.CustomerForm.patchValue({
        phone: phone,
        user: this.user_id,
      });
    });
  }

  setAddress(a: any) {
    this.getAddressFromDB();
    // // console.log(a)
    this.dataSend.orderinfo.OrderInfo.Customer.details.email = a.email;
    this.dataSend.orderinfo.OrderInfo.Customer.details.name = a.name;
    this.dataSend.orderinfo.OrderInfo.Customer.details.address = a.address;
    this.dataSend.orderinfo.OrderInfo.Customer.details.phone = a.phone;

    sessionStorage.setItem('address', JSON.stringify(a));

    // // // console.log(this.dataSend)
  }


  Grand_TotalFun() {
    for (let o of this.OrderTax) {
      this.GST_in_INR = (o.tax * parseInt(this.subTotal)) / 100;
      o.tax_Inr = ((o.tax * parseInt(this.subTotal)) / 100).toString();

      let texARRAY = {
        id: o.taxid,
        title: o.taxname,
        type: o.taxtype,
        price: o.tax,
        tax: o.tax_Inr,
        restaurant_liable_amt: o.tax_Inr
      };
      this.texARRAY.push(texARRAY);
    }

    this.dataSend.orderinfo.OrderInfo.Tax.details = [...this.texARRAY];


    let _total = this.OrderTax.reduce(function (acc: any, item: any) {
      return acc + item.tax_Inr;
    }, 0);

    this.packing_charges = this.dataSend.orderinfo.OrderInfo.Order.details.packing_charges
    // // console.log('o.tax', _total)
    this.GrandTotal =
      parseInt(this.subTotal) + this.Tax_Total + parseInt(
        this.dataSend.orderinfo.OrderInfo.Order.details.delivery_charges
      )

    this.dataSend.orderinfo.OrderInfo.Order.details.total =
      this.GrandTotal.toString();
    // [discountTotal = [itemPriceTotal * discount]/100] this.dataSend.orderinfo.OrderInfo.Order.details.total.enable_delivery.
  }

  CustomerForm = new FormGroup<any>({
    user: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    latitude: new FormControl('', [Validators.required]),
    longitude: new FormControl('', [Validators.required]),
  });

  chkKM: any;
  getLatLog() {
    navigator.geolocation.getCurrentPosition((position) => {
      let restaurants: any = localStorage.getItem('restaurants');
      let restaurants_detail = JSON.parse(restaurants);

      // // console.log('restaurants_detail',restaurants_detail)
      this.restaurants_lat = Number(restaurants_detail.latitude);
      this.restaurants_long = Number(restaurants_detail.longitude);
      this.restaurants_city = restaurants_detail.city;

      (this.dataSend.orderinfo.OrderInfo.Customer.details.longitude =
        position.coords.longitude.toString()),
        (this.dataSend.orderinfo.OrderInfo.Customer.details.latitude =
          position.coords.latitude.toString()),
        // console.log(position.coords.latitude,   position.coords.longitude, this.restaurants_lat, this.restaurants_long)
        (this.chkKM = this.calcCrow(
          position.coords.latitude,
          position.coords.longitude,
          this.restaurants_lat,
          this.restaurants_long
          // 30.924972486802194, 75.85132610900216,
          //   30.864356562375107, 75.84257137882965
          // 31.658569374153995, 74.86359788465617 // amtsr
        ).toFixed(0));

      console.log(this.chkKM, 'km')

      // // console.log(this.dataSend.orderinfo.OrderInfo.Order.details.delivery_charges)

      if (this.chkKM <= 5) {
        // console.log("sdsds")
        this.dataSend.orderinfo.OrderInfo.Order.details.delivery_charges = '0';
        // this.dataSend.orderinfo.OrderInfo.Order.details.enable_delivery = '1';
      } else if (this.chkKM >= 5 && this.chkKM <= 10) {
        this.dataSend.orderinfo.OrderInfo.Order.details.delivery_charges = '80';
        // this.dataSend.orderinfo.OrderInfo.Order.details.enable_delivery = '1';
      } else if (this.chkKM >= 10 && this.chkKM <= 15) {
        this.dataSend.orderinfo.OrderInfo.Order.details.delivery_charges =
          '150';
      } else if (this.chkKM > 15) {
        this.dataSend.orderinfo.OrderInfo.Order.details.delivery_charges = '0';
      }

      // this.dataSend.orderinfo.OrderInfo.Order.details.delivery_charges = '80';

      this.delivery_charges = this.dataSend.orderinfo.OrderInfo.Order.details.delivery_charges;

      this.Grand_TotalFun();

      // if (this.delivery_charges == '0'){

      //   this.dataSend.orderinfo.OrderInfo.Order.details.dc_tax_amount = ''
      //   this.dataSend.orderinfo.OrderInfo.Order.details.dc_gst_details[1].amount = ''


      // } else{

      //   this.dataSend.orderinfo.OrderInfo.Order.details.dc_tax_amount = ((this.delivery_charges * 5) / 100).toString()
      //   this.dataSend.orderinfo.OrderInfo.Order.details.dc_gst_details[1].amount = ((this.delivery_charges * 5) / 100).toString()

      // }

      // this.delivery_charges = this.dataSend.orderinfo.OrderInfo.Order.details.delivery_charges;

      this.dataSend.orderinfo.OrderInfo.Order.details.dc_tax_amount = ((this.delivery_charges * 5) / 100).toString()
      this.dataSend.orderinfo.OrderInfo.Order.details.dc_gst_details[1].amount = ((this.delivery_charges * 5) / 100).toString()



      // this.dataSend.orderinfo.OrderInfo.Order.details.tax_total = (this.Tax_Total + this.dataSend.orderinfo.OrderInfo.Order.details.dc_tax_amount).toString()


      this.Tax_Total = this.Cartorderinfo.reduce(function (acc: any, item: any) {
        return acc + parseInt(item.gst_total_tax_amount);
      }, 0);

      let temp_Tax_Total = (parseFloat(this.Tax_Total) + parseFloat(this.dataSend.orderinfo.OrderInfo.Order.details.dc_tax_amount))

      this.dataSend.orderinfo.OrderInfo.Order.details.tax_total = temp_Tax_Total.toString()

      // this.dataSend.orderinfo.OrderInfo.Order.details.discount_total = (this.discounttotal).toString()

      this.Tax_Total = temp_Tax_Total
      // this.Tax_Total = this.dataSend.orderinfo.OrderInfo.Order.details.tax_total
      this.GrandTotal =
        parseInt(this.subTotal) + this.Tax_Total + parseInt(
          this.dataSend.orderinfo.OrderInfo.Order.details.delivery_charges
        ) //+ parseFloat(this.dataSend.orderinfo.OrderInfo.Order.details.dc_tax_amount)

      this.dataSend.orderinfo.OrderInfo.Order.details.total =
        this.GrandTotal.toString();

      this.CustomerForm.patchValue({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  }

  calcCrow(lat1: any, lon1: any, lat2: any, lon2: any) {
    var R = 6371; // km
    var dLat = this.toRad(lat2 - lat1);
    var dLon = this.toRad(lon2 - lon1);
    var lat1: any = this.toRad(lat1);
    var lat2: any = this.toRad(lat2);

    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;

    // // console.log(d.toFixed(0));
    return d;
  }

  toRad(Value: any) {
    return (Value * Math.PI) / 180;
  }

  getValue() {
    this.api.saveAddress(this.CustomerForm.value).subscribe((res: any) => {
      // // console.log(res)
      this.CustomerForm.reset();
      this.getUserAddress();
      (document.getElementById('close_') as HTMLFormElement).click();
      this.newAddress = false;
    });
  }

  getUserAddress() {
    this.api.getUserAddress(this.user_id).subscribe((res: any) => {
      this.addressFind = res;
      // // console.log('address', res);
    });
  }

  codStatus: boolean = false;
  onlineStatus: boolean = false;
  enableCOD(e: any) {
    this.dataSend.orderinfo.OrderInfo.Order.details.payment_type =
      e.value.toString();
    this.codStatus = true;
    this.onlineStatus = false;
  }
  enableONLINE(e: any) {
    this.dataSend.orderinfo.OrderInfo.Order.details.payment_type =
      e.value.toString();
    this.onlineStatus = true;
    this.codStatus = false;
  }


  OrderNote(e: any) {
    console.log(e)

    this.dataSend.orderinfo.OrderInfo.Order.details.description = e.target.value
  }
  DeliveryOff: boolean = false;
  msg: any;
  paymentSelctError: any;
  addressAlrt: boolean = false;

  saveOrder_to_pos() {

    for (let car of this.dataSend.orderinfo.OrderInfo.OrderItem.details) {
      console.log(car.gst_total_tax_amount)
      delete car.gst_total_tax_amount
    }
    let orderPayload: any = {
      clientorderID: this.dataSend.orderinfo.OrderInfo.Order.details.orderID,
      restID: localStorage.getItem('restID'),
      order_detail: this.dataSend.orderinfo.OrderInfo.Order,
      order_items: this.dataSend.orderinfo.OrderInfo.OrderItem.details,
      userMobile: this.dataSend.orderinfo.OrderInfo.Customer.details.phone,
      customer: this.dataSend.orderinfo.OrderInfo.Customer.details,
      tax: JSON.parse(this.__tax),
      payment_status: ''
    };

    console.log(this.dataSend)
    localStorage.setItem('db_order', JSON.stringify(orderPayload));

    localStorage.setItem('review_order', JSON.stringify(this.dataSend));


    if (!sessionStorage.getItem('address')) {
      this.addressAlrt = true;
    } else {
      if (this.dataSend.orderinfo.OrderInfo.Order.details.payment_type == '') {
        this.paymentSelctError = 'select payment type';
      } else if (this.chkKM < 15) { // testng
        if (this.onlineStatus === true) {
          this.payUButton2();
        } else if (this.codStatus === true) {
          console.warn(this.dataSend)
          this.api.oredrsave(this.dataSend).subscribe((res: any) => {
            this.msg = `
          <p> Message : ${res.body.message} </p>
          <p> clientOrderID : ${res.body.clientOrderID} </p>
        `;
            if ((res.body.success = '1')) {
              this.saveOrder();
              sessionStorage.removeItem('OrderItem');
              sessionStorage.removeItem('taxes');
              sessionStorage.removeItem('discount');
            }
          });
        }
      } else {
        this.DeliveryOff = true;
        // console.log('delivery OFF')
      }
    }
  }

  __tax: any = sessionStorage.getItem('taxes');
  saveOrder() {
    for (let car of this.dataSend.orderinfo.OrderInfo.OrderItem.details) {
      console.log(car.gst_total_tax_amount)
      delete car.gst_total_tax_amount
    }

    let orderPayload: any = {
      clientorderID: this.dataSend.orderinfo.OrderInfo.Order.details.orderID,
      restID: localStorage.getItem('restID'),
      order_detail: this.dataSend.orderinfo.OrderInfo.Order,
      order_items: this.dataSend.orderinfo.OrderInfo.OrderItem.details,
      userMobile: this.dataSend.orderinfo.OrderInfo.Customer.details.phone,
      customer: this.dataSend.orderinfo.OrderInfo.Customer.details,
      tax: JSON.parse(this.__tax),
      payment_status: ''
    };

    sessionStorage.setItem('db_order', JSON.stringify(orderPayload));

    this.api.saveOrder(orderPayload).subscribe((orderRes: any) => {
      if (orderRes.body.success == 1) {
        this.router.navigate(['Account']);
      }
    });
  }



  payUButton2() {

    let paymentDetails = {
      CustomerName: this.dataSend.orderinfo.OrderInfo.Customer.details.name,
      email: this.dataSend.orderinfo.OrderInfo.Customer.details.email,
      CustomerPhone: this.dataSend.orderinfo.OrderInfo.Customer.details.phone,
      txnid:
        'TXN' + Math.floor(new Date().valueOf() * Math.random()).toString(),
      productinfo: 'Piza',
      amount: this.dataSend.orderinfo.OrderInfo.Order.details.total,
      // amount: 1,
      address: this.dataSend.orderinfo.OrderInfo.Customer.details.address
    };
    let paymentString = `

<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>PayUBiz PHP7 Kit</title>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
</head>

<body>
<p>Please do not close window it's Loading...</p>
	<div class="main" style="display:none">

		<span style="float:left; display:inline-block;">
			<!--// Form with required parameters to be posted to Payment Gateway. For details of each required
			parameters refer Integration PDF. //-->
			<form action="https://bongateaubakeryncafe.in/payubiz_php7/index.php" id="payment_form" method="post">

			<!-- Contains information of integration type. Consult to PayU for more details.//-->
			<input type="hidden" id="udf5" name="udf5" value="PayUBiz_PHP7_Kit" />

			<div class="dv">
				<span class="text"><label>Transaction/Order ID:</label></span>
				<span>
				<!-- Required - Unique transaction id or order id to identify and match
				payment with local invoicing. Datatype is Varchar with a limit of 25 char. //-->
				<input type="text" id="txnid" name="txnid" placeholder="Transaction ID" value="${paymentDetails.txnid}" /></span>
			</div>

			<div class="dv">
				<span class="text"><label>Amount:</label></span>
				<span>
				<!-- Required - Transaction amount of float type. //-->
				<input type="text" id="amount" name="amount" placeholder="Amount" value="${paymentDetails.amount}" /></span>
			</div>

			<div class="dv">
				<span class="text"><label>Product Info:</label></span>
				<span>
				<!-- Required - Purchased product/item description or SKUs for future reference.
				Datatype is Varchar with 100 char limit. //-->
				<input type="text" id="productinfo" name="productinfo" placeholder="Product Info" value="P01,P02" /></span>
			</div>

			<div class="dv">
				<span class="text"><label>First Name:</label></span>
				<span>
				<!-- Required - Should contain first name of the consumer. Datatype is Varchar with 60 char limit. //-->
				<input type="text" id="firstname" name="firstname" placeholder="First Name" value="${paymentDetails.CustomerName}" /></span>
			</div>

			<div class="dv">
				<span class="text"><label>Last Name:</label></span>
				<span>
				<!-- Should contain last name of the consumer. Datatype is Varchar with 50 char limit. //-->
				<input type="text" id="Lastname" name="Lastname" placeholder="Last Name" value="" /></span>
			</div>

			<div class="dv">
				<span class="text"><label>Zip Code:</label></span>
				<span>
				<!-- Datatype is Varchar with 20 char limit only 0-9. //-->
				<input type="text" id="Zipcode" name="Zipcode" placeholder="Zip Code" value="" /></span>
			</div>

			<div class="dv">
				<span class="text"><label>Email ID:</label></span>
				<span>
				<!-- Required - An email id in valid email format has to be posted. Datatype is Varchar with 50 char limit. //-->
				<input type="text" id="email" name="email" placeholder="Email ID" value="${paymentDetails.email}" /></span>
			</div>

			<div class="dv">
				<span class="text"><label>Mobile/Cell Number:</label></span>
				<span>
				<!-- Required - Datatype is Varchar with 50 char limit and must contain chars 0 to 9 only.
				This parameter may be used for land line or mobile number as per requirement of the application. //-->
				<input type="text" id="phone" name="phone" placeholder="Mobile/Cell Number" value="${paymentDetails.CustomerPhone}" /></span>
			</div>

			<div class="dv">
				<span class="text"><label>Address1:</label></span>
				<span>
				<input type="text" id="address1" name="address1" placeholder="Address1" value="${paymentDetails.address}" /></span>
			</div>

			<div class="dv">
				<span class="text"><label>Address2:</label></span>
				<span>
				<input type="text" id="address2" name="address2" placeholder="Address2" value="" /></span>
			</div>

			<div class="dv">
				<span class="text"><label>City:</label></span>
				<span>
				<input type="text" id="city" name="city" placeholder="City" value="" /></span>
			</div>

			<div class="dv">
				<span class="text"><label>State:</label></span>
				<span><input type="text" id="state" name="state" placeholder="State" value="" /></span>
			</div>

			<div class="dv">
				<span class="text"><label>Country:</label></span>
				<span><input type="text" id="country" name="country" placeholder="Country" value="" /></span>
			</div>

			<div class="dv">
				<span class="text"><label>PG:</label></span>

				<!-- Not mandatory but fixed code can be passed to Payment Gateway to show default payment
				option tab. e.g. NB, CC, DC, CASH, EMI. Refer PDF for more details. //-->
				<!-- <input type="text" id="Pg" name="Pg" placeholder="PG" value="UPI" /></span> -->
			</div>

			<div><input type="button" id="btnsubmit" name="btnsubmit" value="Pay" onclick="frmsubmit(); return true;" /></div>
			</form>
		</span>





	</div> 
 	<script type="text/javascript">

		function frmsubmit()
		{
			document.getElementById("payment_form").submit();
			return true;
		}
	window.addEventListener("load", (event) => {
  frmsubmit();
});
	</script>

</body>
</html>`;

    const winUrl = URL.createObjectURL(
      new Blob([paymentString], { type: 'text/html' })
    );

    window.location.href = winUrl;
  }


}

// Set delivery charges: Rs. 80 for 5-10 km and Rs. 150 for 10-15 km
