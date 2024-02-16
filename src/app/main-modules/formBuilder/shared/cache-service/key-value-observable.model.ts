import {BehaviorSubject} from 'rxjs';

/**
 * @author yaqub
 */
export class KeyValueObservable {
  key: string;
  source = new BehaviorSubject<any>(null);
  timestamp: any;
  hours: number;

  public getHours(): number {
    return this.timestamp + (this.hours * 60 * 60 * 1000);
    // return this.timestamp + (this.hours * 1000);
  }
}
