import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../api/product.service';

@Component({
  selector: 'app-app-location',
  templateUrl: './app-location.component.html',
  styleUrls: ['./app-location.component.css']
})
export class AppLocationComponent implements OnInit {
  constructor(private router: Router, private api: ProductService) { }
  restaurants: any
  ngOnInit(): void {

  
    this.api.get_restaurants().subscribe((res: any) => {
      console.warn(res.body)
      this.restaurants = res.body
    })
    // throw new Error('Method not implemented.');
  }



  selectBranch(e: any) {
    console.log(e.target.value)

    this.api.get_restaurants_location(e.target.value).subscribe((res: any) => {
      // console.log('get_restaurants_location', res.body, )

      let restaurants = res.body[0]
      localStorage.setItem('restaurants', JSON.stringify(restaurants));

    })
    localStorage.setItem('restID', JSON.stringify(e.target.value));
    // this.router.navigate(['Home']);
    // location.href = '/Home'
    window.location.href = "#/app/Menu";
  }
}
