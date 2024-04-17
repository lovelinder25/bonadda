import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'subcat'
})
export class SubcatPipe implements PipeTransform {

  transform(value: any, ...args: any[]): unknown {
    console.log(value)
    return null;
  }

}
