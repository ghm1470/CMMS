import { Component, OnInit } from '@angular/core';
import {ActionMode} from '@angular-boot/util';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-trash',
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.scss']
})
export class TrashComponent implements OnInit {
  actionMode = ActionMode;
  constructor(  public activatedRoute: ActivatedRoute,
                public router: Router) {
  }

  ngOnInit() {
  }

  AddMessage() {
    this.router.navigate(['inbox/action'], {
      // queryParams: {mode: ActionMode.ADD},
      relativeTo: this.activatedRoute
    });
  }
}
