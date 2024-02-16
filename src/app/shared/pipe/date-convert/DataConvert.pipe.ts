import {Pipe, PipeTransform} from '@angular/core';
import {Moment} from '../../tools/date/moment';

@Pipe({
  name: 'IsoToJDateWithTime'
})
export class IsoToJDateWithTimePipe implements PipeTransform {

  constructor() {
  }

  transform(key: any): string {
    return Moment.convertIsoToJDateWithTime(key);
  }

}
