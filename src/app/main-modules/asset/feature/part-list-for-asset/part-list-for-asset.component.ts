import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PartDto} from '../../../part/model/dto/part';
import {PartService} from '../../../part/endpoint/part.service';
import {takeUntilDestroyed} from '@angular-boot/core';
import {AssetService} from '../../endpoint/asset.service';
import {ActionMode, DefaultNotify, Toolkit2} from '@angular-boot/util';
import {AssetDto} from '../../model/dto/assetDto';
import set = Reflect.set;
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

declare var $: any;

@Component({
    selector: 'app-part-list-for-asset',
    templateUrl: './part-list-for-asset.component.html',
    styleUrls: ['./part-list-for-asset.component.scss']
})
export class PartListForAssetComponent implements OnInit, OnDestroy {

    @Input() assetId: string;
    partList: PartDto.Create[] = [];
    assetParts: PartDto.Create[] = [];
    partIdList: SparePartDTO[] = [];
    selectedPart: PartDto.Create = new PartDto.Create();

    @Input() mode: ActionMode;
    actionMode = ActionMode;
    loading = false;
    toolKit2 = Toolkit2;

    constructor(public partService: PartService,
                public assetService: AssetService) {
        this.selectedPart.id = '-1';
    }

    ngOnInit() {
        // if (this.mode !== this.actionMode.VIEW) {

        this.getAllPart();
        // }
        // if (this.mode === this.actionMode.VIEW) {
        //   this.getPartsByAssetId();
        // }
    }

    getPartsByAssetId() {
        this.assetService.getOneSpareParts({assetId: this.assetId}).pipe(takeUntilDestroyed(this))
            .subscribe((res: any) => {
                this.partIdList = [];
                if (res.sparePartList) {
                    if (res.sparePartList.length) {
                        this.partIdList = res.sparePartList;

                        this.filterPartsList();
                    }
                }
            });
        //
        // this.assetService.getPartsByAssetId({assetId: this.assetId}).pipe(takeUntilDestroyed(this))
        //     .subscribe((res: any) => {
        //         this.partIdList = [];
        //         if (res.parts) {
        //             if (res.parts.length) {
        //                 this.partIdList = res.parts;
        //
        //                 this.filterPartsList();
        //             }
        //         }
        //     });
        //

    }

    getAllPart() {
        this.loading = true;
        this.partService.getAllPrivate().pipe(takeUntilDestroyed(this))
            .subscribe((res: PartDto.Create[]) => {
                this.loading = false;
                if (res && res.length) {
                    this.partList = res;
                    this.getPartsByAssetId();
                }
            }, error => {
                this.loading = false;
            });
    }

    filterPartsList() {
        this.assetParts = [];
        // if (this.partList.length > 0 && this.partIdList.length > 0) {
        for (const item of this.partIdList) {
            if (this.partList.find(part => part.id === item.partId)) {
                const newAsetParts = this.partList.find(part => part.id === item.partId)
                newAsetParts.subSystem = item.subSystem;
                newAsetParts.usedNumber = item.usedNumber;
                this.assetParts.push(newAsetParts);
            }
        }
    }


    updateAssetParts() {

        const dtoList: SparePartDTO[] = [];
        for (const company of this.assetParts) {
            const dto = new SparePartDTO();
            dto.partId = company.id;
            dto.subSystem = company.subSystem;
            dto.usedNumber = company.usedNumber;
            dtoList.push(dto);
        }
        this.assetService.updateSpareParts(dtoList, {assetId: this.assetId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
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
        if (this.selectedPart.id !== '-1' && this.selectedPart.id) {
            for (const item of this.assetParts) {
                if (item.id === this.selectedPart.id) {
                    has = true;
                    break;
                }
            }
            if (!has) {
                const newAssetParts = this.partList.find(part => part.id === this.selectedPart.id);
                newAssetParts.usedNumber = null;
                this.assetParts.push(newAssetParts);
                setTimeout(e => {
                    this.selectedPart = new PartDto.Create();
                }, 10);
            } else {
                DefaultNotify.notifyDanger('قطعه از قبل انتخاب شده', '', NotiConfig.notifyConfig);
            }
            this.partList = this.partList.filter(part => part.id !== this.selectedPart.id);
            // this.selectedPart = new PartDto.Create();
            // $('#propertyList').reset();
        }
    }

    deletePart(id: string) {
        this.partList.push(this.assetParts.find(part => part.id === id));
        this.assetParts = this.assetParts.filter(part => part.id !== id);
    }

    checkSelect(item: PartDto.Create) {
        let has;
        for (const asset of this.assetParts) {
            if (asset.id === item.id) {
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

export class SparePartDTO {
    partId: string;
    subSystem: string;
    usedNumber: number = null;
}
