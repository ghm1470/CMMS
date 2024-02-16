import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-loading-full',
  templateUrl: './loading-full.component.html',
  styleUrls: ['./loading-full.component.scss']
})
export class LoadingFullComponent implements OnInit {
  title = 'لطفا صبر کنید ...';
  f: number[] = [1, 2, 3, 4, 5, 6];

  constructor() {
  }

  ngOnInit() {
  }

}
