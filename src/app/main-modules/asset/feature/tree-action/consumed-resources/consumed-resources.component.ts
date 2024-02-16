import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ActionMode, DefaultNotify} from "@angular-boot/util";
import {NotiConfig} from "../../../../../shared/tools/notifyConfig";
import {AssetService} from "../../../endpoint/asset.service";

@Component({
    selector: 'app-consumed-resources',
    templateUrl: './consumed-resources.component.html',
    styleUrls: ['./consumed-resources.component.scss']
})
export class ConsumedResourcesComponent implements OnInit {
    @Input() assetId: string;
    htmlForm: FormGroup;
    @Input() actionMode: ActionMode;
    ActionMode = ActionMode;
    loadingAction = false;
    consumedResourcesKeyValueList: ConsumedResourcesKeyValue[] = [];

    constructor(private assetService: AssetService) {
    }

    ngOnInit(): void {
        this.creatForm();

    }

    creatForm() {
        this.htmlForm = new FormGroup({
            fossilFuel: new FormControl(), // سوخت فسیلی
            electricity: new FormControl(), // برق
            water: new FormControl(), // آب
            compressedAir: new FormControl(), // هوای فشرده
            key: new FormControl(), //  غیره مشخصه
            value: new FormControl(), //غیره مقدار
        });
        if (this.actionMode === ActionMode.VIEW) {
            this.getOne();
            this.htmlForm.disable();
        }
        if (this.actionMode === ActionMode.EDIT) {
            this.getOne();
        }
    }

    getOne() {
        this.assetService.getOneConsumedResources({assetId: this.assetId}).subscribe((res: GetOneDto) => {
            this.htmlForm.patchValue({
                compressedAir: res.compressedAir,
                electricity: res.electricity,
                fossilFuel: res.fossilFuel,
                water: res.water,
            });
            if (res.consumedResourcesKeyValueList) {
                this.consumedResourcesKeyValueList = res.consumedResourcesKeyValueList;
            }
        });
    }

    onSubmit() {
        if (this.loadingAction) {
            return;
        }
        const dto = new UpdateDto();
        dto.compressedAir = this.htmlForm.controls.compressedAir.value;
        dto.electricity = this.htmlForm.controls.electricity.value;
        dto.fossilFuel = this.htmlForm.controls.fossilFuel.value;
        dto.water = this.htmlForm.controls.water.value;
        dto.consumedResourcesKeyValueList = this.consumedResourcesKeyValueList;
        this.loadingAction = true;
        this.assetService.updateConsumedResources(dto, {assetId: this.assetId}).subscribe((res: boolean) => {
            this.loadingAction = false;
            if (res) {
                DefaultNotify.notifySuccess('  با موفقیت ویرایش شد.  ', '', NotiConfig.notifyConfig);
            }
        }, error => {
            this.loadingAction = false;
        });
    }

    public addItem() {
        const dto = new ConsumedResourcesKeyValue();
        dto.key = this.htmlForm.controls.key.value;
        dto.value = this.htmlForm.controls.value.value;
        if (!dto.key) {
            DefaultNotify.notifyDanger('   مشخصه وارد شود.  ', '', NotiConfig.notifyConfig);
            return;
        }
        if (!dto.value) {
            DefaultNotify.notifyDanger('   مقدار وارد شود.  ', '', NotiConfig.notifyConfig);
            return;
        }
        //
        // const indexKey = this.consumedResourcesKeyValueList.findIndex(e => e.key === dto.key);
        // if (indexKey !== -1) {
        //     DefaultNotify.notifyDanger('   مشخصه وارد شده تکراری است.  ', '', NotiConfig.notifyConfig);
        //     return;
        // }
        // const indexValue = this.consumedResourcesKeyValueList.findIndex(e => e.value === dto.value);
        // if (indexValue !== -1) {
        //     DefaultNotify.notifyDanger('   مقدار وارد شده تکراری است.  ', '', NotiConfig.notifyConfig);
        //     return;
        // }

        this.consumedResourcesKeyValueList.push(dto);
        this.htmlForm.controls.key.reset();
        this.htmlForm.controls.value.reset();

    }

    public deleteItem(item: ConsumedResourcesKeyValue, i: number) {
        this.consumedResourcesKeyValueList.splice(i, 1);

    }


}

export class ConsumedResourcesKeyValue {
    key: string;
    value: string;
}

export class GetOneDto {
    fossilFuel: string;//سوخت فسیلی
    electricity: string; //برق
    water: string; //آب
    compressedAir: string;  //هوای فشرده
    consumedResourcesKeyValueList: ConsumedResourcesKeyValue[]; //غیره
}

export class UpdateDto {
    fossilFuel: string;//سوخت فسیلی
    electricity: string; //برق
    water: string; //آب
    compressedAir: string;  //هوای فشرده
    consumedResourcesKeyValueList: ConsumedResourcesKeyValue[]; //غیره
}
