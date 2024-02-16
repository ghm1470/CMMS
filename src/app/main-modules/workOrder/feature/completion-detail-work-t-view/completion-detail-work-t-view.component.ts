import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {MyPattern} from '../../../../shared/shared/tools/myPattern';
import {WorkOrderDto} from '../../model/dto/workOrderDto';
import {ActionMode} from '../../../formBuilder/fb-model/enumeration/enum/ActionMode';
import {ChargeDepartment} from '../../../basicInformation/chargeDepartment/model/charge-department';
import {Budget} from '../../../basicInformation/budget/model/dto/budget';
import {WorkOrderService} from '../../endpoint/work-order.service';
import {BudgetService} from '../../../basicInformation/budget/endpoint/budget.service';
import {WorkOrderRepositoryService} from '../../endpoint/work-order-repository.service';
import {ChargeDepartmentService} from '../../../basicInformation/chargeDepartment/endpoint/charge-department.service';
import {takeUntilDestroyed} from '@angular-boot/core';
import {isNullOrUndefined} from '@angular-boot/util';
import {SendInformationNumberOfTabs} from '../../../worktable/feature/show-the-trend-here/show-the-form-of-previous-steps/show-the-form-of-previous-steps.component';

@Component({
  selector: 'app-completion-detail-work-t-view',
  templateUrl: './completion-detail-work-t-view.component.html',
  styleUrls: ['./completion-detail-work-t-view.component.scss']
})
export class CompletionDetailWorkTViewComponent implements OnInit, OnDestroy, OnChanges {
  @Input() workOrderId: string;
  @Input() isView: string;
  @Input() existedAlreadySaveForWAR: boolean;
  @Input() completionDetail = new WorkOrderDto.CompletionDetail();
  @Input() sendInformationNumberOfTabs = new SendInformationNumberOfTabs();
  @Output() nextCarousel = new EventEmitter<boolean>();

  myPattern = MyPattern;
  actionMode = ActionMode;
  mode: ActionMode = this.actionMode.ADD;

  chargeDepartmentList: ChargeDepartment[] = [];
  chargeDepartment = new ChargeDepartment();
  budgetList: Budget[] = [];
  budget = new Budget();
  readBService = false;
  readChService = false;

  constructor(public workOrderService: WorkOrderService,
              public budgetService: BudgetService,
              public workOrderRepositoryService: WorkOrderRepositoryService,
              public chargeDepartmentService: ChargeDepartmentService) {
  }

  ngOnInit() {
    this.getAllBudget();
    this.getAllChargeDepartment();
  }

  getAllChargeDepartment() {
    this.chargeDepartmentService.getAll().pipe(takeUntilDestroyed(this))
      .subscribe((res: ChargeDepartment[]) => {
        if (res && res.length > 0) {
          this.chargeDepartmentList = res;
        }
        this.readChService = true;
      });
  }

  getAllBudget() {
    this.budgetService.getAll().pipe(takeUntilDestroyed(this))
      .subscribe((res: Budget[]) => {
        if (res && res.length > 0) {
          this.budgetList = res;
        }
        this.readBService = true;
      });
  }

  ngOnDestroy(): void {
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.sendInformationNumberOfTabs) {
    }
    if (changes.completionDetail) {
      if (!isNullOrUndefined(this.completionDetail)) {
        this.setBudgetAndChargeDepartment();
      } else {
        this.completionDetail = new WorkOrderDto.CompletionDetail();
      }
    }
  }

  setBudgetAndChargeDepartment() {
    if (this.readBService && this.readChService) {
      if (!isNullOrUndefined(this.completionDetail.budgetId)) {
        this.budget = this.budgetList.find(e => e.id === this.completionDetail.budgetId);
      }
      if (!isNullOrUndefined(this.completionDetail.chargeDepartmentId)) {
        this.chargeDepartment = this.chargeDepartmentList.find(e => e.id === this.completionDetail.chargeDepartmentId);
      }
    } else {
      setTimeout(() => {
        this.setBudgetAndChargeDepartment();
      }, 50);
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
}
