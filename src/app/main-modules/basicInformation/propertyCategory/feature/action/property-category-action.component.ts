import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionMode, DefaultNotify} from '@angular-boot/util';
import {MyPattern} from '../../../../../shared/shared/tools/myPattern';
import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {isNullOrUndefined} from 'util';
import {takeUntilDestroyed} from '@angular-boot/core';
import {PropertyCategoryDto} from '../../model/dto/property-category-dto';
import {PropertyCategoryService} from '../../endpoint/property-category.service';
import {NotiConfig} from '../../../../../shared/tools/notifyConfig';

@Component({
    selector: 'app-property-category-action',
    templateUrl: './property-category-action.component.html',
    styleUrls: ['./property-category-action.component.scss']
})
export class PropertyCategoryActionComponent implements OnInit, OnDestroy {

    mode: ActionMode = ActionMode.ADD;
    actionMode = ActionMode;
    propertyCategory = new PropertyCategoryDto.Create();
    propertyCategoryCopy = new PropertyCategoryDto.Create();
    propertyCategoryId: string;
    myPattern = MyPattern;
    doSave = false;
    disabledButton = false;

    codeExist = false;
    loading = false;

    constructor(
        public location: Location,
        public propertyCategoryService: PropertyCategoryService,
        private activatedRoute: ActivatedRoute,
    ) {
        // this.propertyCategory.type = PropertyCategoryDto.PropertyType[PropertyCategoryDto.PropertyType.keyValue.toString()];
        this.mode = this.activatedRoute.snapshot.queryParams.mode;
        this.propertyCategoryId = this.activatedRoute.snapshot.queryParams.propertyCategoryId;
    }

    ngOnInit() {
        if (!isNullOrUndefined(this.propertyCategoryId)) {
            this.mode = ActionMode.EDIT;
            this.getOne();
        }
    }

    getOne() {
        console.log('this.propertyCategory1', this.propertyCategory);

        this.propertyCategoryService.getOne({id: this.propertyCategoryId})
            .subscribe((res: any) => {
                //  .pipe(takeUntilDestroyed(this)).
                console.log('getOne', res);
                if (res) {
                    this.propertyCategory = res;
                    console.log('this.propertyCategory', this.propertyCategory);

                    this.propertyCategoryCopy = JSON.parse(JSON.stringify(res));
                }
            });
    }

    action(form) {
        this.propertyCategory.title = this.propertyCategory.title.trim();
        this.propertyCategory.code = this.propertyCategory.code.trim();
        if (form.valid) {
            if (this.mode === ActionMode.ADD) {
                this.propertyCategoryService.create(this.propertyCategory)
                    .subscribe((res: any) => {
                        this.loading = false;

                        // .pipe(takeUntilDestroyed(this))
                        console.log('res', res);
                        if (res.id) {
                            DefaultNotify.notifySuccess('با موفقیت افزوده شد.', '', NotiConfig.notifyConfig);
                            form.reset();
                            this.cancel();
                        }
                    }, error => {
                        this.loading = false;
                    });
            } else if (this.mode === ActionMode.EDIT) {
                if (JSON.stringify(this.propertyCategory) === JSON.stringify(this.propertyCategoryCopy)) {
                    DefaultNotify.notifyDanger('شما هیچ ویرایشی انجام نداده اید', '', NotiConfig.notifyConfig);
                    this.loading = false;

                } else {
                    this.propertyCategoryService.update(this.propertyCategory, {propertyId: this.propertyCategoryId})
                        .subscribe(res => {
                            this.loading = false;

                            //  .pipe(takeUntilDestroyed(this))
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
    }

    checkIfCodeExists(propertyCategoryForm) {

        if (this.loading) {
            return;
        }
        if (JSON.stringify(this.propertyCategory) === JSON.stringify(this.propertyCategoryCopy) && this.mode === ActionMode.EDIT) {
            DefaultNotify.notifyDanger('شما هیچ ویرایشی انجام نداده اید', '', NotiConfig.notifyConfig);
            return;
        }
        if (JSON.stringify(this.propertyCategory) === JSON.stringify(this.propertyCategoryCopy) && this.mode === ActionMode.EDIT) {
            DefaultNotify.notifyDanger('شما هیچ ویرایشی انجام نداده اید', '', NotiConfig.notifyConfig);
            return;
        }

        this.doSave = true;
        if (propertyCategoryForm.invalid) {
            DefaultNotify.notifyDanger('ورودی ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            return;
        }
        if (!this.propertyCategory.title || !this.propertyCategory.code) {
            DefaultNotify.notifyDanger('ورودی ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            return;
        }

        console.log('this.propertyCategory', this.propertyCategory);
        this.loading = true;

        this.codeExist = false;
        this.propertyCategory.code = this.propertyCategory.code.trim();
        this.propertyCategoryService.checkIfCodeExists({code: this.propertyCategory.code})
            .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            ;
            if (res === true) {
                DefaultNotify.notifyDanger('کد  وارد شده موجود است.', '', NotiConfig.notifyConfig);
                this.codeExist = true;
                this.loading = false;
            } else if (res === false) {
                this.codeExist = false;
                this.action(propertyCategoryForm);
            }
        });
    }

    cancel() {
        this.location.back();
    }

    trimName() {
        this.propertyCategory.title = this.propertyCategory.title.trim();
    }

    ngOnDestroy(): void {
    }
}
