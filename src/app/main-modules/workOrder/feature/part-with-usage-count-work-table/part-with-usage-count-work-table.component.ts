import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {ActionMode, DefaultNotify, ModalSize, Toolkit2} from '@angular-boot/util';
import {PartWithUsageCount} from '../part-with-usage-count/model/PartWithUsageCount';
import {MyPattern} from '../../../../shared/shared/tools/myPattern';
import {PartDto} from '../../../part/model/dto/part';
import {PartWithUsageCountService} from '../../endpoint/part-with-usage-count.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PartService} from '../../../part/endpoint/part.service';
import {WorkOrderRepositoryService} from '../../endpoint/work-order-repository.service';
import {takeUntilDestroyed} from '@angular-boot/core';
import {ModalUtil} from '@angular-boot/widgets';
import {DataService} from '../../../../shared/service/data.service';
import {SendInformationNumberOfTabs} from '../../../worktable/feature/show-the-trend-here/show-the-form-of-previous-steps/show-the-form-of-previous-steps.component';
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

@Component({
    selector: 'app-part-with-usage-count-work-table',
    templateUrl: './part-with-usage-count-work-table.component.html',
    styleUrls: ['./part-with-usage-count-work-table.component.scss']
})
export class PartWithUsageCountWorkTableComponent implements OnInit, OnDestroy, OnChanges {
    @Input() staticFormsIdList: string [] = [];
    @Input() workOrderId: string;
    @Input() activityInstanceId: string;
    @Input() activityLevelId: string;
    @Input() sendInformationNumberOfTabs = new SendInformationNumberOfTabs();
    @Input() numberOfParticipation: number;
    // @Input()  partsDTO: PartWithUsageCount[] = [];
    @Input() isView: boolean;
    @Output() nextCarousel = new EventEmitter<boolean>();
    existedAlreadySaveForWAR: boolean;
    partWithUsageCountList: PartWithUsageCount[] = [];
    partWithUsageCount: PartWithUsageCount;
    selectedIndex: number;
    actionMode = ActionMode;
    mode = ActionMode.ADD;
    myPattern = MyPattern;
    doSave = false;
    partList: PartDto.Create[] = [];
    disabledButton = false;
    showModal = false;
    MyModalSize = ModalSize;

    // workOrderAndFormRepository: WorkTableDto.ActivitySampleWorkOrderAndFormRepository;

    constructor(public partWithUsageCountService: PartWithUsageCountService,
                public activatedRoute: ActivatedRoute,
                public partService: PartService,
                public workOrderRepositoryService: WorkOrderRepositoryService,
                public router: Router) {
        this.partWithUsageCount = new PartWithUsageCount(this.workOrderId);
    }

    enableItems = false;

    ngOnInit() {
        if (this.staticFormsIdList) {
            if (this.staticFormsIdList.some(id => id === 'workOrderPart')) {
                this.enableItems = true;
            }
        }
        DataService.getExistedAlreadySaveForWAR.subscribe((res: boolean) => {
            if (res) {
                this.existedAlreadySaveForWAR = res;
            }
        });
        this.getPartWithUsageCountOfWorkOrder();
        // this.getPartWithUsageCount();
    }

    loading = false;

    getPartWithUsageCountOfWorkOrder() {
        this.loading = true;

        this.partWithUsageCountService.getPartWithUsageCountOfWorkOrder({workOrderId: this.workOrderId}).pipe(takeUntilDestroyed(this))
            .subscribe((res: PartWithUsageCount[]) => {
                this.loading = false;

                if (res) {
                    this.partWithUsageCountList = res;
                }
            }, error => {
                this.loading = false;

            });
    }

    // getPartWithUsageCount() {
    //     this.partWithUsageCountService.getPartWithUsageCountListByReferenceId(
    //         {referenceId: this.workOrderId}).pipe(takeUntilDestroyed(this)).subscribe((res: PartDto.Create[]) => {
    //         if (res && res.length) {
    //             this.partList = res;
    //         }
    //     });
    // }

    // getPartList() {
    //     this.partService.getAllPrivate().pipe(takeUntilDestroyed(this)).subscribe((res: PartDto.Create[]) => {
    //         if (res && res.length) {
    //             this.partList = res;
    //         }
    //     });
    // }

    chooseSelectedItemForEdit(item: PartWithUsageCount, i) {
        if (item.forSchedule) {
            DefaultNotify.notifyDanger('این قطعه از سمت زمانبندی ایجاد گردیده و  قابل ویرایش نمی باشد.', '', NotiConfig.notifyConfig);
            return;
        }
        this.selectedIndex = i;
        this.partWithUsageCount = JSON.parse(JSON.stringify(item));
        this.mode = ActionMode.EDIT;
        this.showModal = true;
        setTimeout(() => {
            ModalUtil.showModal('partWithUsageCountWorkTableModal');
        }, 50);
    }

    deleteItem(item: PartWithUsageCount) {
        // this.partWithUsageCountService.delete({partWithUsageCountId: item.id})
        //     .pipe(takeUntilDestroyed(this)).subscribe((res) => {
        //     if (res) {
        //         this.partWithUsageCountList = this.partWithUsageCountList.filter((e) => {
        //             return e.id !== item.id;
        //         });
        //         setTimeout(() => {
        // this.workOrderAndFormRepository.notifyList = this.notifyList;
        this.workOrderRepositoryService.deletePartWithUsageCount({
            activityInstanceId: this.activityInstanceId
            , activityLevelId: this.activityLevelId,
            workOrderId: this.workOrderId,
            numberOfParticipation: this.numberOfParticipation,
            partWithUsageCountId: item.id,
            forSchedule: item.forSchedule

        }).pipe(takeUntilDestroyed(this)).subscribe(resTow => {
            if (resTow) {
                this.partWithUsageCountList = this.partWithUsageCountList.filter((e) => {
                    return e.id !== item.id;
                });
                // this.workOrderAndFormRepository.notifyList = this.notifyList;
                DefaultNotify.notifySuccess('باموفقیت حذف شد', '', NotiConfig.notifyConfig);
            }
        });
        //         }, 100);
        //         DefaultNotify.notifySuccess('باموفقیت حذف شد');
        //     }
        // });
        this.partWithUsageCount = new PartWithUsageCount(item.id);
    }

    addPartWithUsageCount() {
        this.partWithUsageCount = new PartWithUsageCount(this.workOrderId);
        this.mode = ActionMode.ADD;
        this.showModal = true;
        setTimeout(() => {
            ModalUtil.showModal('partWithUsageCountWorkTableModal');
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
            DefaultNotify.notifyDanger('نوع قطعه را انتخاب  کنید.', '', NotiConfig.notifyConfig);
            return;
        }
        if (form.invalid) {
            DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            return;
        }
        this.partWithUsageCount.planedQuantity = Toolkit2.Common.Fa2En(this.partWithUsageCount.planedQuantity);
        this.partWithUsageCount.actualQuantity = Toolkit2.Common.Fa2En(this.partWithUsageCount.actualQuantity);
        if (this.mode === ActionMode.ADD) {
            // this.partWithUsageCountService.create(this.partWithUsageCount)
            //   .pipe(takeUntilDestroyed(this)).subscribe((res: PartWithUsageCount) => {
            //   if (res && res.id) {
            //     DefaultNotify.notifySuccess('با موفقیت افزوده شد.');
            // =================================================================
            // this.workOrderAndFormRepository.partWithUsageCountList = this.partWithUsageCountList;
            // DataService.setWAFRepository(this.workOrderAndFormRepository);
            // =================================================================
            if ((!this.existedAlreadySaveForWAR)) {
                this.loadingAction = true;
                this.workOrderRepositoryService.createPartWithUsageCountInFirstTime(this.partWithUsageCount,
                    {
                        activityInstanceId: this.activityInstanceId,
                        workOrderId: this.workOrderId,
                        activityLevelId: this.activityLevelId, numberOfParticipation: this.numberOfParticipation
                    }).pipe(takeUntilDestroyed(this)).subscribe(resOne => {
                    this.loadingAction = false;
                    if (resOne) {
                        DefaultNotify.notifySuccess('تغییرات با موفقیت ثبت شد', '', NotiConfig.notifyConfig);
                        this.partWithUsageCountList.push(this.partWithUsageCount);
                        this.partWithUsageCount = new PartWithUsageCount(this.workOrderId);
                        DataService.setExistedAlreadySaveForWAR(true);
                        ModalUtil.hideModal('partWithUsageCountWorkTableModal');
                        // this.workOrderAndFormRepository.id = resOne;
                    }
                }, error => {
                    this.loadingAction = false;
                });
            } else if (this.existedAlreadySaveForWAR) {
                this.loadingAction = true;
                this.partWithUsageCount.id = null;
                this.workOrderRepositoryService.createPartWithUsageCountAfterFirstTime(this.partWithUsageCount,
                    {
                        activityInstanceId: this.activityInstanceId,
                        workOrderId: this.workOrderId,
                        activityLevelId: this.activityLevelId, numberOfParticipation: this.numberOfParticipation
                    }).pipe(takeUntilDestroyed(this)).subscribe(resTow => {
                    this.loadingAction = false;
                    if (resTow) {
                        DefaultNotify.notifySuccess('تغییرات با موفقیت ویرایش شد', '', NotiConfig.notifyConfig);
                        this.partWithUsageCount.id = resTow;
                        this.partWithUsageCountList.push(this.partWithUsageCount);
                        this.partWithUsageCount = new PartWithUsageCount(this.workOrderId);
                        ModalUtil.hideModal('partWithUsageCountWorkTableModal');
                    }
                }, error => {
                    this.loadingAction = false;
                });
            }
            // =================================================================
            ModalUtil.hideModal('partWithUsageCountWorkTableModal');
            this.showModal = false;

            // } else {
            //   DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.');
            // }
            // });
        } else if (this.mode === ActionMode.EDIT) {
            //   this.partWithUsageCountService.update(this.partWithUsageCount, {partWithUsageCountId: this.partWithUsageCount.id})
            //     .pipe(takeUntilDestroyed(this)).subscribe((res: boolean) => {
            //     if (res) {
            //       for (const item of this.partWithUsageCountList) {
            //         if (item.id === this.partWithUsageCount.id) {
            //           item.planedQuantity = this.partWithUsageCount.planedQuantity;
            //           item.actualQuantity = this.partWithUsageCount.actualQuantity;
            //           item.partId = this.partWithUsageCount.partId;
            //         }
            //       }

            if ((!this.existedAlreadySaveForWAR)) {
                this.loadingAction = true;
                this.workOrderRepositoryService.createPartWithUsageCountInFirstTime(this.partWithUsageCount,
                    {
                        activityInstanceId: this.activityInstanceId,
                        workOrderId: this.workOrderId,
                        activityLevelId: this.activityLevelId, numberOfParticipation: this.numberOfParticipation
                    }).pipe(takeUntilDestroyed(this)).subscribe(resOne => {
                    this.loadingAction = false;
                    if (resOne) {
                        this.partWithUsageCountList[this.selectedIndex] = JSON.parse(JSON.stringify(this.partWithUsageCountList));
                        this.partWithUsageCount = new PartWithUsageCount(this.workOrderId);
                        ModalUtil.hideModal('partWithUsageCountWorkTableModal');
                        // this.workOrderAndFormRepository.id = resOne;
                    }
                }, error => {
                    this.loadingAction = false;
                });
            } else if (this.existedAlreadySaveForWAR) {
                this.loadingAction = true;
                this.workOrderRepositoryService.updatePartWithUsageCount(this.partWithUsageCount,
                    {
                        activityInstanceId: this.activityInstanceId,
                        workOrderId: this.workOrderId,
                        activityLevelId: this.activityLevelId, numberOfParticipation: this.numberOfParticipation
                    }).pipe(takeUntilDestroyed(this)).subscribe(resTow => {
                    this.loadingAction = false;
                    if (resTow) {
                        DefaultNotify.notifySuccess('تغییرات با موفقیت ویرایش شد', '', NotiConfig.notifyConfig);
                        this.partWithUsageCountList[this.selectedIndex] = JSON.parse(JSON.stringify(this.partWithUsageCount));
                        this.partWithUsageCount = new PartWithUsageCount(this.workOrderId);
                        ModalUtil.hideModal('partWithUsageCountWorkTableModal');
                    }
                }, error => {
                    this.loadingAction = false;
                });
            }
            // =================================================================
            // this.workOrderAndFormRepository.partWithUsageCountList = this.partWithUsageCountList;
            // DataService.setWAFRepository(this.workOrderAndFormRepository);
            // =================================================================
            //       ModalUtil.hideModal('partWithUsageCountWorkTableModal');
            //       this.showModal = false;
            //       this.partWithUsageCount = new PartWithUsageCount(this.workOrderId);
            //       DefaultNotify.notifySuccess('ویرایش با موفقیت انجام شد.');
            //     } else {
            //       DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.');
            //     }
            //   });
        }
    }

    cancelModal() {
        ModalUtil.hideModal('partWithUsageCountWorkTableModal');
        this.showModal = false;
    }

    changePart() {
        this.partWithUsageCount.partName = this.partList.find(part => part.id === this.partWithUsageCount.partId).name;
    }

    // receiveSelectedPart(event: OptimalPSB) {
    //   this.partWithUsageCount.partId = event.id;
    //   this.partWithUsageCount.partName = event.name;
    // }
    receiveSelectedPart(event: PartDto.GetAll) {
        this.partWithUsageCount.partId = event.partId;
        this.partWithUsageCount.id = event.partId;
        this.partWithUsageCount.partName = event.partName;
        this.partWithUsageCount.partCode = '#' + event.partCode;
    }

    openViewPartModal() {
        if (this.mode === ActionMode.ADD) {
            ModalUtil.showModal('viewPartForPartWhitUsageCount');
        }
    }

    nextOrPrev(item) {
        if (item === 'next') {
            this.nextCarousel.emit(true);
        }
        if (item === 'prev') {
            this.nextCarousel.emit(false);
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        // if (!isNullOrUndefined(changes.partsDTO)) {
        //   this.partWithUsageCountList = this.partsDTO;
        // }
    }

    showModalBody = true;

    onCloseModal() {
        this.doSave = false;
        this.showModalBody = false;
        this.partWithUsageCount = new PartWithUsageCount(this.workOrderId);
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

