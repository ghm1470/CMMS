import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CategoryDto} from '../../../../category/model/dto/categoryDto';
import {PartService} from '../../../../part/endpoint/part.service';
import {InventoryService} from '../../../../part/endpoint/inventory.service';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular-boot/core';
import {PartDto} from '../../../../part/model/dto/part';
import {AssetDto} from '../../../../asset/model/dto/assetDto';
import {ActionMode, DefaultNotify, ModalSize, Paging} from '@angular-boot/util';
import {Storage} from '../../../../storage/model/domain/storage';
import {ModalUtil} from '@angular-boot/widgets';
import {PartWithUsageCount} from '../model/PartWithUsageCount';
import {PartDtoForSearch} from "../../../../part/feature/list/part-list.component";
import {NotiConfig} from "../../../../../shared/tools/notifyConfig";

@Component({
    selector: 'app-view-part-modal',
    templateUrl: './view-part-modal.component.html',
    styleUrls: ['./view-part-modal.component.scss']
})
export class ViewPartModalComponent implements OnInit, OnDestroy {
    @Output() selectedPart = new EventEmitter<OptimalPSB>();
    @Input() partWithUsageCountListIn: PartWithUsageCount[] = [];
    partWithUsageCountList: PartWithUsageCount[] = [];
    MyModalSize = ModalSize;
    PSBList: OptimalPSB[] = [];
    PSBList2: OptimalPSB[] = [];
    PSBList11: OptimalPSB[] = [];
    PSBList12: OptimalPSB[] = [];
    PSBList13: OptimalPSB[] = [];
    PSB = new OptimalPSB();
    showLoader = true;
    categoryType = CategoryDto.CategoryType;

    constructor(public entityService: PartService,
                public inventoryService: InventoryService,
                public activatedRoute: ActivatedRoute,
                public router: Router) {

    }


    ngOnInit() {
        this.partWithUsageCountList = JSON.parse(JSON.stringify(this.partWithUsageCountListIn));
        this.getPage();

    }

    entityList: PartDto.GetAll[] = [];

    pageSize = 10;
    pageIndex = 0;
    length = -1;
    term: string;
    loading = false;
    partForSearch: PartDtoForSearch = new PartDtoForSearch();

    changePage(event: any) {
        this.length = event.length;
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.getPage();

    }

    getPage() {
        this.loading = true;
        const paging = new Paging();
        paging.page = this.pageIndex;
        paging.size = this.pageSize;

        this.entityService.getAllPartsWithOutInventoryAndLoadedInventories(this.partForSearch, {
            paging,
            totalElements:-1,
        })
            // this.entityService.getAll()
            .subscribe((res: any) => {
                if (res) {
                    this.entityList = res.content;
                    for (const partWithUsageCount of this.partWithUsageCountList) {
                        for (let i = 0; i < this.entityList.length; i++) {
                            if (this.entityList[i].partId === partWithUsageCount.partId) {
                                // this.entityList[i].se
                                this.entityList.splice(i, 1);
                                i--;
                            }

                        }
                    }
                    this.length = res.totalElements;
                    this.loading = false;
                }
                ;
            }, error => {
                this.loading = false;
            });
    }

    search() {
        // if (this.pageIndex == 0) {
        //     this.getPage();
        // } else {
        this.pageIndex = 0;
        this.getPage();
    }

    // }

    // getListSelf() {
    //     this.partService.getAllPSB().pipe(takeUntilDestroyed(this)).subscribe((res: PSB) => {
    //         if (res.partList && res.partList.length > 0) {
    //             for (let i = 0; i < res.partList.length; i++) {
    //                 this.PSB = new OptimalPSB();
    //                 this.PSB.id = res.partList[i].id;
    //                 this.PSB.code = null;
    //                 this.PSB.partCode = res.partList[i].partCode;
    //                 this.PSB.name = res.partList[i].name;
    //                 this.PSB.hasChild = false;
    //                 this.PSB.categoryTypePSB = 'PART';
    //                 this.PSBList.push(this.PSB);
    //             }
    //         }
    //         if (res.uniqueStorageList && res.uniqueStorageList.length > 0) {
    //             for (let i = 0; i < res.uniqueStorageList.length; i++) {
    //                 this.PSB = new OptimalPSB();
    //                 this.PSB.code = res.uniqueStorageList[i].code;
    //                 this.PSB.id = res.uniqueStorageList[i].id;
    //                 this.PSB.name = res.uniqueStorageList[i].title;
    //                 this.PSB.hasChild = true;
    //                 this.PSB.categoryTypePSB = 'STORAGE';
    //                 this.PSBList.push(this.PSB);
    //             }
    //         }
    //         if (res.assetList && res.assetList.length > 0) {
    //             for (let i = 0; i < res.assetList.length; i++) {
    //                 this.PSB = new OptimalPSB();
    //                 this.PSB.code = res.assetList[i].code;
    //                 this.PSB.id = res.assetList[i].id;
    //                 this.PSB.name = res.assetList[i].name;
    //                 this.PSB.hasChild = res.assetList[i].hasChild;
    //                 this.PSB.categoryTypePSB = 'ASSET';
    //                 this.PSBList.push(this.PSB);
    //             }
    //         }
    //         for (const item of this.partWithUsageCountList) {
    //             this.PSBList.find(e => e.id === item.partId).forbiddenSelected = true;
    //         }
    //         this.showLoader = false;
    //     });
    //     // ===========================================================================
    // }

    getChildList(parent: OptimalPSB, i, categoryTypePSB) {
        if (categoryTypePSB === 'STORAGE') {
            this.inventoryService.getAllPartByParentId({storageId: parent.id}).pipe(takeUntilDestroyed(this))
                .subscribe((res: PartDto.CreateInventory[]) => {
                    if (res) {
                        this.PSBList2 = this.PSBList;
                        this.PSBList = [];
                        for (let j = 0; j <= i; j++) {
                            this.PSBList.push(this.PSBList2[j]);
                        }
                        if (res && res.length > 0) {
                            for (const item of res) {
                                this.PSB = new OptimalPSB();
                                this.PSB.categoryTypePSB = 'PART';
                                this.PSB.name = item.partName;
                                this.PSB.id = item.id;
                                this.PSB.code = item.inventoryCode;
                                this.PSB.partCode = item.partCode;
                                this.PSB.isPartOfAsset = parent.id;
                                this.PSB.warehouse = item.warehouse;
                                this.PSB.row = item.row;
                                this.PSB.corridor = item.corridor;
                                this.PSB.marginRight = parent.marginRight + 30;
                                this.PSB.hasChild = false;
                                this.PSBList.push(this.PSB);
                            }
                        }
                        this.PSBList.find(e => e.id === parent.id).openPlus = true;
                    }
                    for (let k = i + 1; k < this.PSBList2.length; k++) {
                        this.PSBList.push(this.PSBList2[k]);
                    }
                });
        }
        if (categoryTypePSB === 'ASSET') {
            this.inventoryService.getAllStorageByParentId({assetId: parent.id}).pipe(takeUntilDestroyed(this))
                .subscribe((res: SB) => {
                    if (res) {
                        this.PSBList2 = this.PSBList;
                        this.PSBList = [];
                        for (let j = 0; j <= i; j++) {
                            this.PSBList.push(this.PSBList2[j]);
                        }
                        if (res.assetList && res.assetList.length > 0) {
                            for (const item of res.assetList) {
                                this.PSB = new OptimalPSB();
                                this.PSB.categoryTypePSB = 'ASSET';
                                this.PSB.name = item.name;
                                this.PSB.id = item.id;
                                this.PSB.code = item.code;
                                this.PSB.isPartOfAsset = parent.id;
                                this.PSB.warehouse = null;
                                this.PSB.row = null;
                                this.PSB.corridor = null;
                                this.PSB.marginRight = parent.marginRight + 30;
                                this.PSB.hasChild = item.hasChild;
                                this.PSBList.push(this.PSB);
                            }
                        }
                        if (res.uniqueStorageList && res.uniqueStorageList.length > 0) {
                            for (const item of res.uniqueStorageList) {
                                this.PSB = new OptimalPSB();
                                this.PSB.categoryTypePSB = 'STORAGE';
                                this.PSB.name = item.title;
                                this.PSB.id = item.id;
                                this.PSB.code = item.code;
                                this.PSB.isPartOfAsset = parent.id;
                                this.PSB.warehouse = null;
                                this.PSB.row = null;
                                this.PSB.corridor = null;
                                this.PSB.marginRight = parent.marginRight + 30;
                                this.PSB.hasChild = item.hasChild;
                                this.PSBList.push(this.PSB);
                            }
                        }
                        this.PSBList.find(e => e.id === parent.id).openPlus = true;
                    }
                    for (let k = i + 1; k < this.PSBList2.length; k++) {
                        this.PSBList.push(this.PSBList2[k]);
                    }
                });
        }
    }

    methodTow(id: string) {
        // =====================================================================
        this.PSBList.find(e => e.id === id).openPlus = false;
        this.PSBList11 = this.PSBList.filter(e => e.isPartOfAsset === id);
        this.PSBList12 = this.PSBList.filter(e => e.isPartOfAsset !== id);
        this.PSBList = this.PSBList12;
        this.PSBList13 = this.PSBList11;
        while (this.PSBList11.length > 0) {
            for (const item of this.PSBList13) {
                this.PSBList11 = [];
                this.PSBList12 = [];
                this.PSBList11 = this.PSBList.filter(e => e.isPartOfAsset === item.id);
                this.PSBList12 = this.PSBList.filter(e => e.isPartOfAsset !== item.id);
                this.PSBList = this.PSBList12;
                this.PSBList13 = this.PSBList11;
            }
        }
    }

    chooseSelectedItemForEdit(item: AssetDto.GetAllByFilterAndPagination) {
        this.router.navigate(['action'], {
            queryParams: {mode: ActionMode.EDIT, partId: item.id},
            relativeTo: this.activatedRoute
        });
    }

    // deleteItem(item: AssetDto.GetAllByFilterAndPagination) {
    //     this.partService.delete({partId: item.id})
    //         .pipe(takeUntilDestroyed(this)).subscribe((res: boolean) => {
    //         if (res) {
    //             this.PSBList = this.PSBList.filter((e) => {
    //                 return e.id !== item.id;
    //             });
    //             // this.processPage();
    //         }
    //     });
    // }

    ngOnDestroy(): void {
    }

    // chooseSelectedItemForEdit(item: PSB) {
    //   this.router.navigate(['action'], {
    //     queryParams: {mode: ActionMode.EDIT, partId: item.id},
    //     relativeTo: this.activatedRoute
    //   });
    // }
    //
    // chooseSelectedItemForView(item: PSB) {
    //   this.router.navigate([item.id, ActionMode.VIEW], {
    //     relativeTo: this.activatedRoute
    //   });
    // }
    //
    // checkDeleteItem(item: PSB) {
    //   this.inventoryService.checkDeletePart({partId: item.id}).pipe(takeUntilDestroyed(this)).subscribe( (res: boolean) => {
    //  if (res === false) {
    //       this.deleteItem(item);
    //       this.existInventory = false;
    //     } else {
    //       this.existInventory = true;
    //     }
    //   });
    // }
    //   deleteItem(item: PSB) {
    //   this.partService.delete({partId: item.id})
    //     .pipe(takeUntilDestroyed(this)).subscribe((res) => {
    //     if (res === true) {
    //       this.partList.itemPage.content = this.partList.itemPage.content
    //         .filter((e) => {
    //           return e.id !== item.id;
    //         });
    //       this.processPage();
    //     }
    //   });
    // }

    sendPart(item: PartDto.GetAll, i) {
        if (this.partWithUsageCountList.some(p => p.partId === item.partId)) {
            DefaultNotify.notifyDanger('این قطعه قبلا انتخاب شده است.', '', NotiConfig.notifyConfig);
            return;

        } else {
            const newEntity = new PartWithUsageCount(null);
            newEntity.partName = item.partName;
            newEntity.partCode = item.partCode;
            newEntity.partId = item.partId;
            newEntity.usedNumber = null;
            this.partWithUsageCountList.push(newEntity);
            this.entityList.splice(i, 1);
        }
        // this.selectedPart.emit(item);
        // this.cancelModal();
    }

    deletePart(item: PartWithUsageCount, i) {
        if (this.partWithUsageCountList.some(p => p.partId === item.partId)) {

            const newEntity = new PartDto.GetAll();
            newEntity.partName = item.partName;
            newEntity.partCode = item.partCode;
            newEntity.partId = item.partId;
            this.entityList.push(newEntity);
            this.partWithUsageCountList.splice(i, 1);
        }
        // this.selectedPart.emit(item);
        // this.cancelModal();
    }

    cancelModal(type) {
        if (type === 'confirm') {
            for (let i = 0; i < this.partWithUsageCountListIn.length; i++) {
                this.partWithUsageCountListIn.splice(i, 1);
                i--;
            }
            for (const item of this.partWithUsageCountList) {
                this.partWithUsageCountListIn.push(item)

            }
        }
        ModalUtil.hideModal('viewPartForPartWhitUsageCount');
    }
}


export class PSB {
    partList: PartDto.Create[] = [];
    uniqueStorageList: Storage.Create[] = [];
    assetList: AssetDto.CreateAsset[] = [];
}

export class SB {
    uniqueStorageList: Storage.Create[] = [];
    assetList: AssetDto.CreateAsset[] = [];
}

export class OptimalPSB {
    id: string;
    name: string;
    code: string;
    partCode: string;
    categoryTypePSB: string;
    isPartOfAsset: string;
    corridor: string;
    row: string;
    warehouse: string;
    openPlus = false;
    marginRight = 5;
    hasChild = false;
    forbiddenSelected = false;
}
