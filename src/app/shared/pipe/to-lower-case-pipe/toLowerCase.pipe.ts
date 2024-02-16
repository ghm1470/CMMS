import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'ToLowerCasePipe'
})
export class ToLowerCasePipe implements PipeTransform {

  constructor() {
  }

  transform(key: any): string {
    return key.toString().toLocaleLowerCase();
  }

}
