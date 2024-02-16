import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ActionMode, DefaultNotify} from '@angular-boot/util';
import {NotiConfig} from "../../../../../shared/tools/notifyConfig";
import {AssetService} from "../../../endpoint/asset.service";

@Component({
    selector: 'app-technical-information',
    templateUrl: './technical-information.component.html',
    styleUrls: ['./technical-information.component.scss']
})
export class TechnicalInformationComponent implements OnInit {
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
            key: new FormControl(), //   مشخصه
            value: new FormControl(), // مقدار
            unit: new FormControl(), // واحد
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
        this.assetService.getOneTechnicalInformation({assetId: this.assetId}).subscribe((res:any) => {
            this.consumedResourcesKeyValueList = res.technicalInformationKeyValueList;
        });
    }

    onSubmit() {
        if (this.loadingAction) {
            return;
        }
        this.loadingAction = true;
        const dto = {
            assetId: this.assetId,
            technicalInformationKeyValueList: this.consumedResourcesKeyValueList
        }
        this.assetService.updateTechnicalInformation(dto).subscribe((res: boolean) => {
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
        dto.unit = this.htmlForm.controls.unit.value;
        if (!dto.key) {
            DefaultNotify.notifyDanger('   مشخصه وارد شود.  ', '', NotiConfig.notifyConfig);
            return;
        }
        if (!dto.value) {
            DefaultNotify.notifyDanger('   مقدار وارد شود.  ', '', NotiConfig.notifyConfig);
            return;
        }
        if (!dto.unit) {
            DefaultNotify.notifyDanger('   واحد وارد شود.  ', '', NotiConfig.notifyConfig);
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
        this.htmlForm.controls.unit.reset();

    }

    public deleteItem(item: ConsumedResourcesKeyValue, i: number) {
        this.consumedResourcesKeyValueList.splice(i, 1);

    }

}

export class ConsumedResourcesKeyValue {
    key: string;
    value: string;
    unit: string;
}

