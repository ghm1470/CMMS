import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActionMode, DefaultNotify, isNullOrUndefined, Toolkit2} from '@angular-boot/util';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalUtil} from '@angular-boot/widgets';
import {takeUntilDestroyed} from '@angular-boot/core';
import {WorkOrderDto} from '../../model/dto/workOrderDto';
import {MiscCostService} from '../../endpoint/misc-cost.service';
import {MyPattern} from '../../../../shared/shared/tools/myPattern';
import {EnumObject} from '../../../../_base/utility/enum/enum-object';
import {EnumHandle} from '../../../../_base/utility/enum/enum-handle';
import MiscCost = WorkOrderDto.MiscCost;
import MiscCostType = WorkOrderDto.MiscCostType;
import {DataService} from '../../../../shared/service/data.service';
import {WorkOrderRepositoryService} from '../../endpoint/work-order-repository.service';
import {WorkTableDto} from '../../../worktable/model/workTable';
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

@Component({
  selector: 'app-misc-cost',
  templateUrl: './misc-cost.component.html',
  styleUrls: ['./misc-cost.component.scss']
})
export class MiscCostComponent implements OnInit, OnDestroy {

  @Input() workOrderId: string;
  @Input() modeW;
  @Input() formStatus: string;
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
  workOrderAndFormRepository: WorkTableDto.ActivitySampleWorkOrderAndFormRepository;
toolkit2 = Toolkit2
  constructor(public miscCostService: MiscCostService,
              public workOrderRepositoryService: WorkOrderRepositoryService,
              public activatedRoute: ActivatedRoute,
              public router: Router) {
    this.miscCostTypeList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<MiscCostType>(MiscCostType));
    this.miscCost = new MiscCost(this.workOrderId);
  }

  ngOnInit() {
    this.miscCostService.getMiscCostListByReferenceId({referenceId: this.workOrderId}).pipe(takeUntilDestroyed(this))
      .subscribe((res: MiscCost[]) => {
        if (res && res.length) {
          this.miscCostList = res;


        }
      });
  }

  chooseSelectedItemForEdit(item: MiscCost, i) {
    this.selectedIndex = i;
    this.miscCost = JSON.parse(JSON.stringify(item));
    this.mode = ActionMode.EDIT;
    ModalUtil.showModal('miscCostModal');
  }
  chooseSelectedItemForView(item: MiscCost, i) {
    this.selectedIndex = i;
    this.miscCost = item;
    this.mode = ActionMode.VIEW;
    ModalUtil.showModal('miscCostModal');
  }

  deleteItem(item: MiscCost) {
    console.log(' item.id for Delete', item.id);
    this.miscCostService.delete({miscCostId: item.id})
      .pipe(takeUntilDestroyed(this)).subscribe((res) => {
      if (res) {
        this.miscCostList = this.miscCostList.filter((e) => {
          return e.id !== item.id;
        });
        DefaultNotify.notifySuccess('باموفقیت حذف شد', '', NotiConfig.notifyConfig);
      }
    });
  }

  addNewMiscCost() {
    this.miscCost = new MiscCost(this.workOrderId);
    this.mode = ActionMode.ADD;
    ModalUtil.showModal('miscCostModal');
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
      this.miscCostService.create(this.miscCost)
        .pipe(takeUntilDestroyed(this)).subscribe((res: MiscCost) => {
        if (res ) {
          // =================================================================
          DefaultNotify.notifySuccess('با موفقیت افزوده شد.', '', NotiConfig.notifyConfig);
          res.description = res.description.slice(0, 10) + '...';
          this.miscCostList.push(res);
          ModalUtil.hideModal('miscCostModal');
          this.miscCost = new MiscCost(this.workOrderId);
        } else {
          DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.', '', NotiConfig.notifyConfig);
        }
      });
    } else if (this.mode === ActionMode.EDIT) {
      this.miscCostService.update(this.miscCost, {miscCostId: this.miscCost.id})
        .pipe(takeUntilDestroyed(this)).subscribe((res: boolean) => {
        if (res ) {
          for (const item of this.miscCostList) {
            if (item.id === this.miscCost.id) {
              item.title = this.miscCost.title;
              item.estimatedQuantity = this.miscCost.estimatedQuantity;
              item.estimatedUnitCost = this.miscCost.estimatedUnitCost;
              item.estimatedTotalCost = this.miscCost.estimatedTotalCost;
              item.quantity = this.miscCost.quantity;
              item.actualUnitCost = this.miscCost.actualUnitCost;
              item.actualTotalCost = this.miscCost.actualTotalCost;
              item.description = this.miscCost.description;
              item.description = item.description.slice(0, 25) + '...';
            }
          }
          ModalUtil.hideModal('miscCostModal');
          this.miscCost = new MiscCost(this.workOrderId);
          DefaultNotify.notifySuccess('ویرایش با موفقیت انجام شد.', '', NotiConfig.notifyConfig);
        } else {
          DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.', '', NotiConfig.notifyConfig);
        }
      });
    }
  }

  cancelModal() {
    ModalUtil.hideModal('miscCostModal');
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
}
