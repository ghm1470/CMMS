import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionMode, DefaultNotify, Toolkit2} from '@angular-boot/util';
import {CacheService, takeUntilDestroyed} from '@angular-boot/core';
import {BillOfMaterialsGroupsService} from '../../endpoint/bill-of-materials-groups.service';
import {BOM} from '../../model/bom';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {isNullOrUndefined} from 'util';
import {MyPattern} from "../../../../shared/shared/tools/myPattern";
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

declare var $: any;

@Component({
    selector: 'app-bill-of-materials-groups-action',
    templateUrl: './bill-of-materials-groups-action.component.html',
    styleUrls: ['./bill-of-materials-groups-action.component.scss']
})
export class BillOfMaterialsGroupsActionComponent implements OnInit, OnDestroy {
    actionMode = ActionMode;
    mode: ActionMode = ActionMode.ADD;
    BOM = new BOM.Create();
    BOMCopy = new BOM.Create();
    doSave = false;
    valid = false;
    BOMId: string;
    disabledButton = false;
    myPattern = MyPattern;


    checkBOMCodeLoading = false;
    partListB = false;
    assetListB = false;

    constructor(public billOfMaterialsGroupsService: BillOfMaterialsGroupsService,
                public location: Location,
                public router: Router,
                private cacheService: CacheService,
                private activatedRoute: ActivatedRoute) {
        this.mode = this.activatedRoute.snapshot.queryParams.mode;
        this.BOMId = this.activatedRoute.snapshot.queryParams.entityId;
    }

    ngOnInit() {
        if (this.mode === ActionMode.EDIT) {
            if (!isNullOrUndefined(this.BOMId)) {
                this.valid = true;
                this.getOne();
            }
        }
        if (this.mode === ActionMode.VIEW) {
            if (!isNullOrUndefined(this.BOMId)) {
                this.valid = true;
                this.getOne();
                $('.input-c').attr('disabled', 'disabled');
            }
        }
    }

    ngOnDestroy(): void {
    }

    getOne() {
        this.billOfMaterialsGroupsService.getOneBOM({BOMId: this.BOMId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: BOM.Create) => {
            if (res) {
                // ===========================================>
                this.BOM = res;
                this.BOMCopy = JSON.parse(JSON.stringify(res));
            }
        });

    }

    action(form) {

        if (this.mode === this.actionMode.ADD) {
            this.billOfMaterialsGroupsService.createBOM(this.BOM)
                .pipe(takeUntilDestroyed(this)).subscribe((res) => {
                this.loading = false;
                if (res) {
                    this.BOM.id = res;
                    this.BOMId = res;
                    this.router.navigate([], {
                        queryParams: {mode: 'EDIT', BOMId: res},
                        relativeTo: this.activatedRoute
                    });
                    DefaultNotify.notifySuccess('با موفقیت افزوده شد.', '', NotiConfig.notifyConfig);
                    this.mode = ActionMode.EDIT;
                    this.valid = true;
                    this.BOMCopy = JSON.parse(JSON.stringify(this.BOM));
                }
            }, error => {
                this.loading = false;

            });
        } else if (this.mode === this.actionMode.EDIT) {
            this.BOM.id = this.BOMId;
            this.disabledButton = true;
            this.billOfMaterialsGroupsService.updateBOM(this.BOM)
                .pipe(takeUntilDestroyed(this)).subscribe((res: boolean) => {
                this.loading = false;
                if (res) {
                    this.disabledButton = false;
                    DefaultNotify.notifySuccess('ویرایش با موفقیت انجام شد.', '', NotiConfig.notifyConfig);
                    this.valid = true;
                    this.BOMCopy = JSON.parse(JSON.stringify(this.BOM));
                }
            }, error => {
                this.loading = false;
            });
        }
    }

    cancel() {
        this.router.navigateByUrl('/panel/billOfMaterialsGroups?page=0&size=10');

    }

    loading = false;

    checkBomCode2(form) {
        this.doSave = true;
        if (form.invalid) {
            DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            return;
        }

        // if (this.assetTemplate === this.assetTemplateCopy) {
        if (JSON.stringify(this.BOM) === JSON.stringify(this.BOMCopy)) {
            DefaultNotify.notifyDanger(' تغییر اعمال نشده  .', '', NotiConfig.notifyConfig);
            return;
        }
        this.loading = true;
        if (this.BOM.code === this.BOMCopy.code && this.mode === ActionMode.EDIT) {
            this.action(form);
        } else {
            this.billOfMaterialsGroupsService.checkBOMCode({BOMCode: this.BOM.code}).subscribe((res: boolean) => {
                if (res) {
                    DefaultNotify.notifyDanger('کد وارد شده تکراری است.', '', NotiConfig.notifyConfig);
                    this.loading = false;
                } else {
                    this.action(form);
                }
            });
        }
    }

    checkBomCode(form) {
        this.doSave = true;
        if (this.loading) {
            return;
        }
        this.loading = true;
        if (form.invalid) {
            DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            this.disabledButton = false;
            this.loading = false;
            return;
        }
        if (JSON.stringify(this.BOM) === JSON.stringify(this.BOMCopy) && this.mode === ActionMode.EDIT) {
            DefaultNotify.notifyDanger('شما هیچ ویرایشی انجام نداده اید', '', NotiConfig.notifyConfig);
            // this.loading = false;
            this.disabledButton = false;
            this.loading = false;

        } else {
            this.checkBOMCodeLoading = true;
            this.disabledButton = true;
            this.BOM.code = Toolkit2.Common.Fa2En(this.BOM.code);
            if ((!isNullOrUndefined(this.BOMCopy.bomGroupName) &&
                this.BOM.bomGroupName !== this.BOMCopy.bomGroupName) || isNullOrUndefined(this.BOMCopy.bomGroupName)) {
                this.billOfMaterialsGroupsService.checkBOMCode({BOMCode: this.BOM.code}).subscribe(res => {
                    if (res === true) {
                        DefaultNotify.notifyDanger('کد وارد شده تکراری می باشد.', '', NotiConfig.notifyConfig);
                        if (!isNullOrUndefined(this.BOM.id)) {
                            this.BOM.code = this.BOMCopy.code;
                        } else {
                            $('#BOMCode').addClass('is-invalid');
                        }
                        this.disabledButton = false;
                        this.checkBOMCodeLoading = false;
                        this.loading = false;
                        return;
                    } else {
                        $('#BOMCode').removeClass('is-invalid');
                        this.action(form);
                        this.checkBOMCodeLoading = false;
                    }
                }, error => {
                    this.loading = false;
                    this.disabledButton = false;
                    this.checkBOMCodeLoading = false;
                });
            } else {
                this.action(form);
                this.checkBOMCodeLoading = false;
            }
        }
    }

    next() {
        this.partListB = true;
        setTimeout(() => {
            $('#BomCreate').carousel('next');
        }, 100);
    }

    prev() {
        $('#BomCreate').carousel('prev');
    }
}
