import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {MyPattern} from '../../../../shared/shared/tools/myPattern';
import {WorkOrderDto} from '../../model/dto/workOrderDto';
import {ActionMode} from '../../../formBuilder/fb-model/enumeration/enum/ActionMode';
import {ChargeDepartment} from '../../../basicInformation/chargeDepartment/model/charge-department';
import {Budget} from '../../../basicInformation/budget/model/dto/budget';
import {WorkTableDto} from '../../../worktable/model/workTable';
import {WorkOrderService} from '../../endpoint/work-order.service';
import {BudgetService} from '../../../basicInformation/budget/endpoint/budget.service';
import {WorkOrderRepositoryService} from '../../endpoint/work-order-repository.service';
import {ChargeDepartmentService} from '../../../basicInformation/chargeDepartment/endpoint/charge-department.service';
import {DataService} from '../../../../shared/service/data.service';
import {takeUntilDestroyed} from '@angular-boot/core';
import {DefaultNotify, isNullOrUndefined} from '@angular-boot/util';
import completionDetail = WorkOrderDto.CompletionDetail;
import CompletionDetailDtO = WorkOrderDto.CompletionDetailDtO;
import {SendInformationNumberOfTabs} from '../../../worktable/feature/show-the-trend-here/show-the-form-of-previous-steps/show-the-form-of-previous-steps.component';
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

@Component({
    selector: 'app-completion-detail-work-table',
    templateUrl: './completion-detail-work-table.component.html',
    styleUrls: ['./completion-detail-work-table.component.scss']
})
export class CompletionDetailWorkTableComponent implements OnInit, OnDestroy, OnChanges {
    @Input() staticFormsIdList: string[] = [];
    @Input() workOrderId: string;
    @Input() activityInstanceId: string;
    @Input() sendInformationNumberOfTabs = new SendInformationNumberOfTabs();
    @Input() isView: boolean;
    @Input() activityLevelId: string;
    @Input() completionDetailsDTO = new WorkOrderDto.CompletionDetail();
    @Input() numberOfParticipation: number;
    @Output() nextCarousel = new EventEmitter<boolean>();

    existedAlreadySaveForWAR: boolean;
    myPattern = MyPattern;
    completionDetail = new completionDetail();
    completionDetailCopy = new completionDetail();
    actionMode = ActionMode;
    mode: ActionMode = this.actionMode.ADD;

    chargeDepartmentList: ChargeDepartment[] = [];
    chargeDepartment = new ChargeDepartment();
    budgetList: Budget[] = [];
    budget = new Budget();
    doSave = false;
    disabledButton = false;
    workOrderAndFormRepository: WorkTableDto.ActivitySampleWorkOrderAndFormRepository;

    constructor(public workOrderService: WorkOrderService,
                public budgetService: BudgetService,
                public workOrderRepositoryService: WorkOrderRepositoryService,
                public chargeDepartmentService: ChargeDepartmentService) {
    }

    enableItems = false;

    ngOnInit() {
        if (this.staticFormsIdList) {
            if (this.staticFormsIdList.some(id => id === 'completionDetails')) {
                this.enableItems = true;
            }
        }
        this.getAllBudget();
        this.getAllChargeDepartment();
        this.getCompletionDetailByAssetId();
        DataService.getExistedAlreadySaveForWAR.subscribe((res: boolean) => {
            if (res) {
                this.existedAlreadySaveForWAR = res;
            }
        });
    }

    getAllChargeDepartment() {
        this.chargeDepartmentService.getAll().pipe(takeUntilDestroyed(this))
            .subscribe((res: ChargeDepartment[]) => {
                if (res && res.length > 0) {
                    this.chargeDepartmentList = res;
                }
            });
    }

    getAllBudget() {
        this.budgetService.getAll().pipe(takeUntilDestroyed(this))
            .subscribe((res: Budget[]) => {
                if (res && res.length > 0) {
                    this.budgetList = res;
                }
            });
        // this.readBService = true;
    }

    loading = false;

    getCompletionDetailByAssetId() {
        this.workOrderService.getCompletionDetailByWorkOrderId({workOrderId: this.workOrderId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: completionDetail) => {

            this.loading = false;
            
            if (!isNullOrUndefined(res)) {
                setTimeout(() => {
                    this.completionDetail = res;
                    this.completionDetailCopy = JSON.parse(JSON.stringify(res));
                }, 50);
            }
        }, error => {
            this.loading = false;
        });
        // ===========================================
        //     this.completionDetail.chargeDepartmentId = this.completionDetailsDTO.chargeDepartmentId;
        //     this.completionDetail.budgetId = this.completionDetailsDTO.budgetId;
        //     this.completionDetail.adminNote = this.completionDetailsDTO.adminNote;
        //     this.completionDetail.note = this.completionDetailsDTO.note;
        //     this.completionDetail.problem = this.completionDetailsDTO.problem;
        //     this.completionDetail.rootCause = this.completionDetailsDTO.rootCause;
        //     this.completionDetail.solution = this.completionDetailsDTO.solution;
        //     this.completionDetailCopy = JSON.parse(JSON.stringify(this.completionDetailsDTO));
    }

    ngOnDestroy(): void {
    }

    action(completionDetailForm) {
        this.doSave = true;
        if (completionDetailForm.invalid) {
            DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            return;
        }
        if ((JSON.stringify(this.completionDetail)) === ((JSON.stringify(this.completionDetailCopy)))) {
            DefaultNotify.notifyDanger('شما هیچ ویراشی انجام نداده اید.', '', NotiConfig.notifyConfig);
            return;
        }
        // this.workOrderService.updateWorkOrderCompletionDetail
        //   (this.completionDetail, {workOrderId: this.workOrderId})
        //     .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
        //     
        //     if (res) {
        // =================================================================
        // this.workOrderAndFormRepository.completionDetail = this.completionDetail;
        // DataService.setWAFRepository(this.workOrderAndFormRepository);
        // =================ثبت کردن در ریپاسیتوری
        if ((!this.existedAlreadySaveForWAR)) {
            this.workOrderRepositoryService.createCompletionDetail(this.completionDetail,
                {
                    activityInstanceId: this.activityInstanceId,
                    activityLevelId: this.activityLevelId,
                    workOrderId: this.workOrderId,
                    numberOfParticipation: this.numberOfParticipation
                })
                .pipe(takeUntilDestroyed(this)).subscribe(resOne => {
                if (resOne) {
                    DefaultNotify.notifySuccess('تغییرات با موفقیت ثبت شد.', '', NotiConfig.notifyConfig);
                    DataService.setExistedAlreadySaveForWAR(true);
                    // this.workOrderAndFormRepository.id = resOne;
                    this.completionDetailCopy = JSON.parse(JSON.stringify(this.completionDetail));

                }
            });
        } else if (this.existedAlreadySaveForWAR) {
            this.workOrderRepositoryService.updateCompletionDetail(this.completionDetail, {
                activityInstanceId: this.activityInstanceId,
                workOrderId: this.workOrderId,
                activityLevelId: this.activityLevelId, numberOfParticipation: this.numberOfParticipation
            })
                .pipe(takeUntilDestroyed(this)).subscribe(resTow => {
                if (resTow) {
                    DefaultNotify.notifySuccess('تغییرات با موفقیت ,ویرایش شد.', '', NotiConfig.notifyConfig);
                    this.completionDetailCopy = JSON.parse(JSON.stringify(this.completionDetail));

                }
            });
        }
        // =================================================================

        //   } else {
        //     DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.');
        //   }
        // });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.completionDetailsDTO) {
            this.getCompletionDetailByAssetId();
        }
    }

}
