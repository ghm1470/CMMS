import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {InventoryService} from '../../../endpoint/inventory.service';
import {PartDto} from '../../../model/dto/part';
import {BaseAnyComponentSeven, BaseListComponentSeven, ListComponentData, ListQueryParam} from '@angular-boot/common';
import {ActionMode, DefaultNotify, ListHelper, ModalSize, PageContainer, Paging} from '@angular-boot/util';
import {PartWithUsageCountService} from '../../../../workOrder/endpoint/part-with-usage-count.service';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular-boot/core';
import {ModalUtil} from '@angular-boot/widgets';
import {DateViewMode} from '../../../../../shared/tools/date-view-mode.enum';
import {DeleteModel} from '../../../../../shared/conferm-delete/model/delete-model';
import {TokenRoleList} from '../../../../../shared/shared/constants/tokenRoleList';
import {UserType} from '../../../../securityManagement/model/userType';
import {isNullOrUndefined} from 'util';
import {Moment} from "../../../../../shared/shared/tools/date/moment";

@Component({
    selector: 'app-inventory-view',
    templateUrl: './inventory-view.component.html',
    styleUrls: ['./inventory-view.component.scss']
})
export class InventoryViewComponent implements OnInit, OnChanges, OnDestroy {
    @Input() receiveLocation = new PartDto.CheckLocation();
    dateViewMode = DateViewMode;
    dataOfUsersWhoHaveChangedInventory: GetAllUsersWhoHaveChangedInventory[] = [];
    selectedItemForDelete = new DeleteModel();
    MyModalSize = ModalSize;
    roleList = new TokenRoleList();
    userTypeList: UserType[] = [];
    loading = false;
    actionMode = ActionMode;
    mode: ActionMode = ActionMode.ADD;
    id;
    refId: string;
    location = new PartDto.CheckLocation();
    myMoment = Moment;


    constructor(
        protected router: Router,
        protected activatedRoute: ActivatedRoute,
        public inventoryService: InventoryService,
    ) {
        this.refId = this.activatedRoute.snapshot.queryParams.entityId;

    }

    canDeactivate(): boolean {
        return true;
    }

    ngOnInit() {
        // this.getRoleListKey();
    }

    ngOnChanges(changes: SimpleChanges) {
        // if (this.receiveLocation.inventoryLocationId) {
            this.getListSelf();
        // }
    }

    // getRoleListKey() {
    //   this.cacheService.getItem(Auth.RoleListKey, CacheType.LOCAL_STORAGE).pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
    //     if (res) {
    //       this.roleList = res;
    //     }
    //   });
    // }
    pageSize = 10;
    pageIndex = 0;
    length = -1;
    term: string;

    changePage(event: any) {
        this.length = event.length;
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.getListSelf();

    }

    getListSelf(options?: any) {
        this.loading = true;
        const paging = new Paging();
        paging.page = this.pageIndex;
        paging.size = this.pageSize;
        this.inventoryService.getAllUsersWhoHaveChangedInventory(this.receiveLocation, {
            paging,
            totalElements:-1,
        }).pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<GetAllUsersWhoHaveChangedInventory>) => {
            this.loading = false;
            if (res) {
                this.dataOfUsersWhoHaveChangedInventory = res.content;
                this.length = res.totalElements;
            }
        }, error => {
            this.loading = false;
        });
    }




    ngOnDestroy(): void {
    }


    search() {
        this.length = 0;
        if (this.pageIndex == 0) {
            this.getListSelf();
        } else {
            this.pageIndex = 0;
            this.router.navigate([], {
                queryParams: {
                    page: this.pageIndex,
                    size: this.pageSize
                },
                relativeTo: this.activatedRoute
            });
        }
    }

}


export class GetAllUsersWhoHaveChangedInventory {
    creationDate: Date;
    receiptNumber: string;// شماره رسید
    userName: string;
    userFamily: string;
    userTypeName: string;
    previousQuantity: number;
    currentQuantity: number;
}
