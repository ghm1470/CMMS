export class Data {
  value: any;
  timestamp: any;
  hours: number;

  public getHours(): number {
    return this.timestamp + (this.hours * 60 * 60 * 1000);
    // return this.timestamp + (this.hours * 1000);
  }
}
