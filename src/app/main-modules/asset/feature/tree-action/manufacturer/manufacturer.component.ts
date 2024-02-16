import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ActionMode, DefaultNotify} from "@angular-boot/util";
import {AssetService} from "../../../endpoint/asset.service";
import {NotiConfig} from "../../../../../shared/tools/notifyConfig";

@Component({
    selector: 'app-manufacturer',
    templateUrl: './manufacturer.component.html',
    styleUrls: ['./manufacturer.component.scss']
})
export class ManufacturerComponent implements OnInit {
    @Input() assetId: string;
    htmlForm: FormGroup;
    @Input() actionMode: ActionMode;
    ActionMode = ActionMode;
    loadingAction = false;

    constructor(private assetService: AssetService) {
    }


    ngOnInit(): void {
        this.creatForm();

    }

    creatForm() {
        this.htmlForm = new FormGroup({
            manufacturerCompanyName: new FormControl(), //   نام شرکت سازنده
            manufacturerCompanyPhone: new FormControl(), //   تلفن شرکت سازنده
            manufacturerCompanyEmail: new FormControl(), //   ایمیل شرکت سازنده
            manufacturerCompanyAddress: new FormControl(), //   آدرس شرکت سازنده

            sellerCompanyName: new FormControl(), //   نام شرکت فروشنده
            sellerCompanyPhone: new FormControl(), //   تلفن شرکت فروشنده
            sellerCompanyEmail: new FormControl(), //   ایمیل شرکت فروشنده
            sellerCompanyAddress: new FormControl(), //   آدرس شرکت فروشنده
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
        this.assetService.getOneManufacturer({assetId: this.assetId}).subscribe((res: GetOneDto) => {
            if (res.manufacturerCompany) {
                this.htmlForm.patchValue({
                    manufacturerCompanyName: res.manufacturerCompany.name,
                    manufacturerCompanyPhone: res.manufacturerCompany.phone,
                    manufacturerCompanyEmail: res.manufacturerCompany.email,
                    manufacturerCompanyAddress: res.manufacturerCompany.address,
                });
            }
            if (res.sellerCompany) {
                this.htmlForm.patchValue({
                    sellerCompanyName: res.sellerCompany.name,
                    sellerCompanyPhone: res.sellerCompany.phone,
                    sellerCompanyEmail: res.sellerCompany.email,
                    sellerCompanyAddress: res.sellerCompany.address,

                });
            }

        });
    }

    onSubmit() {
        const ManufacturerCompany = new Company();
        ManufacturerCompany.name = this.htmlForm.controls.manufacturerCompanyName.value;
        ManufacturerCompany.phone = this.htmlForm.controls.manufacturerCompanyPhone.value;
        ManufacturerCompany.email = this.htmlForm.controls.manufacturerCompanyEmail.value;
        ManufacturerCompany.address = this.htmlForm.controls.manufacturerCompanyAddress.value;
        const sellerCompany = new Company();
        sellerCompany.name = this.htmlForm.controls.sellerCompanyName.value;
        sellerCompany.phone = this.htmlForm.controls.sellerCompanyPhone.value;
        sellerCompany.email = this.htmlForm.controls.sellerCompanyEmail.value;
        sellerCompany.address = this.htmlForm.controls.sellerCompanyAddress.value;

        const dto = new UpdateDto();

        dto.assetId = this.assetId;
        dto.manufacturerCompany = ManufacturerCompany;
        dto.sellerCompany = sellerCompany;
        this.loadingAction = true;
        this.assetService.updateManufacturer(dto, {assetId: this.assetId}).subscribe((res: boolean) => {
            this.loadingAction = false;
            if (res) {
                DefaultNotify.notifySuccess('  با موفقیت ویرایش شد.  ', '', NotiConfig.notifyConfig);
            }
        }, error => {
            this.loadingAction = false;
        });

    }
}

export class Company {
    name: string;
    address: string;
    phone: string;
    email: string;
}

export class GetOneDto {
    manufacturerCompany: Company;  //شرکت سازنده
    sellerCompany: Company;//شرکت فروشنده
}

export class UpdateDto {
    assetId: string;
    manufacturerCompany: Company;  //شرکت سازنده
    sellerCompany: Company;//شرکت فروشنده
}
