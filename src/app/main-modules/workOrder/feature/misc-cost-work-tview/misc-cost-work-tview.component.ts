import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {ActionMode, DefaultNotify, isNullOrUndefined, Toolkit2} from '@angular-boot/util';
import {MyPattern} from '../../../../shared/shared/tools/myPattern';
import {EnumObject} from '../../../../_base/utility/enum/enum-object';
import {WorkOrderRepositoryService} from '../../endpoint/work-order-repository.service';
import {ActivatedRoute, Router} from '@angular/router';
import {EnumHandle} from '../../../../_base/utility/enum/enum-handle';
import {ModalUtil} from '@angular-boot/widgets';
import {WorkOrderDto} from '../../model/dto/workOrderDto';
import MiscCost = WorkOrderDto.MiscCost;
import MiscCostType = WorkOrderDto.MiscCostType;
import {NgForm} from '@angular/forms';
import {SendInformationNumberOfTabs} from '../../../worktable/feature/show-the-trend-here/show-the-form-of-previous-steps/show-the-form-of-previous-steps.component';

@Component({
  selector: 'app-misc-cost-work-tview',
  templateUrl: './misc-cost-work-tview.component.html',
  styleUrls: ['./misc-cost-work-tview.component.scss']
})
export class MiscCostWorkTViewComponent implements OnInit, OnDestroy, OnChanges {

  @Input() miscCostList: MiscCost[] = [];
  @Input() workOrderId: string;
  @Input() sendInformationNumberOfTabs = new SendInformationNumberOfTabs();
  @Input() existedAlreadySaveForWAR: boolean;
  @Output() nextCarousel = new EventEmitter<boolean>();
  miscCost: MiscCost;
  actionMode = ActionMode;
  mode = ActionMode.ADD;
  myPattern = MyPattern;
  doSave = false;
  miscCostTypeList = [] as EnumObject[];
  constructor(public workOrderRepositoryService: WorkOrderRepositoryService,
              public activatedRoute: ActivatedRoute,
              public router: Router) {
    this.miscCostTypeList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<MiscCostType>(MiscCostType));
    this.miscCost = new MiscCost(this.workOrderId);
  }

  ngOnInit() {

  }


  ngOnDestroy(): void {
  }



  cancelModal() {
    ModalUtil.hideModal('miscCostWorkTableModal');
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

  action(miscCostForm: NgForm) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.sendInformationNumberOfTabs) {
    }
    if (changes.miscCostList) {
      if (isNullOrUndefined(this.miscCostList)) {
        this.miscCostList = [];
      }
    }
  }
}
