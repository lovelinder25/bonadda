import { Component, OnInit } from '@angular/core';
import { ProductService } from '../api/product.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
})
export class HomepageComponent implements OnInit {
  constructor(private Api: ProductService) { }
  items: any
  ngOnInit(): void {

  }


}
