import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output} from '@angular/core';

import {ModalUtil} from '@angular-boot/widgets';

import {ActivatedRoute} from '@angular/router';
import {ActionMode, DefaultNotify, isNullOrUndefined} from '@angular-boot/util';

import {takeUntilDestroyed} from '@angular-boot/core';
import {Location} from '@angular/common';
import Metering = PartDto.Metering;
import {PartDto} from '../../../../model/dto/part';
import {UnitOfMeasurement} from '../../../../../basicInformation/unitOfMeasurement/model/dto/unitOfMeasurement';
import {UnitOfMeasurementService} from '../../../../endpoint/unit-of-measurement.service';
import {MyPattern} from '../../../../../../shared/shared/tools/myPattern';
import {MeteringService} from '../../../../endpoint/metering.service';
import {NotiConfig} from "../../../../../../shared/tools/notifyConfig";
declare var $: any;
@Component({
  selector: 'app-metering-action',
  templateUrl: './metering-action.component.html',
  styleUrls: ['./metering-action.component.scss']
})
export class MeteringActionComponent implements OnInit, OnChanges, OnDestroy {
  metering = new Metering();
  myPattern = MyPattern;
  meteringUId: string;
  meteringUIdCopy: string;
  meteringCopy = new Metering();
  @Input() mode;
  @Input() meteringId: string;
  @Input() refId: string;
  @Input() receiveMeteringForEdit: Metering;
  @Output() messageEvent = new EventEmitter<Metering>();

  actionMode = ActionMode;
  unitOfMeasurementList: UnitOfMeasurement[] = [];
  doSave = false;

  constructor(public location: Location,
              private  unitOfMeasurementService: UnitOfMeasurementService,
              private meteringService: MeteringService) {
  }

  ngOnInit() {
    this.getAllUnitOfMeasurement();
  }

  ngOnChanges() {
    this.metering = new Metering();
    this.meteringUId = '';
    if (this.mode === ActionMode.EDIT) {
      if (!isNullOrUndefined(this.meteringId)) {
        this.getAllUnitOfMeasurement();
        this.getOne();
      }
    }
  }

  ngOnDestroy(): void {
  }

  getAllUnitOfMeasurement() {
    this.unitOfMeasurementService.getAll().subscribe((res: UnitOfMeasurement[]) => {
      if (res) {
        this.unitOfMeasurementList = res;
      }
    });
  }

  getOne() {
        this.metering = this.receiveMeteringForEdit;
        this.meteringUId = this.metering.unitOfMeasurement.id;
        this.meteringUIdCopy = this.metering.unitOfMeasurement.id;
        this.meteringCopy = JSON.parse(JSON.stringify(this.receiveMeteringForEdit));
      }


  action(form) {
    this.doSave = true;
    if (form.invalid) {
      DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
      return;
    }
    if (this.mode === ActionMode.ADD) {
      this.metering.referenceId = this.refId;
      const index = this.unitOfMeasurementList.findIndex(e => e.id === this.meteringUId);

      if (index !== -1) {
        this.metering.unitOfMeasurement = this.unitOfMeasurementList[index];
      }
      this.meteringService.create(this.metering)
        .pipe(takeUntilDestroyed(this)).subscribe((res: Metering) => {
        if (res) {
          this.metering = res;
          DefaultNotify.notifySuccess('با موفقیت افزوده شد.', '', NotiConfig.notifyConfig);
          this.messageEvent.emit(JSON.parse(JSON.stringify(this.metering)));
          form.reset();
          this.doSave = false;
          this.cancelModal();
        }
      });
    } else if (this.mode === ActionMode.EDIT) {
      if (JSON.stringify(this.metering) === JSON.stringify(this.meteringCopy) && this.meteringUId === this.meteringUIdCopy) {
        // this.loading = false;
        DefaultNotify.notifyDanger('شما هیچ ویرایشی انجام نداده اید', '', NotiConfig.notifyConfig);
      } else {
        const index = this.unitOfMeasurementList.findIndex(e => e.id === this.meteringUId);
        this.metering.unitOfMeasurement = this.unitOfMeasurementList[index];
        this.meteringService.update(this.metering)
          .pipe(takeUntilDestroyed(this)).subscribe((res: Metering) => {
          if (res) {
            DefaultNotify.notifySuccess('ویرایش با موفقیت انجام شد.', '', NotiConfig.notifyConfig);
            this.messageEvent.emit(JSON.parse(JSON.stringify(this.metering)));
            form.reset();
            this.doSave = false;
            this.cancelModal();
          }
        });
      }
    }
  }

  cancelModal() {
    $('#formsMetering')[0].reset();
    ModalUtil.hideModal('meteringModal');
    this.metering = new Metering();
  }

  cancel() {
    this.location.back();
  }

}

