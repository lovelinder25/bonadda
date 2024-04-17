import { Pipe, PipeTransform, inject } from '@angular/core';
import { ProductService } from './frontend/api/product.service';

@Pipe({
  name: 'addon'
})

export class AddonPipe implements PipeTransform {
addOnG:any

  constructor(private api:ProductService){
 

  }

  transform(value: unknown, ...args: unknown[]): any {

    this.api.fatchMenu().subscribe((res:any)=>{
      this.addOnG = res.addongroups

      let result = this.addOnG.filter((elm:any)=>elm.addongroupid == value)

      
      for(let a of result){
          console.log(a.addongroup_name)
          return a.addongroup_name;
      }
      return 'sdds'
     })

  }

}
