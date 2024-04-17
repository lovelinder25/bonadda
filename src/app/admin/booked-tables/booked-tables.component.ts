import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';

import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { ProductService } from 'src/app/frontend/api/product.service';


@Component({
  selector: 'app-booked-tables',
  templateUrl: './booked-tables.component.html',
})
export class BookedTablesComponent implements OnInit {
  constructor(private api: ProductService, private router: Router) { }

  hidePageSize = false;
  showPageSizeOptions = false;
  pageSizeOptions = [5, 10, 25];
  pageSize = 10;
  restID:any
  restaurants:any

  ngOnInit(): void {
       let menuID:any = localStorage.getItem('restID')
    this.restID = JSON.parse(menuID);



    this.api.get_restaurants().subscribe((res:any)=>{
      console.warn(res.body)
      this.restaurants = res.body
    })


    
  }

  getTablesByRestId(_restID:any){
    this.api.get_restaurant_by_RESTid(_restID).subscribe((res:any)=>{
      console.log('tabkes',res.body)
      this.dataSource = new MatTableDataSource(res.body);
      this.dataSource.paginator = this.paginator;
    })
  }

  getBranchId(e:any){
 
    this.getTablesByRestId(e.target.value)
  }

  updateStatus(e:any, id:any, restID:any){
    let ___restID = restID
    let Payload = {
      status:e.target.value
    }
    this.api.update_booking(Payload, id).subscribe((res:any)=>{
      console.log(res)
      if(res.body.success == 1){
        this.getTablesByRestId(___restID)
        
      }
    })
  }
  displayedColumns: string[] = ['Sr', 'Name', 'Date', 'Time', 'Email', 'Phone','Guest', 'Occasion',  'Total', 'Status',  'Action'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort) sort: any = MatSort;
}

