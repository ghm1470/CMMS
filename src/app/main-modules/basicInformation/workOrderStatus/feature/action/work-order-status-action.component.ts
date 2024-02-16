import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionMode, DefaultNotify, EnumHandle} from '@angular-boot/util';
import {WorkOrderStatus} from '../../model/dto/workOrderStatus';
import {MyPattern} from '../../../../../shared/shared/tools/myPattern';
import {WorkOrderStatusService} from '../../endpoint/work-order-status.service';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {WorkOrderStatusEnum} from '../../model/helper/workOrderStatusEnum';
import {isNullOrUndefined} from 'util';
import {takeUntilDestroyed} from '@angular-boot/core';
import {NotiConfig} from "../../../../../shared/tools/notifyConfig";

@Component({
    selector: 'app-work-order-status-action',
    templateUrl: './work-order-status-action.component.html',
    styleUrls: ['./work-order-status-action.component.scss']
})
export class WorkOrderStatusActionComponent implements OnInit, OnDestroy {

    mode: ActionMode = ActionMode.ADD;
    actionMode = ActionMode;
    workOrderStatus = new WorkOrderStatus();
    workOrderStatusCopy = new WorkOrderStatus();
    workOrderStatusId: string;
    myPattern = MyPattern;
    statusList: any[] = [];
    doSave = false;
    disabledButton = false;
    loading = false;

    constructor(
        public location: Location,
        public workOrderStatusService: WorkOrderStatusService,
        private activatedRoute: ActivatedRoute,
    ) {
        this.statusList = EnumHandle.getAsValueTitleList(WorkOrderStatusEnum);
        // this.workOrderStatus.status = WorkOrderStatusEnum.DRAFT;
        this.mode = this.activatedRoute.snapshot.queryParams.mode;
        this.workOrderStatusId = this.activatedRoute.snapshot.queryParams.workOrderStatusId;
    }

    ngOnInit() {
        if (this.mode === ActionMode.EDIT) {
            if (!isNullOrUndefined(this.workOrderStatusId)) {
                this.getOne();
            }
        }
    }

    getOne() {
        this.workOrderStatusService.getOne({id: this.workOrderStatusId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: WorkOrderStatus) => {
            if (res) {
                this.workOrderStatus = res;
                this.workOrderStatusCopy = JSON.parse(JSON.stringify(res));
            }
        });
    }

    checkIfNameExists(form) {
        if (this.loading) {
            return;
        }
        if (JSON.stringify(this.workOrderStatus) === JSON.stringify(this.workOrderStatusCopy) && this.mode === ActionMode.EDIT) {
            DefaultNotify.notifyDanger('شما هیچ ویرایشی انجام نداده اید', '', NotiConfig.notifyConfig);
            return;
        }
        this.disabledButton = true;
        this.doSave = true;
        if (form.invalid) {
            DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            this.disabledButton = false;
            return;
        }
        if (this.workOrderStatus.name) {
            // DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.');
            // this.disabledButton = false;
            this.workOrderStatus.name = this.workOrderStatus.name.trim();
        }
        if (!this.workOrderStatus.name) {
            DefaultNotify.notifyDanger('عنوان را وارد کنید.', '', NotiConfig.notifyConfig);
            this.disabledButton = false;
            return;
        }
        this.loading = true;
        this.workOrderStatusService.checkIfNameExists({name: this.workOrderStatus.name}).subscribe((res: boolean) => {
            if (res) {
                this.loading = false;
                DefaultNotify.notifyDanger('عنوان واژه وارد شده موجود است.', '', NotiConfig.notifyConfig);
                return;
            } else {
                this.action(form);
            }
        }, error => {
            this.loading = false;

        });
    }

    action(form) {

        if (this.mode === ActionMode.ADD) {
            this.workOrderStatusService.create(this.workOrderStatus)
                .pipe(takeUntilDestroyed(this)).subscribe(res => {
                this.loading = false;

                if (res) {
                    DefaultNotify.notifySuccess('با موفقیت افزوده شد.', '', NotiConfig.notifyConfig);
                    form.reset();
                    this.cancel();
                }
            }, error => {
                this.loading = false;
                if (error.status === 302) {
                    this.disabledButton = false;
                    DefaultNotify.notifyDanger('مقدار عنوان تکراری است.', '', NotiConfig.notifyConfig);
                }
            });
        } else if (this.mode === ActionMode.EDIT) {
            if (JSON.stringify(this.workOrderStatusCopy) === JSON.stringify(this.workOrderStatus)) {
                DefaultNotify.notifyDanger('شما هیچ ویرایشی انجام نداده اید', '', NotiConfig.notifyConfig);
                this.loading = false;
            } else {
                this.workOrderStatusService.update(this.workOrderStatus, {workOrderStatusId: this.workOrderStatusId})
                    .pipe(takeUntilDestroyed(this)).subscribe(res => {
                    if (res) {
                        DefaultNotify.notifySuccess('ویرایش با موفقیت انجام شد.', '', NotiConfig.notifyConfig);
                        this.cancel();
                    }
                }, error => {
                    if (error.status === 302) {
                        this.disabledButton = false;
                        DefaultNotify.notifyDanger('مقدار عنوان تکراری است.', '', NotiConfig.notifyConfig);
                        this.workOrderStatus.name = '';
                    }
                });
            }
        }
    }

    cancel() {
        this.location.back();
    }

    ngOnDestroy(): void {
    }

}
