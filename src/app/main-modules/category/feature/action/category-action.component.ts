import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionMode, DefaultNotify, EnumHandle, isNullOrUndefined} from '@angular-boot/util';
import {MyPattern} from '../../../../shared/shared/tools/myPattern';
import {FileModel} from '../../../../shared/model/fileModel';
import {Location} from '@angular/common';
import {UploadService} from '../../../../shared/service/upload.service';
import {ActivatedRoute} from '@angular/router';
import {takeUntilDestroyed} from '@angular-boot/core';
import {CategoryDto} from '../../model/dto/categoryDto';
import {CategoryService} from '../../endpoint/category.service';
import {ActivityService} from '../../../activity/service/activity.service';
import {PropertyService} from '../../../basicInformation/property/endpoint/property.service';
import {Activity} from '../../../activity/model/activity';
import {PropertyDto} from '../../../basicInformation/property/model/dto/propertyDto';
import {CompanyDto} from '../../../company/model/dto/companyDto';
import {PropertyCategoryDto} from '../../../basicInformation/propertyCategory/model/dto/property-category-dto';
import {PropertyCategoryService} from '../../../basicInformation/propertyCategory/endpoint/property-category.service';
import DocumentFile = CompanyDto.DocumentFile;
import PropertyType = PropertyDto.PropertyType;
import CategoryType = CategoryDto.CategoryType;
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

@Component({
    selector: 'app-category-action',
    templateUrl: './category-action.component.html',
    styleUrls: ['./category-action.component.scss']
})
export class CategoryActionComponent implements OnInit, OnDestroy {

    mode: ActionMode = ActionMode.ADD;
    actionMode = ActionMode;
    categoryType = CategoryType;
    category = new CategoryDto.Create();
    categoryCopy = new CategoryDto.Create();
    categoryId: string;
    myPattern = MyPattern;
    categoryTypeList: any[] = [];
    maineParentCategoryId: string;
    activityList: Activity[] = [];
    categoryList: CategoryDto.Create[] = [];
    propertyList: PropertyDto.Create[] = [];
    files: Array<File> = [];
    fileModel: Array<FileModel> = [];
    doSave = false;
    selectedProperty: PropertyDto.Create = new PropertyDto.Create();
    propertyType = PropertyType;
    propertyTypeList: any [] = [];
    valueOfKay: string;
    disabledButton = false;
    loading = false;
    selectedPropertyCategory: any;
    propertyCategoryList: PropertyCategoryDto.Create [] = [];
    ext: string[] = ['jpg', 'jpeg', 'png', 'psd', 'tiff',
        'JPG', 'JPEG', 'PNG', 'PSD', 'TIFF'
    ];
    fileLoader = false;

    constructor(
        public location: Location,
        public categoryService: CategoryService,
        public propertyService: PropertyService,
        public uploadService: UploadService,
        public activityService: ActivityService,
        private activatedRoute: ActivatedRoute,
        private propertyCategoryService: PropertyCategoryService,
    ) {
        this.propertyTypeList = EnumHandle.getAsValueTitleList(PropertyDto.PropertyType);
        this.categoryTypeList = EnumHandle.getAsValueTitleList(CategoryDto.CategoryType);
        this.category.parentId = 'ROOT';
        this.selectedProperty.id = '-1';
        this.mode = this.activatedRoute.snapshot.queryParams.mode;
        this.categoryId = this.activatedRoute.snapshot.queryParams.entityId;
        const category = new CategoryDto.Create();
        category.id = 'ROOT';
        category.title = 'دسته اصلی';
        this.categoryList.push(category);
    }

    ngOnInit() {
        // This is an additional method and is unused
        // this.getAllActivity();
        // this.getAllProperty();
        this.getPropertyCategory();
        this.getAllParentCategory();
        if (this.mode === ActionMode.EDIT || this.mode === ActionMode.VIEW) {
            if (!isNullOrUndefined(this.categoryId)) {
                this.getOne();
            }
        }

    }

    loadingGetPropertyCategory = false;

    getPropertyCategory() {
        this.loadingGetPropertyCategory = true;
        this.propertyCategoryService.getAllPropertyCategoryTitle().subscribe(res => {
            this.loadingGetPropertyCategory = false;
            if (res) {
                this.propertyCategoryList = res;
            }
        }, error => {
            this.loadingGetPropertyCategory = false;
        });
    }

    getAllParentCategory() {
        this.categoryService.getAll().pipe(takeUntilDestroyed(this))
            .subscribe((res: any) => {
                console.log('this.categoryList', res);
                if (res && res.length) {
                    for (const item of res) {
                        // if (this.mode === ActionMode.EDIT) {
                        if (JSON.stringify(item.id) !== JSON.stringify(this.categoryId)) {
                            this.categoryList.push(item);
                        }
                        // }
                    }
                    console.log('this.categoryList...........', this.categoryList);

                }
            });
    }

    getAllActivity() {
        // This is an additional method and is unused
        this.activityService.getAllLimit()
            .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            ;
            if (!isNullOrUndefined(res)) {
                this.activityList = res;
            }
        });
    }

    getAllProperty() {
        this.propertyService.getAll()
            .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            console.log('propertyList ==== >');
            ;
            if (!isNullOrUndefined(res)) {
                this.propertyList = res;
                this.changeCategoryProperty();
            }
        });
    }

    changeCategoryProperty() {
        if (!isNullOrUndefined(this.category.id) && this.propertyList.length > 0) {
            const length = this.category.properties.length - 1;
            for (let i = 0; i <= length; i++) {
                // this.propertyList = this.propertyList.filter(property => property.id !== this.category.properties[i].id);
            }
        }
    }

    getOne() {
        this.categoryService.getOne({categoryId: this.categoryId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: CategoryDto.Create) => {
            console.log('getOne', res);
            if (res) {
                this.category = res;
                this.categoryCopy = JSON.parse(JSON.stringify(res));
                // this.changeCategoryProperty();
            }
        });
    }

    checkIfTitleIsUnique(form) {
        this.doSave = true;
        console.log('this.category', this.category);
        if (form.invalid) {
            DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            return;
        }
        if (!this.category.parentId) {
            DefaultNotify.notifyDanger('دسته والد وارد شود.', '', NotiConfig.notifyConfig);
            return;
        }
        if (!this.category.categoryType && this.category.parentId === 'ROOT') {
            DefaultNotify.notifyDanger('نوع دسته  وارد شود.', '', NotiConfig.notifyConfig);
            return;
        }
        this.disabledButton = true;
        this.loading = true;
        if (this.category.title !== this.categoryCopy.title) {
            this.categoryService.checkIfTitleIsUnique({title: this.category.title}).subscribe((res: boolean) => {
                if (res) {
                    DefaultNotify.notifyDanger('عنوان وارد شده تکراری است.', '', NotiConfig.notifyConfig);
                    this.loading = false;
                    this.disabledButton = false;
                    return;
                } else {
                    this.action(form);
                }
            });
        } else {
            this.action(form);
        }
    }

    action(form) {

        if (this.mode === ActionMode.ADD) {
            this.categoryService.create(this.category)
                .pipe(takeUntilDestroyed(this)).subscribe(res => {
                this.disabledButton = false;
                this.loading = false;
                if (res) {
                    DefaultNotify.notifySuccess('با موفقیت افزوده شد.', '', NotiConfig.notifyConfig);
                    this.cancel();
                }
            }, error => {
                this.loading = false;

            });
        } else if (this.mode === ActionMode.EDIT) {
            this.categoryService.update(this.category, {categoryId: this.categoryId})
                .pipe(takeUntilDestroyed(this)).subscribe(res => {
                this.disabledButton = false;
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

    cancel() {
        this.location.back();
    }

    ngOnDestroy(): void {
    }


    onChangeUploader(input, event) {
        if (input.files.length > 0) {
            this.files = [];
            for (const i of input.files) {
                console.log(i.size);
                const fe = i.name.split('.').pop();
                if (this.ext.includes(fe) === false) {
                    this.fileLoader = false;
                    DefaultNotify.notifyWarning('نوع فایل انتخابی مورد قبول نیست.', '', NotiConfig.notifyConfig);
                    return;
                }
                if (i.size < 10485760) {
                    const file: FileModel = new FileModel();
                    const f = i.type.split('/');
                    file.name = i.name;
                    file.type = f[0];
                    file.lastModified = i.lastModified;
                    this.fileModel.push(file);
                    this.onUploadFile(i);
                } else {
                    DefaultNotify.notifyWarning('حجم فایل ' + i.name + 'نباید بیشتر از ۱۰ مگابایت باشد.', '', NotiConfig.notifyConfig);
                }
            }
            if (this.files.length > 0) {
            }
        }
    }

    onUploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);
        this.loading = true;
        this.uploadService.uploadImage(formData).subscribe((data: any) => {
            if (data && data.id) {
                this.category.image = data;
                this.loading = false;

            } else {
                this.loading = false;
                DefaultNotify.notifyDanger('مشکلی رخ داد , دوباره تلاش کنید.', '', NotiConfig.notifyConfig);
                return;
            }
        });
    }


    changeProperty() {
        const index = this.category.properties.findIndex(e => e.id === this.selectedProperty.id);
        if (index !== -1) {
            // this.category.properties.splice(index, 1);
            DefaultNotify.notifyDanger('این مشخصه قبلا انتخاب شده است.', '', NotiConfig.notifyConfig);
            return;
        }
        this.category.properties.push(this.propertyList.find(property => property.id === this.selectedProperty.id));
        this.selectedProperty = new PropertyDto.Create();
        this.selectedProperty.id = '-1';

    }

    deleteProperty(id) {
        // this.propertyList.push(this.category.properties.find(property => property.id === id));
        this.category.properties = this.category.properties.filter(property => property.id !== id);
    }

    changeParent() {
        // =================این سه کد کامنت شده در پایین به علت حذف parentCategory از مدل می باشد.==============
        if (isNullOrUndefined(this.category.parentId)) {
            this.category.parentId = 'ROOT';
        }
        if (this.category.parentId === 'ROOT') {
            // // this.category.parentCategory = new CategoryDto.Create();
            // if (this.category.parentId === this.categoryCopy.parentId) {
            //   this.category.properties = this.categoryCopy.properties;
            // } else {
            //   this.category.properties = [];
            // }
        } else {
            // this.category.parentCategory = this.categoryList.find(category => category.id === this.category.parentId);
            this.category.categoryType = this.categoryList.find(category => category.id === this.category.parentId).categoryType;
            // this.category.properties = this.category.parentCategory.properties;
            const length = this.category.properties.length - 1;
            for (let i = 0; i <= length; i++) {
                // this.propertyList = this.propertyList.filter(property => property.id !== this.category.properties[i].id);
            }
        }
    }

    getPropertyOfCategory() {
        this.category.properties = this.category.properties.filter(p => !p.parentCategoryId);
        this.categoryService.getPropertyOfCategory({categoryId: this.category.parentId}).subscribe((res: any) => {
            if (res) {
                if (res.properties.length > 0) {
                    for (const item of res.properties) {
                        const property = item as PropertyDto.Create;
                        property.parentCategoryId = this.category.parentId;
                        const exist = this.category.properties.some(e => e.id === property.id);
                        if (!exist) {
                            // this.category.properties.splice(index, 1);
                            this.category.properties.push(property);
                        }
                        console.log(property);
                    }
                    // this.category.properties
                }
            }

        });
    }

    deleteImage() {
        this.category.image = new DocumentFile();
        this.files = [];
    }

    loadingChangePropertyCategory = false;

    changePropertyCategory() {
        this.propertyList = [];
        this.loadingChangePropertyCategory = true;

        this.propertyService.getPropertyByPropertyCategoryId({propertyCategoryId: this.selectedPropertyCategory}).subscribe(res => {
            this.loadingChangePropertyCategory = false;
            if (res) {
                if (this.category.properties) {
                    if (this.category.properties.length > 0) {
                        for (const item of res) {
                            // if (!this.checkHasProperty(item.id)) {
                            this.propertyList.push(item);
                            // }
                        }
                    } else {
                        this.propertyList = res;
                    }
                } else {
                    this.propertyList = res;
                }
            }
        }, error => {
            this.loadingChangePropertyCategory = false;
        });
    }

    checkHasProperty(id) {
        return this.category.properties.find(item => {
            return item.id === id;
        });
    }

}
