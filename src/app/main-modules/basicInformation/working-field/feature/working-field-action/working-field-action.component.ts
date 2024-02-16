import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ActionMode, DefaultNotify} from '@angular-boot/util';
import {NotiConfig} from '../../../../../shared/tools/notifyConfig';
import {WorkingFieldService} from '../../endpoint/working-field.service';
import {ActivatedRoute, Router} from '@angular/router';
import {workingField} from '../../model/working-field-dto';
import {Location} from '@angular/common';

@Component({
    selector: 'app-working-field-action',
    templateUrl: './working-field-action.component.html',
    styleUrls: ['./working-field-action.component.scss']
})
export class WorkingFieldActionComponent implements OnInit {
    htmlForm: FormGroup;
    mode: ActionMode;
    loadingGetOne = false;
    loadingAction = false;
    submitted = false;
    entityId: string;
    entity: workingField.GetOne;
    actionMode = ActionMode;

    constructor(private entityService: WorkingFieldService,
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
        this.entityService.getOne({id: this.entityId}).subscribe((res: workingField.GetOne) => {
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
            const newUpdateDTO = new workingField.Update();
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
            const newSaveDTO = new workingField.Create();
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
