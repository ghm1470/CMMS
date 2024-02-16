import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionMode} from '@angular-boot/util';
import {Auth} from "../../../../shared/constants/cacheKeys";
import {CacheService, CacheType, takeUntilDestroyed} from "@angular-boot/core";
import {TokenRoleList} from "../../../../shared/shared/constants/tokenRoleList";

@Component({
    selector: 'app-schedule-maintenance',
    templateUrl: './schedule-maintenance.component.html',
    styleUrls: ['./schedule-maintenance.component.scss']
})
export class ScheduleMaintenanceComponent implements OnInit, OnDestroy {

    actionMode = ActionMode;
    roleList = new TokenRoleList();
    readService: boolean;

    constructor(private cacheService: CacheService) {
    }

    ngOnInit() {
        this.getRoleListKey();
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
