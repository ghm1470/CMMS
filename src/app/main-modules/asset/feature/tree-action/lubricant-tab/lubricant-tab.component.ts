import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActionMode, DefaultNotify, Toolkit2} from '@angular-boot/util';
import {AssetService} from '../../../endpoint/asset.service';
import {takeUntilDestroyed} from '@angular-boot/core';
import {NotiConfig} from '../../../../../shared/tools/notifyConfig';
import {LubricantService} from '../../../../basicInformation/lubricant/endpoint/lubricant.service';
import {LubricantDto} from '../../../../basicInformation/lubricant/model/lubricantDto';

@Component({
    selector: 'app-lubricant-tab',
    templateUrl: './lubricant-tab.component.html',
    styleUrls: ['./lubricant-tab.component.scss']
})
export class LubricantTabComponent implements OnInit, OnDestroy {

    @Input() assetId: string;
    @Input() mode: ActionMode;
    lubricantListGetAll: LubricantDto.GetAll[] = [];
    lubricantListGetOne: SparePartDTOGetOne[] = [];
    lubricantListForShowInTable: SparePartDTOGetOneForShowInTable[] = [];
    selectedLubricant: SparePartDTOGetOneForShowInTable = new SparePartDTOGetOneForShowInTable();

    actionMode = ActionMode;
    loading = false;
    toolKit2 = Toolkit2;

    constructor(public lubricantService: LubricantService,
                public assetService: AssetService) {
        this.selectedLubricant.lubricantId = '-1';
    }

    ngOnInit() {
        // if (this.mode !== this.actionMode.VIEW) {

        this.getAllPart();
        // }
        // if (this.mode === this.actionMode.VIEW) {
        //   this.getPartsByAssetId();
        // }
    }

    getLubricantListByAssetId() {
        this.assetService.getOneLubricant({assetId: this.assetId}).pipe(takeUntilDestroyed(this))
            .subscribe((res: any) => {
                this.lubricantListGetOne = [];
                if (res.usedLubricants) {
                    if (res.usedLubricants.length) {
                        this.lubricantListGetOne = res.usedLubricants;
                        console.log('res.lubricants', res.usedLubricants);

                        this.filterPartsList();
                    }
                }
            });
        //
        // this.assetService.getPartsByAssetId({assetId: this.assetId}).pipe(takeUntilDestroyed(this))
        //     .subscribe((res: any) => {
        //         console.log('getPartsByAssetId', res);
        //         this.lubricantIdList = [];
        //         if (res.lubricants) {
        //             if (res.lubricants.length) {
        //                 this.lubricantIdList = res.lubricants;
        //                 console.log('res.lubricants', res.lubricants);
        //
        //                 this.filterPartsList();
        //             }
        //         }
        //     });
        //

    }

    getAllPart() {
        this.loading = true;
        this.lubricantService.getAll().pipe(takeUntilDestroyed(this))
            .subscribe((res: LubricantDto.GetOne[]) => {
                console.log('getAllPrivate', res);
                this.loading = false;
                if (res && res.length) {
                    this.lubricantListGetAll = res;
                    this.getLubricantListByAssetId();
                }
            }, error => {
                this.loading = false;
            });
    }

    filterPartsList() {
        this.lubricantListForShowInTable = [];
        // if (this.lubricantList.length > 0 && this.lubricantIdList.length > 0) {
        for (const item of this.lubricantListGetOne) {
            const index = this.lubricantListGetAll.findIndex(e => e.id === item.lubricantId);
            if (index !== -1) {
                const newLubricant = new SparePartDTOGetOneForShowInTable();
                newLubricant.lubricantId = this.lubricantListGetAll[index].id;
                newLubricant.title = this.lubricantListGetAll[index].title;
                newLubricant.type = this.lubricantListGetAll[index].type;
                newLubricant.amount = item.amount;
                if (!this.lubricantListForShowInTable.some(e => e.lubricantId === newLubricant.lubricantId)) {
                    this.lubricantListForShowInTable.push(newLubricant);
                }
            }

        }
    }


    updateAssetParts() {

        const dtoList: SparePartDTOGetOne[] = [];
        for (const item of this.lubricantListForShowInTable) {
            const dto = new SparePartDTOGetOne();
            dto.lubricantId = item.lubricantId;
            dto.amount = item.amount;
            if (!dtoList.some(e => e.lubricantId === dto.lubricantId)) {
                dtoList.push(dto);
            }
        }
        this.assetService.updateLubricant(dtoList, {assetId: this.assetId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            console.log('8888888', res);
            if (res) {
                DefaultNotify.notifySuccess('عملیات با موفقیت انجام شد.', '', NotiConfig.notifyConfig);
            } else {
                DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.', '', NotiConfig.notifyConfig);
            }
        });
        // const assetPartIdList = [];
        // for (const company of this.assetParts) {
        //     assetPartIdList.push(company.id);
        // }
        // this.assetService.updateAssetParts(assetPartIdList, {assetId: this.assetId})
        //     .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
        //     console.log('8888888', res);
        //     if (res) {
        //         DefaultNotify.notifySuccess('عملیات با موفقیت انجام شد.', '', NotiConfig.notifyConfig);
        //     } else {
        //         DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.', '', NotiConfig.notifyConfig);
        //     }
        // });
    }

    ngOnDestroy(): void {
    }

    changePart() {
        let has = false;
        if (this.selectedLubricant.lubricantId !== '-1' && this.selectedLubricant.lubricantId) {
            for (const item of this.lubricantListForShowInTable) {
                if (item.lubricantId === this.selectedLubricant.lubricantId) {
                    has = true;
                    break;
                }
            }
            if (!has) {
                const index = this.lubricantListGetAll.findIndex(e => e.id === this.selectedLubricant.lubricantId);
                if (index !== -1) {
                    const newLubricant = new SparePartDTOGetOneForShowInTable();
                    newLubricant.lubricantId = this.lubricantListGetAll[index].id;
                    newLubricant.title = this.lubricantListGetAll[index].title;
                    newLubricant.type = this.lubricantListGetAll[index].type;
                    newLubricant.amount = null;
                    if (!this.lubricantListForShowInTable.some(e => e.lubricantId === newLubricant.lubricantId)) {
                        this.lubricantListForShowInTable.push(newLubricant);
                    }
                }
                setTimeout(e => {
                    this.selectedLubricant = new SparePartDTOGetOneForShowInTable();
                }, 10);
            } else {
                DefaultNotify.notifyDanger('روانکار از قبل انتخاب شده', '', NotiConfig.notifyConfig);
            }
            this.lubricantListGetAll = this.lubricantListGetAll.filter(lubricant => lubricant.id !== this.selectedLubricant.lubricantId);
            // this.selectedPart = new LubricantDto.GetOne();
            // $('#propertyList').reset();
        }
    }

    deletePart(id: string) {
        const n = new LubricantDto.GetAll();
        const index = this.lubricantListForShowInTable.findIndex(lubricant => lubricant.lubricantId === id);
        n.id = this.lubricantListForShowInTable[index].lubricantId;
        n.title = this.lubricantListForShowInTable[index].title;
        n.type = this.lubricantListForShowInTable[index].type;
        if (!this.lubricantListGetAll.some(e => e.id === n.id)) {
            this.lubricantListGetAll.push(n);
        }


        this.lubricantListForShowInTable = this.lubricantListForShowInTable.filter(lubricant => lubricant.lubricantId !== id);
    }

    checkSelect(item: LubricantDto.GetOne) {
        let has;
        for (const asset of this.lubricantListForShowInTable) {
            if (asset.lubricantId === item.id) {
                has = true;
                return has;
            } else {
                has = false;
            }
        }
        if (!has) {
            return has;
        }
    }
}

export class SparePartDTOGetOne {
    lubricantId: string;
    amount: number = null;
}

export class SparePartDTOGetOneForShowInTable {
    title: string;
    type: string;
    lubricantId: string;
    amount: number = null;
}
