import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionMode} from "@angular-boot/util";
import {Auth} from "../../../../shared/constants/cacheKeys";
import {CacheService, CacheType, takeUntilDestroyed} from "@angular-boot/core";
import {TokenRoleList} from "../../../../shared/shared/constants/tokenRoleList";

@Component({
  selector: 'app-security-management',
  templateUrl: './security-management.component.html',
  styleUrls: ['./security-management.component.scss']
})
export class SecurityManagementComponent implements OnInit, OnDestroy {
  actionMode = ActionMode;
  roleList = new TokenRoleList();

  constructor(private cacheService: CacheService) {
    this.getRoleListKey();
  }

  ngOnInit() {

  }

  ngOnDestroy(): void {
  }

  getRoleListKey() {
    this.cacheService.getItem(Auth.RoleListKey, CacheType.LOCAL_STORAGE).pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
      if (res) {
        this.roleList = res;
      }
    });
  }

}
