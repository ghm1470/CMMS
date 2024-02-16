import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionMode, DefaultNotify} from '@angular-boot/util';
import {BOM} from '../../model/bom';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {BillOfMaterialsGroupsService} from '../../endpoint/bill-of-materials-groups.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TokenRoleList} from "../../../../shared/shared/constants/tokenRoleList";
import {Auth} from "../../../../shared/constants/cacheKeys";

@Component({
  selector: 'app-bill-of-materials-groups',
  templateUrl: './bill-of-materials-groups.component.html',
  styleUrls: ['./bill-of-materials-groups.component.scss']
})
export class BillOfMaterialsGroupsComponent implements OnInit, OnDestroy {
  actionMode = ActionMode;
  BOM = new BOM.Create();

  roleList = new TokenRoleList();

  constructor(public billOfMaterialsGroupsService: BillOfMaterialsGroupsService,
              private cacheService: CacheService,
              public router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.getRoleListKey();
  }

  goToActionComponent() {
    this.billOfMaterialsGroupsService.createBOM(this.BOM)
      .pipe(takeUntilDestroyed(this)).subscribe((res: BOM.Create) => {
      if (res) {
        // alert(res.id);
        this.router.navigate(['action'], {
          queryParams: {BOMId: res.id, mode: this.actionMode.ADD},
          relativeTo: this.activatedRoute
        });
      }
    });
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
