import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../api/product.service';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table-book',
  templateUrl: './table-book.component.html',
})
export class TableBookComponent implements OnInit {
  constructor(private api: ProductService, private router: Router) { }
  Usermobile:any;
  rest_id:any
  branch:any
  ngOnInit(): void {
      let rest___id:any = localStorage.getItem('restID')
      this.rest_id = JSON.parse(rest___id)


    if (localStorage.getItem('user')) {
      let UserStore = localStorage.getItem('user');
      let UserData = UserStore && JSON.parse(UserStore);
      var bytes = JSON.parse(CryptoJS.AES.decrypt(UserData.reFreshToken, 'hiddenKey').toString(CryptoJS.enc.Utf8));
      this.Usermobile = bytes.mobile
      console.log(UserData)
    }


    this.api.get_restaurant_by_id(this.rest_id).subscribe((res:any)=>{
    this.branch = res.body[0].city
      // this.restaurants = res.body
    })
  }

  


  
  tableForm = new FormGroup<any>({
    'reg_mob': new FormControl('', [Validators.required]),
    'fname': new FormControl('', [Validators.required]),
    'date': new FormControl('', [Validators.required]),
    'phone': new FormControl('', [Validators.required]),
    'time': new FormControl('', [Validators.required]),
    'guest': new FormControl('', [Validators.required]),
    'email': new FormControl('', [Validators.required]),
    'perperson': new FormControl('', [Validators.required]),
    'occasion': new FormControl('', [Validators.required]),
    'restID': new FormControl('', [Validators.required]),
    'requested_Date': new FormControl('', [Validators.required]),
    'status': new FormControl('pending', [Validators.required]),
    'branch': new FormControl('', [Validators.required]),
    
  })


  todayDate = new Date();
  getPrice(e:any){

this.tableForm.patchValue({
  perperson: e.target.value*500,
  reg_mob: this.Usermobile,
  restID:this.rest_id,
  requested_Date:`${this.todayDate.getFullYear()}-${this.todayDate.getMonth()}-${this.todayDate.getDate()}`,
  branch: this.branch
})
  }
  message:any
  booktable(){
    this.api.book_Table(this.tableForm.value).subscribe((res:any)=>{
      if(res.success == 1){
this.message= res.message,
this.tableForm.reset()
      } else{
this.message = res.message

      }
      // console.log(res.message, res.success)
    })
  }

}
