import {Component, Input, OnDestroy, OnInit} from '@angular/core';


@Component({
  selector: 'app-loading-bar',
  templateUrl: './loading-bar.component.html',
  styleUrls: ['./loading-bar.component.scss']
})
export class LoadingBarComponent implements OnInit , OnDestroy {
  @Input() size: string = 'fa-2x';

  languageData: any = null;
  commonLanguage: any = null;
  selectedLanguage;

  constructor(

  ) {
  }

  ngOnInit() {
  }




  ngOnDestroy(): void {
  }
}
