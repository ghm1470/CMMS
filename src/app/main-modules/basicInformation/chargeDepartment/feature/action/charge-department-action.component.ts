import {Component, OnDestroy, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {ActionMode, DefaultNotify, Toolkit2} from '@angular-boot/util';
import {takeUntilDestroyed} from '@angular-boot/core';
import {ChargeDepartmentService} from '../../endpoint/charge-department.service';
import {ChargeDepartment} from '../../model/charge-department';
import {isNullOrUndefined} from 'util';
import {ActivatedRoute} from '@angular/router';
import {MyPattern} from '../../../../../shared/shared/tools/myPattern';
import {NotiConfig} from "../../../../../shared/tools/notifyConfig";

declare var $: any;

@Component({
    selector: 'app-responsible-department-action',
    templateUrl: './charge-department-action.component.html',
    styleUrls: ['./charge-department-action.component.scss']
})
export class ChargeDepartmentActionComponent implements OnInit, OnDestroy {
    mode: ActionMode = ActionMode.ADD;
    actionMode = ActionMode;
    responsible = new ChargeDepartment();
    responsibleCopy = new ChargeDepartment();
    myPattern = MyPattern;
    departmentId: string;
    disabledButton = false;
    loading = false;
    doSave = false;

    constructor(public location: Location,
                private departmentService: ChargeDepartmentService,
                private activatedRoute: ActivatedRoute) {
        this.departmentId = this.activatedRoute.snapshot.queryParams.departmentId;
        this.mode = this.activatedRoute.snapshot.queryParams.mode;

    }

    ngOnInit() {
        if (this.mode === ActionMode.EDIT) {
            if (!isNullOrUndefined(this.departmentId)) {

                this.getOne();
            }
        }
    }

    stringLength(value, id) {
        if (!isNullOrUndefined(value)) {
            value = value.trim();
            if (value.length === 0) {
                $('#' + id).addClass('is-invalid ').removeClass('is-valid ');
                $('#' + id).addClass('ng-invalid').removeClass('ng-valid');
                $('form').invalid();
                return false;
            } else {

                $('#' + id).addClass('is-valid').removeClass('is-invalid');
                $('#' + id).addClass('ng-valid').removeClass('ng-invalid');
                // $('form').valid();
                return true;

            }
        }
    }

    getOne() {
        this.departmentService.getOne({chargeDepartmentId: this.departmentId})
            .pipe(takeUntilDestroyed(this)).subscribe((res) => {
            if (res) {
                this.responsible = new ChargeDepartment();
                this.responsible = res.data;
                this.responsible.code = Toolkit2.Common.Fa2En(this.responsible.code);
                this.responsibleCopy = JSON.parse(JSON.stringify(res.data));
                this.responsibleCopy.code = Toolkit2.Common.Fa2En(this.responsibleCopy.code);
            }
        });

    }

    action(form) {


        if (!this.responsible.title || !this.responsible.code) {
            DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            this.disabledButton = false;
            this.loading = false;

            return;
        }
        if (this.mode === ActionMode.ADD) {
            this.departmentService.create(this.responsible)
                .pipe(takeUntilDestroyed(this)).subscribe(res => {
                this.loading = false;
                if (res) {
                    DefaultNotify.notifySuccess('با موفقیت افزوده شد.', '', NotiConfig.notifyConfig);
                    form.reset();
                    this.cancel();
                }
            }, error => {
                this.loading = false;
                this.disabledButton = false;

            });
        } else if (this.mode === ActionMode.EDIT) {
            if (JSON.stringify(this.responsibleCopy) === JSON.stringify(this.responsible)) {
                DefaultNotify.notifyDanger('شما هیچ ویرایشی انجام نداده اید', '', NotiConfig.notifyConfig);
                this.disabledButton = false;
                this.loading = false;

            } else {
                this.departmentService.update(this.responsible, {chargeDepartmentId: this.responsible.id})
                    .pipe(takeUntilDestroyed(this)).subscribe(res => {
                    this.loading = false;
                    if (res) {
                        DefaultNotify.notifySuccess('ویرایش با موفقیت انجام شد.', '', NotiConfig.notifyConfig);
                        this.cancel();
                    }
                }, error => {
                    this.loading = false;
                    this.disabledButton = false;

                });

            }
        }

    }

    cancel() {
        this.location.back();
    }

    ngOnDestroy(): void {
    }

    existCode = false;

    checkUniqueCode(form) {
        if (this.loading === true) {
            return;
        }
        if (JSON.stringify(this.responsible) === JSON.stringify(this.responsibleCopy) && this.mode === ActionMode.EDIT) {
            DefaultNotify.notifyDanger('شما هیچ ویرایشی انجام نداده اید', '', NotiConfig.notifyConfig);
            return;
        }
        this.loading = true;
        this.doSave = true;
        this.disabledButton = true;
        if (this.existCode) {
            DefaultNotify.notifyDanger('کد وارد شده تکراری است.', '', NotiConfig.notifyConfig);
            this.disabledButton = false;
            this.loading = false;
            return;
        }
        if (form.invalid) {
            DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            this.disabledButton = false;
            this.loading = false;

            return;
        }
        this.responsible.code = Toolkit2.Common.Fa2En(this.responsible.code).trim();
        this.responsible.title = this.responsible.title.trim();
        if (!this.responsible.code || form.invalid) {
            return;
        }
        this.existCode = false;
        this.doSave = true;
        this.departmentService.checkUniqueCode({code: this.responsible.code}).subscribe(res => {
            if (res === true) {
                DefaultNotify.notifyDanger('کد  وارد شده موجود است.', '', NotiConfig.notifyConfig);
                // this.responsible.code = null;
                this.existCode = true;
                this.loading = false;
                // this.responsible.code = '';
                this.disabledButton = true;
            } else {
                this.existCode = false;
                this.disabledButton = false;
                this.action(form);
            }

        });

    }
}
