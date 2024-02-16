import {BasicElement} from './basic-element';

export class Time extends BasicElement {
  startTime: TimeModel;
  endTime: TimeModel;
}

export class TimeModel {
  hour: number;
  minute: number;
  second: number;
}
