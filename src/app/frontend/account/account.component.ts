import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../api/product.service';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
})
export class AccountComponent implements OnInit {
  constructor(private api: ProductService, private router: Router) { }

  Usermobile: any;
  user_id: any;
  addressFind: any;
  orderinfo: any;
  my_orders: any;
  noOrders: any;
  tables: any;
  hidePageSize = false;
  showPageSizeOptions = false;
  pageSizeOptions = [5, 10, 25];
  pageSize = 10;
  ngOnInit(): void {
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
    console.log(this.Usermobile);
    this.api.getUserByMobile(this.Usermobile).subscribe((res: any) => {
      this.user_id = res[0].id;
      if (res) {
        this.api.getUserAddress(this.user_id).subscribe((res: any) => {
          this.addressFind = res;
          this.userForm.patchValue({
            phone: res[0].phone,
            name: res[0].name,
            email: res[0].email,
            address: res[0].address,
          });
        });
      }
    });

    this.api.get_booked_tables(this.Usermobile).subscribe((res: any) => {
      // console.log('tabkes', res.body);
      this.tables = res.body;
      this.dataSource = new MatTableDataSource(this.tables);
      this.dataSource.paginator = this.paginator;
    });

    this.api.getOrderHistory(this.Usermobile).subscribe((res: any) => {
      if (res.body.message) {
        this.noOrders = res.body.message;
      } else {
        // res.body.forEach((element: any) => {
        //   // console.log(JSON.parse(element.order_items))
        //   element.test = JSON.parse(element.order_items)
        //   // element.test = JSON.parse(element.order_items)
        //   // element.order_detail = JSON.parse(element.order_detail).details,

        //   // //   element.date = element.order_detail.details.created_on,
        //   // //   element.total = element.order_detail.details.total,
        //   // //   element.customer = JSON.parse(element.customer)
        //   // // this.OrderTax = JSON.parse(element.tax)
        //   // // this.order_detail = element.order_detail
        //   //   console.log(element.test);
        //   });
        for (let o of res.body) {
          // console.log(o.order_items)
          o.order_items = JSON.parse(o.order_items)
          // console.log(JSON.parse(o.order_items))
          
          o.order_detail = JSON.parse(o.order_detail)
          o.date = o.order_detail.details.created_on
          o.total = o.order_detail.details.total
          // console.log(o.order_detail.details)
        }
        
        this.my_orders = res.body;
        // console.log('dsfgsdf', res.body);
      }
    });

    // this.getUserAddress()

    if (!navigator.geolocation) {
      console.log('Location not supported');
    }
    this.getLatLog();
  }

  addressSelectedStatus: any;
  getAddressFromDB() {
    this.api.getUserByMobile(this.Usermobile).subscribe((res: any) => {
      this.user_id = res[0].id;
      this.getUserAddress();
      let phone = res[0].mobile;
      this.api.getUserAddress(this.user_id).subscribe((res: any) => {
        this.addressFind = res;
        console.log('addressFind', res);

        if (sessionStorage.getItem('address')) {
          this.addressSelectedStatus = true;
          let SessionAddress: any = sessionStorage.getItem('address');
          let SessionAddress_Pars = JSON.parse(SessionAddress);

          for (let a of this.addressFind) {
            if (a.id == SessionAddress_Pars.id) {
              a.selected = true;
            }
          }
        } else {
          this.addressSelectedStatus = false;
        }
      });
    });
  }

  get_Orders() {
    this.api.getOrderHistory(this.Usermobile).subscribe((res: any) => {
      for (let o of res.body) {
        o.order_items = JSON.parse(o.order_items);
        o.order_detail = JSON.parse(o.order_detail);
        o.date = o.order_detail.details.created_on;
        o.total = o.order_detail.details.total;
        // console.log(o.order_items)
      }
      this.my_orders = res.body;
      console.log(this.my_orders);
    });
  }

  userForm = new FormGroup<any>({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    latitude: new FormControl('', [Validators.required]),
    longitude: new FormControl('', [Validators.required]),
  });

  getLatLog() {
    navigator.geolocation.getCurrentPosition((position) => {
      // console.log(position.coords.latitude, position.coords.longitude)
      this.userForm.patchValue({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  }

  getValue() {
    this.api.saveAddress(this.userForm.value).subscribe((res: any) => {
      // console.log(res)
      this.getUserAddress();
    });
  }

  getUserAddress() {
    this.api.getUserAddress(this.user_id).subscribe((res: any) => {
      this.addressFind = res;
      // console.log('address', res)
    });
  }

  //   {
  //     "fieldCount": 0,
  //     "affectedRows": 1,
  //     "insertId": 0,
  //     "info": "(Rows matched: 1  Changed: 1  Warnings: 0",
  //     "serverStatus": 34,
  //     "warningStatus": 0,
  //     "changedRows": 1,
  //     "success": true,
  //     "message": "Address Updated Successfully"
  // }

  addressID: any;
  editAddress(e: any) {
    console.log(e);
    this.addressID = e.id;

    this.userForm.patchValue({
      phone: e.phone,
      name: e.name,
      email: e.email,
      address: e.address,
    });
  }

  alert: any;
  updateAddress() {
    this.api
      .updateAddress(this.addressID, this.userForm.value)
      .subscribe((res: any) => {
        // console.log(res)
        if (res.body.success == true) {
          this.alert = res.body.message;
        } else {
          this.alert = 'Some Errors ..';
        }

        setTimeout(() => {
          this.alert = '';
        }, 1000);
        this.getUserAddress();
      });
  }

  logout() {
    let PermissionsLogout = confirm('Are u want to logout');
    if (PermissionsLogout == true) {
      if (localStorage.getItem('user')) {
        localStorage.removeItem('user');
        this.router.navigate(['login']);
      }
    } else {
      // do nothing
    }
  }

  Payload: any = {
    app_key: '8fpo7hxme2vywkutcba0dj41s9g536qr',
    app_secret: 'fd3bad60841d2b68bfad69f962d5f3b73f8e5e49',
    access_token: 'b10d29610d00c8f1bd118b4ea8d0bbd063237e07',
    restID: '',
    orderID: '', // pass it blank, will be deprecated soon.
    clientorderID: '',
    cancelReason: 'Please cancel my order.',
    status: '-1',
  };

  // {
  //   "success": "1",
  //   "message": "Order status updated successfully.",
  //   "restID": "okz15g4x",
  //   "clientOrderID": "196028901660",
  //   "orderID": "",
  //   "status": "-1"
  // }
  cancelOrder(id: any) {
    let restID__: any = localStorage.getItem('restID');
    let ParsRest = JSON.parse(restID__);

    this.Payload.restID = ParsRest.toString();

    let PermissionsLogout = confirm('Are You Want To Cancel This Order');
    if (PermissionsLogout == true) {
      (this.Payload.clientorderID = id),
        this.api.cancelOrder(this.Payload).subscribe((res: any) => {
          console.log(res.body);
          if (res.body.success == '1') {
            let data = { status: '-1' };
            this.cancelFromUser(res.body.clientOrderID, data);
          }
        });
    } else {
      // do nothing
    }
  }

  cancelFromUser(id: any, data: any) {
    this.api.cancelOrderStatus(id, data).subscribe((res: any) => {
      console.log(res.body);
      this.get_Orders();
    });
  }

  cancelTable(id: any) {
    console.log(id);
  }

  displayedColumns: string[] = [
    'Sr',
    'Branch',
    'Date',
    'Time',
    'Status',
    'Total',
    'Action',
  ];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort) sort: any = MatSort;
}




