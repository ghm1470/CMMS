import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {ActionMode, DefaultNotify, ModalSize, Toolkit2} from '@angular-boot/util';
import {MyPattern} from '../../../../shared/shared/tools/myPattern';
import {EnumObject} from '../../../../_base/utility/enum/enum-object';
import {MiscCostService} from '../../endpoint/misc-cost.service';
import {WorkOrderRepositoryService} from '../../endpoint/work-order-repository.service';
import {ActivatedRoute, Router} from '@angular/router';
import {EnumHandle} from '../../../../_base/utility/enum/enum-handle';
import {DataService} from '../../../../shared/service/data.service';
import {takeUntilDestroyed} from '@angular-boot/core';
import {ModalUtil} from '@angular-boot/widgets';
import {WorkOrderDto} from '../../model/dto/workOrderDto';
import MiscCost = WorkOrderDto.MiscCost;
import MiscCostType = WorkOrderDto.MiscCostType;
import {SendInformationNumberOfTabs} from '../../../worktable/feature/show-the-trend-here/show-the-form-of-previous-steps/show-the-form-of-previous-steps.component';
import {PartWithUsageCount} from "../part-with-usage-count/model/PartWithUsageCount";
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

@Component({
    selector: 'app-misc-cost-work-table',
    templateUrl: './misc-cost-work-table.component.html',
    styleUrls: ['./misc-cost-work-table.component.scss']
})
export class MiscCostWorkTableComponent implements OnInit, OnDestroy, OnChanges {

    @Input() workOrderId: string;
    @Input() activityInstanceId: string;
    @Input() activityLevelId: string;
    @Input() staticFormsIdList: string [] = [];
    // @Input() miscCostDTO: MiscCost[] = [];
    @Input() isView: boolean;
    @Input() numberOfParticipation: number;
    @Input() sendInformationNumberOfTabs = new SendInformationNumberOfTabs();
    @Output() nextCarousel = new EventEmitter<boolean>();
    existedAlreadySaveForWAR: boolean;
    miscCostList: MiscCost[] = [];
    miscCost: MiscCost;
    miscCostCopy: MiscCost;
    selectedIndex: number;
    actionMode = ActionMode;
    mode = ActionMode.ADD;
    myPattern = MyPattern;
    doSave = false;
    miscCostTypeList = [] as EnumObject[];
    disabledButton = false;
    MyModalSize = ModalSize;

    constructor(public miscCostService: MiscCostService,
                public workOrderRepositoryService: WorkOrderRepositoryService,
                public activatedRoute: ActivatedRoute,
                public router: Router) {
        this.miscCostTypeList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<MiscCostType>(MiscCostType));
        this.miscCost = new MiscCost(this.workOrderId);
    }

    enableItems = false;

    ngOnInit() {
        if (this.staticFormsIdList) {
            if (this.staticFormsIdList.some(id => id === 'miscCost')) {
                this.enableItems = true;
            }
        }
        DataService.getExistedAlreadySaveForWAR.subscribe((res: boolean) => {
            if (res) {
                this.existedAlreadySaveForWAR = res;
            }
        });
        this.getMiscCost();
    }

    loading = false

    getMiscCost() {
        this.loading = true;
        this.miscCostService.getMiscCostListByReferenceId({referenceId: this.workOrderId}).pipe(takeUntilDestroyed(this))
            .subscribe((res: MiscCost[]) => {
                this.loading = false
                ;
                if (res && res.length) {
                    this.miscCostList = res;
                    // for (const item of this.miscCostList) {
                    //     item.description = item.description.slice(0, 25) + '...';
                    // }
                }
            }, error => {
                this.loading = false;
            });
    }

    chooseSelectedItemForEdit(item: MiscCost, i) {
        this.selectedIndex = i;
        this.miscCost = item;
        this.miscCostCopy = JSON.parse(JSON.stringify(item));
        this.mode = ActionMode.EDIT;
        ModalUtil.showModal('miscCostWorkTableModal');
    }

    deleteItem(item: MiscCost) {
        // this.workOrderAndFormRepository.notifyList = this.notifyList;
        this.workOrderRepositoryService.deleteMiscCost({
            activityInstanceId: this.activityInstanceId
            , activityLevelId: this.activityLevelId, numberOfParticipation: this.numberOfParticipation,
            miscCostId: item.id
        }).pipe(takeUntilDestroyed(this)).subscribe(resTow => {
            if (resTow) {
                this.miscCostList = this.miscCostList.filter((e) => {
                    return e.id !== item.id;
                });
            }
            DefaultNotify.notifySuccess('باموفقیت حذف شد', '', NotiConfig.notifyConfig);
        });
    }

    addNewMiscCost() {
        this.miscCost = new MiscCost(this.workOrderId);
        this.mode = ActionMode.ADD;
        ModalUtil.showModal('miscCostWorkTableModal');
    }

    ngOnDestroy(): void {
    }


    action(form) {
        this.doSave = true;
        if (form.invalid) {
            DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            return;
        }
        this.miscCost.estimatedTotalCost = this.miscCost.estimatedUnitCost * this.miscCost.estimatedQuantity;
        this.miscCost.actualTotalCost = this.miscCost.actualUnitCost * this.miscCost.quantity;
        if (this.mode === ActionMode.ADD) {
            // this.miscCostService.create(this.miscCost)
            //   .pipe(takeUntilDestroyed(this)).subscribe((res: MiscCost) => {
            //   if (res && res.id) {
            //     DefaultNotify.notifySuccess('با موفقیت افزوده شد.');
            //     this.miscCostList.push(res);
            // =================================================================
            // this.workOrderAndFormRepository.miscCostList = this.miscCostList;
            // DataService.setWAFRepository(this.workOrderAndFormRepository);
            // =================================================================
            if ((!this.existedAlreadySaveForWAR)) {
                this.workOrderRepositoryService.createMiscCostInFirstTime(this.miscCost,
                    {
                        workOrderId: this.workOrderId,
                        activityInstanceId: this.activityInstanceId,
                        activityLevelId: this.activityLevelId, numberOfParticipation: this.numberOfParticipation
                    }).pipe(takeUntilDestroyed(this)).subscribe(resOne => {
                    if (resOne) {
                        // this.miscCost.description = this.miscCost.description.slice(0, 25) + '...';
                        this.miscCostList.push(this.miscCost);
                        DefaultNotify.notifySuccess('تغییرات با موفقیت ثبت شد.', '', NotiConfig.notifyConfig);
                        DataService.setExistedAlreadySaveForWAR(true);
                        ModalUtil.hideModal('miscCostWorkTableModal');
                        // this.miscCostList.push(res);
                        // this.workOrderAndFormRepository.id = resOne;
                    }
                });
            } else if (this.existedAlreadySaveForWAR) {

                this.workOrderRepositoryService.createMiscCostAfterFirstTime(this.miscCost,
                    {
                        workOrderId: this.workOrderId,
                        activityInstanceId: this.activityInstanceId,
                        activityLevelId: this.activityLevelId, numberOfParticipation: this.numberOfParticipation
                    }).pipe(takeUntilDestroyed(this)).subscribe(resTow => {
                    if (resTow) {
                        this.miscCost.id = resTow;
                        DefaultNotify.notifySuccess('تغییرات با موفقیت ویرایش شد.', '', NotiConfig.notifyConfig);
                        ModalUtil.hideModal('miscCostWorkTableModal');
                        // this.miscCost.description = this.miscCost.description.slice(0, 25) + '...';
                        this.miscCostList.push(this.miscCost);
                    }
                });
            }
            // =================================================================
            //     ModalUtil.hideModal('miscCostWorkTableModal');
            //     this.miscCost = new MiscCost(this.workOrderId);
            //   } else {
            //     DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.');
            //   }
            // });
        } else if (this.mode === ActionMode.EDIT) {
            //   this.miscCostService.update(this.miscCost, {miscCostId: this.miscCost.id})
            //     .pipe(takeUntilDestroyed(this)).subscribe((res) => {
            //     if (res === 'true') {
            //       for (const item of this.miscCostList) {
            //         if (item.id === this.miscCost.id) {
            //           item.title = this.miscCost.title;
            //           item.estimatedQuantity = this.miscCost.estimatedQuantity;
            //           item.estimatedUnitCost = this.miscCost.estimatedUnitCost;
            //           item.estimatedTotalCost = this.miscCost.estimatedTotalCost;
            //           item.quantity = this.miscCost.quantity;
            //           item.actualUnitCost = this.miscCost.actualUnitCost;
            //           item.actualTotalCost = this.miscCost.actualTotalCost;
            //           item.description = this.miscCost.description;
            //         }
            //       }
            if ((!this.existedAlreadySaveForWAR)) {
                this.workOrderRepositoryService.createMiscCostInFirstTime(this.miscCost,
                    {
                        workOrderId: this.workOrderId,
                        activityInstanceId: this.activityInstanceId,
                        activityLevelId: this.activityLevelId, numberOfParticipation: this.numberOfParticipation
                    }).pipe(takeUntilDestroyed(this)).subscribe(resOne => {
                    if (resOne) {
                        // this.workOrderAndFormRepository.id = resOne;
                    }
                });
            } else if (this.existedAlreadySaveForWAR) {
                if (JSON.stringify(this.miscCostCopy) === JSON.stringify(this.miscCost)) {
                    DefaultNotify.notifyDanger('تغییری اعمال نشده است.', '', NotiConfig.notifyConfig);
                    return;
                }
                this.workOrderRepositoryService.updateMiscCost(this.miscCost,
                    {
                        workOrderId: this.workOrderId,
                        activityInstanceId: this.activityInstanceId,
                        activityLevelId: this.activityLevelId, numberOfParticipation: this.numberOfParticipation
                    }).pipe(takeUntilDestroyed(this)).subscribe(resTow => {
                    if (resTow) {
                        DefaultNotify.notifySuccess('تغییرات با موفقیت ویرایش شد.', '', NotiConfig.notifyConfig);
                        ModalUtil.hideModal('miscCostWorkTableModal');
                    }
                });
            }
            // =================================================================
            // this.workOrderAndFormRepository.miscCostList = this.miscCostList;
            // DataService.setWAFRepository(this.workOrderAndFormRepository);
            // =================================================================
            //       ModalUtil.hideModal('miscCostWorkTableModal');
            //       this.miscCost = new MiscCost(this.workOrderId);
            //       DefaultNotify.notifySuccess('ویرایش با موفقیت انجام شد.');
            //     } else {
            //       DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.');
            //     }
            //   });
        }
    }

    cancelModal() {
        ModalUtil.hideModal('miscCostWorkTableModal');
        const index = this.miscCostList.findIndex(e => e.id === this.miscCostCopy.id);
        if (index !== -1) {
            this.miscCostList[index] = JSON.parse(JSON.stringify(this.miscCostCopy));
        }
        this.miscCost = new MiscCost(this.workOrderId);
    }

    changeEstimatedQuantity() {
        this.miscCost.estimatedQuantity = Toolkit2.Common.Fa2En(this.miscCost.estimatedQuantity);
    }

    changeEstimatedUnitCost() {
        this.miscCost.estimatedUnitCost = Toolkit2.Common.Fa2En(this.miscCost.estimatedUnitCost);
    }

    changeQuantity() {
        this.miscCost.quantity = Toolkit2.Common.Fa2En(this.miscCost.quantity);
    }

    changeActualUnitCost() {
        this.miscCost.actualUnitCost = Toolkit2.Common.Fa2En(this.miscCost.actualUnitCost);
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
        // if (!isNullOrUndefined(changes.miscCostDTO)) {
        //   this.miscCostList = this.miscCostDTO;
        //   for (const item of this.miscCostList) {
        //     item.description = item.description.slice(0, 25) + '...';
        //   }
        // }
    }

    showModalBody = true;

    onCloseModal() {
        this.doSave = false;
        this.showModalBody = false;
        this.miscCost = new MiscCost(this.workOrderId);
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
