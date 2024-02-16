import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionMode, DefaultNotify} from '@angular-boot/util';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {MessagingService} from '../../endpoint/messaging.service';
import {UserDto} from '../../model/dto/user-dto';
import {Auth} from "../../../../shared/constants/cacheKeys";
import {TokenRoleList} from "../../../../shared/shared/constants/tokenRoleList";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  constructor() {
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }
}
