import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent implements OnInit {
  @Input() loadingList = false;
  title = 'لطفا صبر کنید ...';
  f: number[] = [1, 2, 3, 4, 5, 6];

  constructor() {
  }

  ngOnInit() {
  }

}
