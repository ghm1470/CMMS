import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActionMode, DefaultNotify, isNullOrUndefined, ModalSize} from '@angular-boot/util';
import {MyPattern} from '../../../../shared/shared/tools/myPattern';
import {PartDto} from '../../../part/model/dto/part';
import {PartWithUsageCountService} from '../../endpoint/part-with-usage-count.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PartService} from '../../../part/endpoint/part.service';
import {takeUntilDestroyed} from '@angular-boot/core';
import {ModalUtil} from '@angular-boot/widgets';
import {PartWithUsageCount} from './model/PartWithUsageCount';
import {DataService} from '../../../../shared/service/data.service';
import {WorkTableDto} from '../../../worktable/model/workTable';
import {WorkOrderRepositoryService} from '../../endpoint/work-order-repository.service';
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

declare var $: any;

@Component({
    selector: 'app-part-with-usage-count',
    templateUrl: './part-with-usage-count.component.html',
    styleUrls: ['./part-with-usage-count.component.scss']
})
export class PartWithUsageCountComponent implements OnInit, OnDestroy {

    @Input() referenceId: string;
    @Input() modeW: ActionMode = ActionMode.ADD;
    @Input() formStatus: string;
    @Input() modeS: ActionMode = ActionMode.ADD;
    partWithUsageCountList: PartWithUsageCount[] = [];
    partWithUsageCount = new PartWithUsageCount(this.referenceId);
    partWithUsageCountCopy = new PartWithUsageCount(this.referenceId);
    selectedIndex: number;
    actionMode = ActionMode;
    mode = ActionMode.ADD;
    myPattern = MyPattern;
    doSave = false;
    partList: PartDto.Create[] = [];
    disabledButton = false;
    showModal = false;
    workOrderAndFormRepository: WorkTableDto.ActivitySampleWorkOrderAndFormRepository;
    MyModalSize = ModalSize;

    constructor(public partWithUsageCountService: PartWithUsageCountService,
                public activatedRoute: ActivatedRoute,
                public partService: PartService,
                public workOrderRepositoryService: WorkOrderRepositoryService,
                public router: Router) {
        this.partWithUsageCount = new PartWithUsageCount(this.referenceId);
    }

    ngOnInit() {
        this.getPartList();
        this.partWithUsageCountService.getPartWithUsageCountListByReferenceId({referenceId: this.referenceId}).pipe(takeUntilDestroyed(this))
            .subscribe((res: PartWithUsageCount[]) => {
                if (res && res.length) {
                    this.partWithUsageCountList = res;

                }
            });
    }

    getPartList() {
        this.partService.getAllPrivate().pipe(takeUntilDestroyed(this)).subscribe((res: PartDto.Create[]) => {
            if (res && res.length) {
                this.partList = res;
            }
        });
    }

    chooseSelectedItemForEdit(item: PartWithUsageCount, i) {
        this.selectedIndex = i;
        this.partWithUsageCount = JSON.parse(JSON.stringify(item));
        this.partWithUsageCountCopy = JSON.parse(JSON.stringify(this.partWithUsageCount));
        this.mode = ActionMode.EDIT;
        this.showModal = true;
        setTimeout(() => {
            ModalUtil.showModal('partWithUsageCountModal');
        }, 50);
    }

    deleteItem(item: PartWithUsageCount) {

//TODO scheduleMaintenanceId درست ارال میشود؟
        this.partWithUsageCountService.delete({
            partWithUsageCountId: item.id,
            scheduleMaintenanceId: this.referenceId
        })
            .pipe(takeUntilDestroyed(this)).subscribe((res) => {
            if (res) {
                this.partWithUsageCountList = this.partWithUsageCountList.filter((e) => {
                    return e.id !== item.id;
                });
                DefaultNotify.notifySuccess('باموفقیت حذف شد', '', NotiConfig.notifyConfig);
            }
        });
        this.partWithUsageCount = new PartWithUsageCount(item.id);
    }

    addPartWithUsageCount() {
        this.partWithUsageCount = new PartWithUsageCount(this.referenceId);
        this.mode = ActionMode.ADD;
        this.showModal = true;
        setTimeout(() => {
            ModalUtil.showModal('partWithUsageCountModal');
        }, 50);

    }

    ngOnDestroy(): void {
    }

    loadingAction = false;

    action(form) {
        this.doSave = true;
        if (this.loadingAction) {
            return;
        }
        if (!this.partWithUsageCount.partName) {
            DefaultNotify.notifyDanger('نوع قطعه را وارد کنید.', '', NotiConfig.notifyConfig);
            return;
        }
        if (form.invalid) {
            DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            return;
        }
        if (JSON.stringify(this.partWithUsageCount) === JSON.stringify(this.partWithUsageCountCopy)) {
            DefaultNotify.notifyDanger('شما تغییری ایجاد نکرده اید', '', NotiConfig.notifyConfig);
            return;
        }
        this.loadingAction = true;
        if (this.mode === ActionMode.ADD) {
            this.partWithUsageCount.forSchedule = true;
            this.partWithUsageCount.id = null;
            this.partWithUsageCountService.create(this.partWithUsageCount)
                .pipe(takeUntilDestroyed(this)).subscribe((res: PartWithUsageCount) => {
                this.loadingAction = false;

                if (res && res.id) {
                    // =================================================================
                    if (this.formStatus === 'pending') {
                        // this.workOrderAndFormRepository.partWithUsageCount = this.partWithUsageCount;
                        // DataService.setWAFRepository(this.workOrderAndFormRepository);
                        if (!isNullOrUndefined(this.workOrderAndFormRepository.id)) {
                            this.workOrderRepositoryService.update(this.workOrderAndFormRepository).pipe(takeUntilDestroyed(this)).subscribe(resTree => {
                                if (resTree) {
                                    DataService.setWAFRepository(this.workOrderAndFormRepository);
                                }
                            });
                        } else if (isNullOrUndefined(this.workOrderAndFormRepository.id)) {
                            this.workOrderRepositoryService.create(this.workOrderAndFormRepository).pipe(takeUntilDestroyed(this)).subscribe(resTow => {
                                if (resTow) {
                                    this.workOrderAndFormRepository.id = resTow;
                                    DataService.setWAFRepository(this.workOrderAndFormRepository);
                                }
                            });
                        }
                    }
                    // =================================================================
                    DefaultNotify.notifySuccess('با موفقیت افزوده شد.', '', NotiConfig.notifyConfig);
                    this.partWithUsageCountList.push(res);
                    ModalUtil.hideModal('partWithUsageCountModal');
                    this.showModal = false;
                    this.partWithUsageCount = new PartWithUsageCount(this.referenceId);
                } else {
                    DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.', '', NotiConfig.notifyConfig);
                }
            }, error => {
                this.loadingAction = false;

            });
        } else if (this.mode === ActionMode.EDIT) {
            this.partWithUsageCount.forSchedule = true;
            this.partWithUsageCountService.update(this.partWithUsageCount, {partWithUsageCountId: this.partWithUsageCount.id})
                .pipe(takeUntilDestroyed(this)).subscribe((res: boolean) => {
                this.loadingAction = false;

                if (res) {
                    // =================================================================
                    if (this.formStatus === 'pending') {
                        // this.workOrderAndFormRepository.partWithUsageCount = this.partWithUsageCount;
                        // DataService.setWAFRepository(this.workOrderAndFormRepository);
                        if (!isNullOrUndefined(this.workOrderAndFormRepository.id)) {
                            this.workOrderRepositoryService.update(this.workOrderAndFormRepository).pipe(takeUntilDestroyed(this)).subscribe(resTree => {
                                if (resTree) {
                                    DataService.setWAFRepository(this.workOrderAndFormRepository);
                                }
                            });
                        } else if (isNullOrUndefined(this.workOrderAndFormRepository.id)) {
                            this.workOrderRepositoryService.create(this.workOrderAndFormRepository).pipe(takeUntilDestroyed(this)).subscribe(resTow => {
                                if (resTow) {
                                    this.workOrderAndFormRepository.id = resTow;
                                    DataService.setWAFRepository(this.workOrderAndFormRepository);
                                }
                            });
                        }
                    }
                    // =================================================================
                    for (const item of this.partWithUsageCountList) {
                        if (item.id === this.partWithUsageCount.id) {
                            item.planedQuantity = this.partWithUsageCount.planedQuantity;
                            item.actualQuantity = this.partWithUsageCount.actualQuantity;
                            item.partId = this.partWithUsageCount.partId;
                            item.partName = this.partWithUsageCount.partName;
                        }
                    }
                    ModalUtil.hideModal('partWithUsageCountModal');
                    this.showModal = false;
                    this.partWithUsageCount = new PartWithUsageCount(this.referenceId);
                    DefaultNotify.notifySuccess('ویرایش با موفقیت انجام شد.', '', NotiConfig.notifyConfig);
                } else {
                    DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.', '', NotiConfig.notifyConfig);
                }
            }, error => {
                this.loadingAction = false;
            });
        }
    }

    cancelModal() {
        ModalUtil.hideModal('partWithUsageCountModal');
        this.showModal = false;
    }

    // changePart() {
    //   // this.partWithUsageCount.partName = this.partList.find(part => part.id === this.partWithUsageCount.partId).name;
    // }

    receiveSelectedPart(event: PartDto.GetAll) {
        this.partWithUsageCount.partId = event.partId;
        this.partWithUsageCount.id = event.partId;
        this.partWithUsageCount.partName = event.partName;
        this.partWithUsageCount.partCode = '#' + event.partCode;
    }

    openViewPartModal() {
        if (this.mode === this.actionMode.ADD) {

            ModalUtil.showModal('viewPartForPartWhitUsageCount');
        }
    }

    showModalBody = true;

    onCloseModal() {
        this.doSave = false;
        this.showModalBody = false;
        this.partWithUsageCount = new PartWithUsageCount(this.referenceId);
        setTimeout(e => {
            this.showModalBody = true;
        }, 10);

    }

    onShowModal() {
        this.doSave = false;
        this.showModalBody = false;
        setTimeout(e => {
            this.showModalBody = true;
        }, 10);

    }

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
}
