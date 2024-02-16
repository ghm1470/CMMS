import { Component, OnInit } from '@angular/core';
import {ActionMode} from '@angular-boot/util';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../../../endPoint/notification.service';

@Component({
  selector: 'app-sent',
  templateUrl: './sent.component.html',
  styleUrls: ['./sent.component.scss']
})
export class SentComponent implements OnInit {
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
