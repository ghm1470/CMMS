import { Component, OnInit } from '@angular/core';
import {ActionMode} from '@angular-boot/util';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent implements OnInit {

  actionMode = ActionMode;
  constructor() { }

  ngOnInit() {
  }

}
