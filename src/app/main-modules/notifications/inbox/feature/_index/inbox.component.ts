import { Component, OnInit } from '@angular/core';
import {ActionMode} from '@angular-boot/util';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {
  actionMode = ActionMode;

  constructor() { }

  ngOnInit() {
  }

}
