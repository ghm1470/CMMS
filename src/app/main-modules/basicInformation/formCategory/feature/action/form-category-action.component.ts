import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionMode, DefaultNotify} from '@angular-boot/util';
import {MyPattern} from '../../../../../shared/shared/tools/myPattern';

import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {isNullOrUndefined} from 'util';
import {takeUntilDestroyed} from '@angular-boot/core';
import {FormCategory} from '../../model/dto/formCategory';
import {FormCategoryService} from '../../endpoint/form-category.service';
import {NotiConfig} from "../../../../../shared/tools/notifyConfig";

declare var $: any;

@Component({
    selector: 'app-form-category-action',
    templateUrl: './form-category-action.component.html',
    styleUrls: ['./form-category-action.component.scss']
})
export class FormCategoryActionComponent implements OnInit, OnDestroy {

    mode: ActionMode = ActionMode.ADD;
    actionMode = ActionMode;
    formCategory = new FormCategory();
    formCategoryCopy = new FormCategory();
    formCategoryId: string;
    myPattern = MyPattern;
    doSave = false;
    disabledButton = false;
    loading = false;

    constructor(
        public location: Location,
        private activatedRoute: ActivatedRoute,
        private formCategoryService: FormCategoryService,
    ) {
        this.mode = this.activatedRoute.snapshot.queryParams.mode;
        this.formCategoryId = this.activatedRoute.snapshot.queryParams.formCategoryId;
    }

    ngOnInit() {
        if (this.mode === ActionMode.EDIT) {
            this.loading = true;
            if (!isNullOrUndefined(this.formCategoryId)) {
                this.getOne();
            }
        }
    }

    getOne() {
        this.formCategoryService.getOne({formCategoryId: this.formCategoryId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: FormCategory) => {
            console.log('getOne', res);
            if (res) {
                this.loading = false;
                this.formCategory = res;
                this.formCategoryCopy = JSON.parse(JSON.stringify(res));
            }
        });
    }

    checkIfTitleIsUnique(form) {
        if (this.loading) {
            return;
        }
        this.disabledButton = true;
        this.doSave = true;

        if (!this.formCategory.title || isNullOrUndefined(this.formCategory.title)) {
            DefaultNotify.notifyDanger('ورودی‌ را بررسی کنید, فاصله نمی تواند به عنوان کارکتر اصلی باشد.', '', NotiConfig.notifyConfig);
            this.disabledButton = false;
            return;
        }
        if (form.invalid) {
            DefaultNotify.notifyDanger('ورودی‌ را بررسی کنید.', '', NotiConfig.notifyConfig);
            this.disabledButton = false;
            return;
        }
        this.formCategory.title = this.formCategory.title.trim();
        this.loading = true;
        console.log('this.formCategory ====>', this.formCategory);
        this.formCategoryService.checkIfTitleIsUnique({title: this.formCategory.title}).subscribe((res: boolean) => {
            if (res) {
                DefaultNotify.notifyDanger('عنوان وارد شده موجود است.', '', NotiConfig.notifyConfig);
                this.loading = false;
                return;
            } else {
                this.action(form);
            }
        }, error => {
            this.loading = false;
        });
    }

    action(form) {
        if (this.mode === ActionMode.ADD) {
            this.formCategoryService.create(this.formCategory)
                .pipe(takeUntilDestroyed(this)).subscribe(res => {
                this.loading = false;

                if (res) {
                    DefaultNotify.notifySuccess('با موفقیت افزوده شد.', '', NotiConfig.notifyConfig);
                    form.reset();
                    this.cancel();
                }
            }, error => {
                this.loading = false;

            });
        } else if (this.mode === ActionMode.EDIT) {
            if (JSON.stringify(this.formCategory) === JSON.stringify(this.formCategoryCopy)) {
                DefaultNotify.notifyDanger('شما هیچ ویرایشی انجام نداده اید', '', NotiConfig.notifyConfig);
                this.loading = false;
                this.disabledButton = false;
            } else {
                this.formCategoryService.update(this.formCategory)
                    .pipe(takeUntilDestroyed(this)).subscribe(res => {
                    this.loading = false;

                    console.log('update', res);
                    if (res) {
                        DefaultNotify.notifySuccess('ویرایش با موفقیت انجام شد.', '', NotiConfig.notifyConfig);
                        this.cancel();
                    }
                }, error => {
                    this.loading = false;

                });
            }
        }
    }

    cancel() {
        this.location.back();
    }

    ngOnDestroy(): void {
    }

    trim() {
        this.formCategory.title = this.formCategory.title.trim();
    }
}
