import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../api/product.service';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
})
export class LocationsComponent implements OnInit {
  constructor(private router: Router, private api: ProductService, private ActiveRoute: ActivatedRoute) { }
  restaurants: any
  LoginMobile: any
  ngOnInit(): void {
    // if (this.ActiveRoute.snapshot.queryParams) {
    //   this.LoginMobile = this.ActiveRoute.snapshot.queryParams
    //   console.log(this.ActiveRoute.snapshot.queryParams)

    // } else {
    //   this.LoginMobile = null
    //   console.log(this.ActiveRoute.snapshot.queryParams)
    // }
    // this.api.MobileLogin(this.ActiveRoute.snapshot.queryParams);


    this.api.get_restaurants().subscribe((res: any) => {
      console.warn(res.body)
      this.restaurants = res.body
    })
    // throw new Error('Method not implemented.');
  }



  selectBranch(e: any) {
    console.log(e.target.value)

    this.api.get_restaurants_location(e.target.value).subscribe((res: any) => {
      let restaurants = res.body[0]
      localStorage.setItem('restaurants', JSON.stringify(restaurants));

    })
    localStorage.setItem('restID', JSON.stringify(e.target.value));
    
    // this.router.navigate(['Home']);
    // location.href = '/Home'
    window.location.href = "#/Home";
    // if (this.LoginMobile.mobile === undefined) {
    //   console.log('undefined', this.LoginMobile.mobile)
    //   window.location.href = "#/Home";
    // } else {
    //   console.log('notundefined', this.LoginMobile)
    //   this.api.MobileLogin(this.LoginMobile);
    // }
  }
}
