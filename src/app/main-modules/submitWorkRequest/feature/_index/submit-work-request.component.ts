import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionMode} from '@angular-boot/util';
import {Auth} from '../../../../shared/constants/cacheKeys';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {TokenRoleList} from '../../../../shared/shared/constants/tokenRoleList';

@Component({
    selector: 'app-submit-work-request',
    templateUrl: './submit-work-request.component.html',
    styleUrls: ['./submit-work-request.component.scss']
})
export class SubmitWorkRequestComponent implements OnInit, OnDestroy {
    actionMode = ActionMode;
    readService: boolean;

    roleList = new TokenRoleList();

    constructor(private cacheService: CacheService) {
    }

    ngOnInit() {
        this.getRoleListKey();
    }

    getRoleListKey() {
        this.cacheService.getItem(Auth.RoleListKey, CacheType.LOCAL_STORAGE).pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            if (res) {
                this.roleList = res;
            }
        });
    }

    ngOnDestroy(): void {
    }
}
