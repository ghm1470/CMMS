import {AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {MyPattern} from '../../../../shared/shared/tools/myPattern';
import {WorkOrderDto} from '../../model/dto/workOrderDto';
import {WorkOrderService} from '../../endpoint/work-order.service';
import {takeUntilDestroyed} from '@angular-boot/core';
import {DefaultNotify, isNullOrUndefined} from '@angular-boot/util';
import {BudgetService} from '../../../basicInformation/budget/endpoint/budget.service';
import {ChargeDepartmentService} from '../../../basicInformation/chargeDepartment/endpoint/charge-department.service';
import completionDetail = WorkOrderDto.CompletionDetail;
import {ChargeDepartment} from '../../../basicInformation/chargeDepartment/model/charge-department';
import {Budget} from '../../../basicInformation/budget/model/dto/budget';
import {ActionMode} from '../../../formBuilder/fb-model/enumeration/enum/ActionMode';
import {DataService} from '../../../../shared/service/data.service';
import {WorkTableDto} from '../../../worktable/model/workTable';
import {WorkOrderRepositoryService} from '../../endpoint/work-order-repository.service';
import {NotiConfig} from "../../../../shared/tools/notifyConfig";
declare var $: any;
@Component({
  selector: 'app-completion-detail',
  templateUrl: './completion-detail.component.html',
  styleUrls: ['./completion-detail.component.scss']
})
export class CompletionDetailComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {

  @Input() workOrderId: string;
  @Input() modeW;
  @Input() formStatus: string;

  myPattern = MyPattern;
  completionDetail = new WorkOrderDto.CompletionDetail();
  completionDetailCopy = new WorkOrderDto.CompletionDetail();
  actionMode = ActionMode;

  chargeDepartmentList: ChargeDepartment[] = [];
  chargeDepartment = new ChargeDepartment();
  budgetList: Budget[] = [];
  budget =  new Budget();
  doSave = false;
  disabledButton = false;
  workOrderAndFormRepository: WorkTableDto.ActivitySampleWorkOrderAndFormRepository;
  constructor(public workOrderService: WorkOrderService,
              public budgetService: BudgetService,
              public workOrderRepositoryService: WorkOrderRepositoryService,
              public chargeDepartmentService: ChargeDepartmentService) {
  }

  ngOnInit() {
    this.getAllBudget();
    this.getAllChargeDepartment();
    // DataService.getWAFRepository.subscribe((res: any) => {
    //   if (res) {
    //     this.workOrderAndFormRepository = res;
    //   }
    // });
    this.getCompletionDetailByAssetId();
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
  }

  getCompletionDetailByAssetId() {
    this.workOrderService.getCompletionDetailByWorkOrderId({workOrderId: this.workOrderId})
      .pipe(takeUntilDestroyed(this)).subscribe((res: completionDetail) => {
      
      if (!isNullOrUndefined(res) && !isNullOrUndefined(res.note)) {
        setTimeout( () => {
          this.completionDetail = res;
          this.completionDetailCopy = JSON.parse(JSON.stringify(res));
          this.budget = this.budgetList.find( e => e.id === res.budgetId);
          this.chargeDepartment = this.chargeDepartmentList.find( e => e.id === res.chargeDepartmentId);
          console.log('this.budget', this.budget);
          console.log('this.budgetList', this.budgetList);
        }, 50);
      }
    });
  }

  ngOnDestroy(): void {
  }

  action(completionDetailForm) {
    this.doSave = true;
    console.log('this.asset', this.completionDetail);
    if (completionDetailForm.invalid) {
      DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
      return;
    }
    this.workOrderService.updateWorkOrderCompletionDetail(this.completionDetail, {workOrderId: this.workOrderId})
      .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
      
      if (res) {
        // =================================================================
        if (this.formStatus === 'pending') {
          this.workOrderAndFormRepository.completionDetail = this.completionDetail;
          DataService.setWAFRepository(this.workOrderAndFormRepository);
          if (!isNullOrUndefined(this.workOrderAndFormRepository.id)) {
            this.workOrderRepositoryService.update(this.workOrderAndFormRepository).pipe(takeUntilDestroyed(this)).subscribe(resTree => {
              if (resTree) {
                console.log('res==>', resTree);
                DataService.setWAFRepository(this.workOrderAndFormRepository);
              }
            });
          } else if (isNullOrUndefined(this.workOrderAndFormRepository.id)) {
            this.workOrderRepositoryService.create(this.workOrderAndFormRepository).pipe(takeUntilDestroyed(this)).subscribe(resTow => {
              if (resTow) {
                console.log('resTow', resTow);
                this.workOrderAndFormRepository.id = resTow;
                console.log('this.workOrderAndFormRepository', this.workOrderAndFormRepository);
                DataService.setWAFRepository(this.workOrderAndFormRepository);
              }
            });
          }
        }
        // =================================================================
        DefaultNotify.notifySuccess('تغییرات با موفقیت ثبت شد.', '', NotiConfig.notifyConfig);
      } else {
        DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.', '', NotiConfig.notifyConfig);
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.modeW === ActionMode.VIEW) {
      $('input').attr('disabled', 'disabled');
      $('select').attr('disabled', 'disabled');
      $('textarea').attr('disabled', 'disabled');
    }
  }

  ngOnChanges(): void {
    // alert(this.modeW);
  }
}
