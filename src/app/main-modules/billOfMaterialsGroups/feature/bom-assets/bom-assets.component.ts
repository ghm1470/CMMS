import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BaseAnyComponentSeven} from '@angular-boot/common';
import {ActivatedRoute, Router} from '@angular/router';
import {ActionMode, DefaultNotify, PageContainer, Paging} from '@angular-boot/util';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {BOM} from '../../model/bom';
import {BillOfMaterialsGroupsService} from '../../endpoint/bill-of-materials-groups.service';
import {ModalUtil} from '@angular-boot/widgets';
import {DeleteModel} from '../../../../shared/conferm-delete/model/delete-model';
import {TokenRoleList} from '../../../../shared/shared/constants/tokenRoleList';
import {Tools} from '../../../../shared/tools/Tools';
import {Location} from '@angular/common';
import {Auth} from '../../../../shared/constants/cacheKeys';
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

@Component({
    selector: 'app-bom-assets',
    templateUrl: './bom-assets.component.html',
    styleUrls: ['./bom-assets.component.scss']
})
export class BomAssetsComponent implements OnInit, OnDestroy {
    @Input() BOMId;
    @Input() mode: ActionMode;
    selectedItemForDelete = new DeleteModel();
    actionMode = ActionMode;
    roleList = new TokenRoleList();
    dataOfAssetBOMList: BOM.BOMAsset [] = [];
    loading = false;
    showModal = false;
    tools = Tools;
    off = true;
    BOM = new BOM.Create();
    VariableToDeclareGet = 0;

    constructor(protected router: Router,
                protected activatedRoute: ActivatedRoute,
                private cacheService: CacheService,
                public location: Location,
                public billOfMaterialsGroupsService: BillOfMaterialsGroupsService,
    ) {
    }


    ngOnInit() {
        this.getRoleListKey();
        this.getListSelf();

    }


    getRoleListKey() {
        this.cacheService.getItem(Auth.RoleListKey, CacheType.LOCAL_STORAGE).pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            if (res) {
                this.roleList = res;
            }
        });
    }


    getListSelf(options?: any) {
        this.loading = true;
        this.dataOfAssetBOMList = [];
        const paging = new Paging();
        paging.page = this.pageIndex;
        paging.size = this.pageSize;
        this.billOfMaterialsGroupsService.getAllByPaginationAssetBOM({
            paging,
            totalElements:-1,
            BOMId: this.BOMId
        }).pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<BOM.BOMAsset>) => {
            this.loading = false;
            this.dataOfAssetBOMList = res.content;
            this.cacheService.set('AssetSelectedList', this.dataOfAssetBOMList, CacheType.LOCAL_STORAGE);
            this.length = res.totalElements;
        }, error => {
            this.loading = false;
        });
    }


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


    search() {
        this.pageIndex = 0;
        this.getListSelf();

    }


    deleteItem(event) {
        if (event) {
            this.selectedItemForDelete.loading = true;
            this.billOfMaterialsGroupsService.deleteAssetBOM({
                BOMId: this.BOMId,
                assetId: this.selectedItemForDelete.id
            })
                .pipe(takeUntilDestroyed(this)).subscribe((res) => {
                if (res !== true) {
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
                    DefaultNotify.notifyDanger(res, '', NotiConfig.notifyConfig);
                    return;
                } else if (res === true) {
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);

                    this.dataOfAssetBOMList = this.dataOfAssetBOMList

                        .filter((e) => {
                            return e.assetId !== this.selectedItemForDelete.id;
                        });
                    this.cacheService.set('AssetSelectedList', this.dataOfAssetBOMList, CacheType.LOCAL_STORAGE);

                    DefaultNotify.notifySuccess('با موفقیت حذف شد.', '', NotiConfig.notifyConfig);

                } else {
                    DefaultNotify.notifyDanger(res.message, '', NotiConfig.notifyConfig);
                }
            }, error => {
            });

        } else {
            ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
        }
    }


    showModalDelete(item: BOM.BOMAsset, i) {
        this.selectedItemForDelete.loading = false;
        this.selectedItemForDelete.id = item.assetId;
        this.selectedItemForDelete.title = ' آیا دارایی  ' + item.assetName + '#' + item.assetCode + ' حذف  شود؟ ';
        this.selectedItemForDelete.index = i;
        setTimeout(e => {
            ModalUtil.showModal('modalId' + this.selectedItemForDelete.id);
        }, 10);
    }


    ngOnDestroy(): void {
    }

    setService() {
        this.VariableToDeclareGet = this.VariableToDeclareGet + 1;
        this.showModal = true;
        this.cacheService.set('AssetSelectedList', this.dataOfAssetBOMList, CacheType.LOCAL_STORAGE);
        setTimeout(() => {
            ModalUtil.showModal('modal2');
        }, 50);
    }

    getAssetList() {
        this.dataOfAssetBOMList = this.cacheService.get('AssetSelectedList', CacheType.LOCAL_STORAGE);
    }
}



