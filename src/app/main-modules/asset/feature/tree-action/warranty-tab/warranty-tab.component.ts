import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {ActionMode, DefaultNotify, isNullOrUndefined, Toolkit2} from "@angular-boot/util";
import {FormControl, FormGroup} from "@angular/forms";
import {AssetService} from "../../../endpoint/asset.service";
import {Moment} from "../../../../../shared/shared/tools/date/moment";
import {NotiConfig} from "../../../../../shared/tools/notifyConfig";

declare var $: any;

@Component({
    selector: 'app-warranty-tab',
    templateUrl: './warranty-tab.component.html',
    styleUrls: ['./warranty-tab.component.scss']
})
export class WarrantyTabComponent implements OnInit, AfterViewInit {
    @Input() assetId: string;
    @Input() warrantyDate: any;
    @Input() mode: ActionMode;
    actionMode = ActionMode;
    warranty = false;
    htmlForm: FormGroup;
    myMoment = Moment;

    constructor(private assetService: AssetService) {
    }


    ngOnInit(): void {
        this.warrantyDate ? this.warranty = true : this.warranty = false;
        this.creatForm();
        this.changeWarranty();

    }

    creatForm() {
        //     motorcyclePlaque: new FormControl({ value: null, disabled: true }),
        this.htmlForm = new FormGroup({
            warrantyDate: new FormControl(), // تاریخ گارانتی

        });

    }

    inputWarrantyDate: any;

    setDateJquery() {
        setTimeout(t => {
            $('#inputWarrantyDate').azPersianDateTimePicker({
                Placement: 'bottom', // default is 'bottom'
                Trigger: 'click', // default is 'focus',
                enableTimePicker: false, // default is true,
                TargetSelector: '', // default is empty,
                GroupId: '', // default is empty,
                ToDate: false, // default is false,
                FromDate: false, // default is false,
                targetTextSelector: $('#inputWarrantyDate'),
                textFormat: 'yyyy/MM/dd ',
            })
                .on('change', (e) => {
                    const val = $(e.currentTarget).val();
                    this.inputWarrantyDate = val;
                });

        }, 50);
    }

    loadingAction = false;

    public onSubmit() {
        let warrantyDate = null;
        if (this.inputWarrantyDate) {
            warrantyDate = new Date(this.myMoment.convertJaliliToIsoDate(this.inputWarrantyDate));
        }
        const dto = {
            id: this.assetId,
            warrantyDate
        };
        this.loadingAction = true;
        this.assetService.updateGuaranty(dto).subscribe((res: boolean) => {
            this.loadingAction = false;
            if (res) {
                DefaultNotify.notifySuccess('  با موفقیت ویرایش شد.  ', '', NotiConfig.notifyConfig);

            }

        }, error => {
            this.loadingAction = false;
        });
    }

    changeWarranty() {
        if (this.warranty) {
            this.htmlForm.controls.warrantyDate.enable();
        } else {
            this.htmlForm.reset();
            this.inputWarrantyDate = null;
            this.htmlForm.controls.warrantyDate.disable();

        }
    }

    public ngAfterViewInit(): void {
        this.setDateJquery();

    }
}
