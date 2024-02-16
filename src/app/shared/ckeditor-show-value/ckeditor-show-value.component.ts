import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-ckeditor-show-value',
  templateUrl: './ckeditor-show-value.component.html',
  styleUrls: ['./ckeditor-show-value.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CkeditorShowValueComponent implements OnInit {
   @Input() value ;
  constructor() { }

  ngOnInit() {
  }

}
