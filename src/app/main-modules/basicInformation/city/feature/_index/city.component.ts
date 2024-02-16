import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionMode} from '@angular-boot/util';
import {TokenRoleList} from '../../../../../shared/shared/constants/tokenRoleList';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {Auth} from '../../../../../shared/constants/cacheKeys';

@Component({
    selector: 'app-city',
    templateUrl: './city.component.html',
    styleUrls: ['./city.component.scss']
})
export class CityComponent implements OnInit, OnDestroy {

    actionMode = ActionMode;
    roleList = new TokenRoleList();

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
