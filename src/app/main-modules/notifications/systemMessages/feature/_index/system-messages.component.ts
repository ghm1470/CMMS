import { Component, OnInit } from '@angular/core';
import {ActionMode} from '@angular-boot/util';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../../../endPoint/notification.service';

@Component({
  selector: 'app-system-messages',
  templateUrl: './system-messages.component.html',
  styleUrls: ['./system-messages.component.scss']
})
export class SystemMessagesComponent implements OnInit {
  actionMode = ActionMode;
  constructor(  public activatedRoute: ActivatedRoute,
                public router: Router,
                private notificationService: NotificationService) {
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
