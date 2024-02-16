import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionMode, DefaultNotify, EnumHandle, Toolkit2} from '@angular-boot/util';
import {MyPattern} from '../../../../../shared/shared/tools/myPattern';
import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {isNullOrUndefined} from 'util';
import {takeUntilDestroyed} from '@angular-boot/core';
import {PropertyDto} from '../../model/dto/propertyDto';
import {PropertyService} from '../../endpoint/property.service';
import {PropertyCategoryService} from '../../../propertyCategory/endpoint/property-category.service';
import PropertyType = PropertyDto.PropertyType;
import {NotiConfig} from "../../../../../shared/tools/notifyConfig";

@Component({
    selector: 'app-property-action',
    templateUrl: './property-action.component.html',
    styleUrls: ['./property-action.component.scss']
})
export class PropertyActionComponent implements OnInit, OnDestroy {

    mode: ActionMode = ActionMode.ADD;
    actionMode = ActionMode;
    property = new PropertyDto.Create();
    propertyCopy = new PropertyDto.Create();
    propertyId: string;
    repositoryItem = '';
    myPattern = MyPattern;
    propertyTypeList: any[] = [];
    doSave = false;
    loading = false;
    PropertyType = PropertyDto.PropertyType;
    disabledButton = false;
    propertyCategoryList: any[] = [];
    valueType = PropertyDto.ValueType;
    propertyType = PropertyDto.PropertyType;
    toolKit2 = Toolkit2;

    constructor(
        public location: Location,
        public propertyService: PropertyService,
        public propertyCategoryService: PropertyCategoryService,
        private activatedRoute: ActivatedRoute,
    ) {
        this.propertyTypeList = EnumHandle.getAsValueTitleList(PropertyDto.PropertyType);
        // this.property.type = PropertyDto.PropertyType[PropertyDto.PropertyType.keyValue.toString()];
        this.mode = this.activatedRoute.snapshot.queryParams.mode;
        this.propertyId = this.activatedRoute.snapshot.queryParams.entityId;
        // this.property.valueType = this.valueType.STRING;
    }

    ngOnInit() {
        if (this.mode === ActionMode.EDIT) {
            this.mode = ActionMode.EDIT;
            this.getOne();
        } else if (this.mode === ActionMode.VIEW) {
            this.getOneView();
        } else {
            this.getAllPropertyCategory();

        }
    }

    getOneView() {

        this.propertyService.getOneView({propertyId: this.propertyId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            if (res) {
                this.property = res;

                this.propertyCopy = JSON.parse(JSON.stringify(res));
                this.getAllPropertyCategory();

            } else {
                DefaultNotify.notifyDanger(res, '', NotiConfig.notifyConfig);
                this.cancel();
            }
        });
    }

    getOne() {
        this.propertyService.getOne({propertyId: this.propertyId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            if (res.data) {
                this.property = res.data;
                this.propertyCopy = JSON.parse(JSON.stringify(res));
                this.getAllPropertyCategory();

            } else {
                DefaultNotify.notifyDanger(res, '', NotiConfig.notifyConfig);
                this.cancel();
            }
        });
    }

    action(form) {
        if (this.loading) {
            return;
        }
        if (!this.property.propertyCategoryId) {
            DefaultNotify.notifyDanger('دسته بندی مشخصات وارد شود.', '', NotiConfig.notifyConfig);
            return;
        }
        if (!this.property.type) {
            DefaultNotify.notifyDanger('نوع مشخصه وارد شود.', '', NotiConfig.notifyConfig);
            return;
        }
        if (this.property.type === 'keyValue' as any) {
            if (!this.property.valueType) {
                DefaultNotify.notifyDanger('نوع مقدار وارد شود', '', NotiConfig.notifyConfig);
                return;
            }
        }
        this.doSave = true;
        if (!this.property.key) {
            DefaultNotify.notifyDanger('کلید واژه  وارد شود.', '', NotiConfig.notifyConfig);
            return;
        }

        if (this.property.type !== PropertyType[PropertyType.keyValue.toString()]) {
            this.property.valueType = null;
        }
        if (this.property.type === PropertyType[PropertyType.keyValue.toString()]) {
            this.property.repository = [];
        }
        this.loading = true;

        if (this.mode === ActionMode.ADD) {
            this.propertyService.create(this.property)
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
            if (JSON.stringify(this.property) === JSON.stringify(this.propertyCopy)) {
                // this.loading = false;
                DefaultNotify.notifyDanger('شما هیچ ویرایشی انجام نداده اید', '', NotiConfig.notifyConfig);
            } else {
                this.propertyService.update(this.property, {propertyId: this.propertyId})
                    .pipe(takeUntilDestroyed(this)).subscribe(res => {
                    this.loading = false;
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

    changePropertyCategory(event) {
        this.property = new PropertyDto.Create();
        if (event) {
            this.property.propertyCategoryId = event;
        }
    }

    cancel() {
        this.location.back();
    }

    getAllPropertyCategory() {
        this.propertyCategoryService.getAll().subscribe(res => {
            if (!isNullOrUndefined(res)) {
                this.propertyCategoryList = res;

            }
        });
    }

    ngOnDestroy(): void {
    }

    changePropertyType() {
        if (!isNullOrUndefined(this.property.id)) {
            this.property.data = [];
            this.property.repository = [];
            this.property.val = null;
        }
    }

    deleteRepository(item: string) {
        this.property.repository = this.property.repository.filter(pr => pr !== item);
    }

    deleteData(item: string) {
        this.property.repository = this.property.repository.filter(pr => pr !== item);
    }

    checkPropertyKey() {
        this.property.key = this.property.key.trim();
        this.propertyService.checkPropertyKey({propertyKey: this.property.key})
            .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {

            if (res && res.exist) {
                DefaultNotify.notifyDanger('کلید واژه وارد شده موجود است.', '', NotiConfig.notifyConfig);
                if (isNullOrUndefined(this.property.id)) {
                    this.property.key = '';
                } else {
                    this.property.key = this.propertyCopy.key;
                }
            }
        });
    }


    doAddRepository() {
        this.repositoryItem = this.repositoryItem.trim();
        let exist = false;
        for (const item of this.property.repository) {
            if (item === this.repositoryItem) {
                exist = true;
            }
        }
        if (this.repositoryItem.length === 0) {
            return;
        }
        if (!exist) {
            this.property.repository.push(this.repositoryItem);
        } else {
            DefaultNotify.notifyWarning('مشخصات وارد شده قبلا ثبت شده است.', '', NotiConfig.notifyConfig);
        }
        this.repositoryItem = '';
    }
}
