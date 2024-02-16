import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ActionMode, DefaultNotify} from '@angular-boot/util';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {NotiConfig} from '../../../../../shared/tools/notifyConfig';
import {TypeOfActivityService} from '../../endpoint/type-of-activity.service';
import {typeOfActivityDto} from '../../model/type-of-activity-dto';
import {map} from "rxjs/operators";

@Component({
  selector: 'app-type-of-activity-action',
  templateUrl: './type-of-activity-action.component.html',
  styleUrls: ['./type-of-activity-action.component.scss']
})
export class TypeOfActivityActionComponent implements OnInit {
  htmlForm: FormGroup;
  mode: ActionMode;
  loadingGetOne = false;
  loadingAction = false;
  submitted = false;
  entityId: string;
  entity: typeOfActivityDto.GetOne;
  actionMode = ActionMode;

  constructor(private entityService: TypeOfActivityService,
              public router: Router,
              public location: Location,
              private  activatedRoute: ActivatedRoute) {
    this.entityId = this.activatedRoute.snapshot.queryParams.entityId;
    this.mode = this.activatedRoute.snapshot.queryParams.mode;
  }

  ngOnInit(): void {
    if (this.entityId) {
      this.getOne();
    }
    this.creatForm();
  }

  creatForm() {
    this.htmlForm = new FormGroup({
      title: new FormControl(), // نام
    });
    if (this.mode === ActionMode.VIEW) {
      this.htmlForm.disable();

    }
  }

  getOne() {
    this.loadingGetOne = true;
    this.entityService.getOne({id: this.entityId}).subscribe((res: typeOfActivityDto.GetOne) => {
      this.loadingGetOne = false;
      this.entity = res;
      this.htmlForm.patchValue({
        title: this.entity.name,
      });
    });
  }

  onSubmit() {
    if (this.loadingAction) {
      return;
    }
    this.submitted = true;
    if (!this.htmlForm.controls.title.value) {
      DefaultNotify.notifyDanger('عنوان وازد شود.', '', NotiConfig.notifyConfig);
      return;
    }
    this.loadingAction = true;
    if (this.entityId) {
      const newUpdateDTO = new typeOfActivityDto.Update();
      newUpdateDTO.name = this.htmlForm.controls.title.value;
      newUpdateDTO.id = this.entityId;
      this.entityService.update(newUpdateDTO).subscribe((res) => {
        this.loadingAction = false;
        this.back();
        DefaultNotify.notifySuccess('  با موفقیت ویرایش شد.', '', NotiConfig.notifyConfig);
      }, error => {
        this.loadingAction = false;
      });
    } else {
      const newSaveDTO = new typeOfActivityDto.Create();
      newSaveDTO.name = this.htmlForm.controls.title.value;
      this.entityService.create(newSaveDTO).subscribe((res) => {
        this.loadingAction = false;
        this.back();
        DefaultNotify.notifySuccess('  با موفقیت افزوده شد.', '', NotiConfig.notifyConfig);
      }, error => {
        this.loadingAction = false;
      });
    }


  }

  back() {
    this.location.back();
  }
  }
