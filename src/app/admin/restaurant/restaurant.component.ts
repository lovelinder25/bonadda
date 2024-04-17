import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';

import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { ProductService } from 'src/app/frontend/api/product.service';
@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',

})
export class RestaurantComponent implements OnInit{
  constructor(private api: ProductService, private router: Router) { }

  hidePageSize = false;
  showPageSizeOptions = false;
  pageSizeOptions = [5, 10, 25];
  pageSize = 10;
  restID:any
  restaurants:any
  ngOnInit(): void {
    
    this.getAllRest()



  }

  getAllRest(){
    this.api.get_restaurants().subscribe((res:any)=>{
      this.dataSource = new MatTableDataSource(res.body);
      this.dataSource.paginator = this.paginator;
    })
  }

restForm = new FormGroup<any>({
  "city": new FormControl('', [Validators.required]),
  "latitude": new FormControl('',[Validators.required]),
  "longitude": new FormControl('',[Validators.required]),
  "restID": new FormControl('',[Validators.required]),
})


editMode:boolean=false
rest__id:any
  edit(id:any){
this.editMode = true
this.rest__id = id.id
    this.restForm.patchValue({
      city:id.city,
      latitude:id.latitude,
      longitude:id.longitude,
      restID:id.restID,
    })
  }


message:any
  addRest(){
    if(!this.editMode){
   this.api.add_restaurant(this.restForm.value).subscribe((res:any)=>{
  console.log(res)
  if(res.body.success == 1){
    this.getAllRest()
    this.restForm.reset()
this.message = res.body.message
this.editMode = false
  }
})
    } else{
      this.api.update_restaurant(this.restForm.value,this.rest__id).subscribe((res:any)=>{
        if(res.body.success == 1){
          this.getAllRest()
      this.message = res.body.message
    this.restForm.reset()
    this.editMode = false
        }

      })
      // console.log('edit mode on')
    }


  }

  deleteRest(e:any){
    let PermissionsLogout = confirm("Are u want to Delete");
    if (PermissionsLogout == true) {
      this.api.delete_restaurant(e.id).subscribe((res:any)=>{
        console.log(res)
        this.getAllRest()
      })
    } else {

      // do nothing
    }
    
  }
  displayedColumns: string[] = [ 'City', 'Latitude', 'Longitude', 'RestID','Action'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort) sort: any = MatSort;
}
