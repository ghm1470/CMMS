import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {AssetCategoryService} from '../../endpoint/asset-category.service';
import {takeUntilDestroyed} from '@angular-boot/core';
import {ActionMode, DefaultNotify} from '@angular-boot/util';
import {ActivatedRoute} from '@angular/router';
import {AssetCategoryDto} from '../../model/asset-category-dto';
import {Location} from "@angular/common";
import {NotiConfig} from "../../../../../shared/tools/notifyConfig";

@Component({
    selector: 'app-asset-category-action',
    templateUrl: './asset-category-action.component.html',
    styleUrls: ['./asset-category-action.component.scss']
})
export class AssetCategoryActionComponent implements OnInit ,OnDestroy {
    htmlForm: FormGroup;
    loadingSubmit = false;
    categoryId: string;
    category: AssetCategoryDto.GetOne;
    mode: ActionMode = ActionMode.ADD;
    actionMode = ActionMode;

    constructor(private entityService: AssetCategoryService,
                private activatedRoute: ActivatedRoute,
                public location: Location,
    ) {
        this.mode = this.activatedRoute.snapshot.queryParams.mode;
        this.categoryId = this.activatedRoute.snapshot.queryParams.entityId;
    }

    ngOnInit(): void {

        this.creatForm();
        if (this.categoryId) {
            this.getOne();
        }
    }

    getOne() {
        this.entityService.getOne({categoryId: this.categoryId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: AssetCategoryDto.GetOne) => {
            console.log('getOne', res);
            if (res) {
                this.category = res;
                this.htmlForm.patchValue({
                    name: this.category.title,
                    description: this.category.description,
                });
            }
        });
    }

    creatForm() {
        this.htmlForm = new FormGroup({
            name: new FormControl(), // عنوان
            description: new FormControl(), // توضیحات
        });
    }

    onSubmit() {
        if (this.mode === ActionMode.ADD) {
            this.loadingSubmit = true;
            const dto = new AssetCategoryDto.Create();
            dto.title = this.htmlForm.controls.name.value;
            dto.description = this.htmlForm.controls.description.value;
            this.entityService.create(dto).subscribe((res: any) => {
                this.loadingSubmit = false;
                if (res) {
                    DefaultNotify.notifySuccess('با موفقیت ثبت گردید.', '', NotiConfig.notifyConfig);
                    this.back();
                }
            }, error => {
                this.loadingSubmit = false;

            });
        } else {
            this.loadingSubmit = true;
            const dto = new AssetCategoryDto.Update();
            dto.title = this.htmlForm.controls.name.value;
            dto.description = this.htmlForm.controls.description.value;
            dto.id = this.categoryId;
            this.entityService.update(dto).subscribe((res: any) => {
                this.loadingSubmit = false;
                if (res) {
                    DefaultNotify.notifySuccess('با موفقیت ویرایش  گردید.', '', NotiConfig.notifyConfig);
                    this.back();

                }
            }, error => {
                this.loadingSubmit = false;

            });
        }

    }

    back() {
        this.location.back();

    }

    ngOnDestroy(): void {
    }
}
