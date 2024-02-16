import {Component, OnDestroy, OnInit} from '@angular/core';
import {
    ActionMode,
    DefaultNotify,
    EnumHandle,
    isNullOrUndefined,
    PageContainer,
    Paging,
    Toolkit2
} from '@angular-boot/util';
import {MyPattern} from '../../../../shared/shared/tools/myPattern';
import {PropertyDto} from '../../../basicInformation/property/model/dto/propertyDto';
import {FileModel} from '../../../../shared/model/fileModel';
import {Location} from '@angular/common';
import {PropertyService} from '../../../basicInformation/property/endpoint/property.service';
import {UploadService} from '../../../../shared/service/upload.service';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular-boot/core';
import {AssetTemplateDto} from '../../model/dto/assetTemplateDto';
import {
    AssetTemplatePersonnelDTO,
    AssetTemplateService,
    AssignedToGroup,
    AssignedToPerson
} from '../../endpoint/asset-template.service';
import {CategoryDto} from '../../../category/model/dto/categoryDto';
import {CategoryService} from '../../../category/endpoint/category.service';
import {UserDto} from '../../../user/model/dto/user-dto';
import {UserService} from '../../../user/endpoint/user.service';
import {CompanyDto} from '../../../company/model/dto/companyDto';
import {PropertyCategoryService} from '../../../basicInformation/propertyCategory/endpoint/property-category.service';
import {PropertyCategoryDto} from '../../../basicInformation/propertyCategory/model/dto/property-category-dto';
import {UserType} from "../../../securityManagement/model/userType";
import {UserTypeService} from "../../../securityManagement/endpoint/user-type.service";
import {ProjectDto} from "../../../project/model/dto/projectDto";
import DocumentFile = CompanyDto.DocumentFile;
import PropertyType = PropertyDto.PropertyType;
import ValueType = PropertyDto.ValueType;
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

declare var $: any;

@Component({
    selector: 'app-asset-template-action',
    templateUrl: './asset-template-action.component.html',
    styleUrls: ['./asset-template-action.component.scss']
})
export class AssetTemplateActionComponent implements OnInit, OnDestroy {

    mode: ActionMode = ActionMode.ADD;
    actionMode = ActionMode;
    assetTemplate = new AssetTemplateDto.Create();
    assetTemplateCopy = new AssetTemplateDto.Create();
    assetTemplateId: string;
    myPattern = MyPattern;
    propertyList: PropertyDto.Create[] = [];
    files: File[] = [];
    fileModel: FileModel[] = [];
    categoryList: CategoryDto.Create[] = [];
    subCategoryList: CategoryDto.Create[] = [];
    userList: UserDto.Create[] = [];
    doSave = false;
    selectedProperty: PropertyDto.Create = new PropertyDto.Create();
    propertyTypeList: any [] = [];
    selectedUser: UserDto.Create = new UserDto.Create();
    propertyType = PropertyType;
    valueOfKay: string;
    propertyMode = ActionMode.ADD;
    disabledButton = false;
    selectedPropertyCategory: any;
    propertyCategoryList: PropertyCategoryDto.Create [] = [];
    valueType = ValueType;
    toolKit2 = Toolkit2;


    ext: string[] = ['jpg', 'jpeg', 'webp', 'psd', 'tiff', 'JPG', 'JPEG', 'webp', 'PSD', 'TIFF'];
    uploadLoading = false;


    constructor(public location: Location,
                public assetTemplateService: AssetTemplateService,
                public categoryService: CategoryService,
                public propertyService: PropertyService,
                public uploadService: UploadService,
                public userService: UserService,
                public router: Router,
                private propertyCategoryService: PropertyCategoryService,
                public userTypeService: UserTypeService,
                private activatedRoute: ActivatedRoute) {
        this.propertyTypeList = EnumHandle.getAsValueTitleList(PropertyDto.PropertyType);
        // this.assetTemplate.parentCategoryId = '-1';
        this.assetTemplate.subCategoryId = '-1';
        this.selectedProperty.id = '-1';
        this.selectedUser.id = '-1';
        this.mode = this.activatedRoute.snapshot.queryParams.mode;
        this.assetTemplateId = this.activatedRoute.snapshot.queryParams.entityId;
    }

    ngOnInit() {
        this.getAllCategory();
        // this.getAllUsers();
        if (this.mode !== ActionMode.ADD) {
            if (!isNullOrUndefined(this.assetTemplateId)) {
                this.getOne();
            }
        }
    }

    getAllCategory() {
        this.categoryService.getAll().subscribe((res: CategoryDto.Create[]) => {
            if (res && res.length) {
                this.categoryList = res;
            }
        });
    }

    // getAllUsers() {
    //   this.userService.getAll().pipe(takeUntilDestroyed(this))
    //     .subscribe((res: UserDto.Create[]) => {
    //       if (res && res.length) {
    //         this.userList = res;
    //       }
    //     });
    // }

    getAllUsers() {
        this.userService.getAllTow().subscribe((res: any) => {
            if (res && res.length) {
                this.userList = res;
                if (this.mode !== ActionMode.ADD) {
                    if (!isNullOrUndefined(this.assetTemplateId)) {
                        this.filterUser();
                    }
                }
            }
        });
    }

    getSubCategoryList(id) {
        this.categoryService.getChildrenById({parentId: id}).subscribe((res: any) => {
            if (res) {
                this.subCategoryList = res;
            }
        });
    }

    getAllProperty() {
        this.propertyService.getAll()
            .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            if (!isNullOrUndefined(res)) {
                this.propertyList = res;
            }
        });
    }

    newItem = [];

    getOne() {
        this.assetTemplate = new AssetTemplateDto.Create();

        this.assetTemplateService.getOne({assetTemplateId: this.assetTemplateId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: AssetTemplateDto.Create) => {
            if (res) {
                this.assetTemplate = res;
                this.getPropertyOfAssetTemplate();


                this.assetTemplateCopy = JSON.parse(JSON.stringify(this.assetTemplate));
                setTimeout(e => {
                    this.changeCategory(true);
                }, 200);
            }
        });
    }


    filterUser() {
        for (let user of this.userList) {
            for (let item of this.assetTemplate.users) {
                if (user.id === item.id) {
                    // item = user;
                    // const newItems = [];
                    this.newItem.push(user);
                }
            }
        }
        this.assetTemplate.users = [];
        this.assetTemplate.users = this.newItem;
    }

    loading = false;

    checkIfAssetTemplateNameIsUnique(form, type?) {
        this.doSave = true;
        if (form.invalid) {
            DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            return;
        }
        if (type === 'next') {
            this.next();
        }
        // if (this.assetTemplate === this.assetTemplateCopy) {
        if (JSON.stringify(this.assetTemplate) === JSON.stringify(this.assetTemplateCopy)) {
            if (type !== 'next') {

                DefaultNotify.notifyDanger(' تغییر اعمال نشده  .', '', NotiConfig.notifyConfig);
            }
            return;
        }
        this.loading = true;
        if (this.assetTemplate.name === this.assetTemplateCopy.name && this.mode === ActionMode.EDIT) {
            this.action(form);
        } else {
            this.assetTemplateService.checkIfAssetTemplateNameIsUnique({name: this.assetTemplate.name}).subscribe((res: boolean) => {
                if (res) {
                    DefaultNotify.notifyDanger('عنوان وارد شده تکراری است.', '', NotiConfig.notifyConfig);
                    this.loading = false;
                } else {
                    this.action(form);
                }
            });
        }
    }

    action(form) {
        this.disabledButton = true;
        if (this.mode === ActionMode.ADD) {
            this.assetTemplateService.create(this.assetTemplate)
                .pipe(takeUntilDestroyed(this)).subscribe(res => {
                this.disabledButton = false;
                this.loading = false;
                if (res) {
                    this.assetTemplateId = res;
                    this.assetTemplate.id = res;
                    this.mode = ActionMode.EDIT;
                    this.assetTemplateCopy = JSON.parse(JSON.stringify(this.assetTemplate));
                    DefaultNotify.notifySuccess('با موفقیت افزوده شد.', '', NotiConfig.notifyConfig);
                    this.router.navigate([], {
                        queryParams: {mode: 'EDIT', assetTemplateId: res},
                        relativeTo: this.activatedRoute
                    });
                    // form.reset();
                    this.updateAssetTemplateProperties('action');

                } else {
                    DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.', '', NotiConfig.notifyConfig);
                }
            }, error => {
                this.loading = false;

            });
        } else if (this.mode === ActionMode.EDIT) {
            this.assetTemplateService.update(this.assetTemplate, {assetTemplateId: this.assetTemplateId})
                .pipe(takeUntilDestroyed(this)).subscribe(res => {
                this.mode = ActionMode.EDIT;
                this.disabledButton = false;
                this.assetTemplateCopy = JSON.parse(JSON.stringify(this.assetTemplate));
                this.loading = false;
                this.updateAssetTemplateProperties('action');
                if (res) {
                    DefaultNotify.notifySuccess('ویرایش با موفقیت انجام شد.', '', NotiConfig.notifyConfig);
                    // this.cancel();
                } else {
                    DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.', '', NotiConfig.notifyConfig);
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

    changeCategory(update?: boolean) {
        if (this.assetTemplate.parentCategoryId) {
            this.assetTemplate.parentCategoryType = this.categoryList.find(c => c.id === this.assetTemplate.parentCategoryId).categoryType;
        }
        if (!update) {
            this.assetTemplate.subCategoryId = '-1';
            this.assetTemplate.subCategoryTitle = '';
            this.assetTemplateProperties = this.assetTemplateProperties.filter(p => p.data.length > 0);
            if (this.categoryList && this.categoryList.length && this.categoryList.length > 0) {
                const category = this.categoryList.find(c => c.id === this.assetTemplate.parentCategoryId);
                for (const property of category.properties) {
                    const exist = this.assetTemplateProperties.some(p => p.id === property.id);
                    if (!exist) {
                        this.assetTemplateProperties.push(property);
                    }

                }
                // this.assetTemplateProperties = this.categoryList.find(category =>
                // category.id === this.assetTemplate.parentCategoryId).properties;
            }


        }
        if (this.categoryList && this.categoryList.length && this.categoryList.length > 0) {

            // this.assetTemplate.parentCategoryTitle =
            //     this.categoryList.find(category => category.id === this.assetTemplate.parentCategoryId).title;
            this.getSubCategoryList(this.assetTemplate.parentCategoryId);
            this.filterPropertyList();
        }

    }

    changeSubCategory() {
        if (this.assetTemplate.subCategoryId !== '-1') {
            this.assetTemplate.subCategoryTitle = this.subCategoryList.find(c =>
                c.id === this.assetTemplate.subCategoryId).title;

            const category = this.subCategoryList.find(c => c.id === this.assetTemplate.subCategoryId);
            for (const property of category.properties) {
                const exist = this.assetTemplateProperties.some(p => p.id === property.id);
                if (!exist) {
                    this.assetTemplateProperties.push(property);
                }

            }


            // this.assetTemplateProperties = this.subCategoryList.find(category => category.id === this.assetTemplate.subCategoryId).properties;
            this.filterPropertyList();
        }
    }

    filterPropertyList() {
        const length = this.assetTemplateProperties.length - 1;
        for (let i = 0; i <= length; i++) {
            // this.propertyList = this.propertyList.filter(property => property.id !== this.assetTemplateProperties[i].id);
        }
    }


    onChangeUploader(input, event) {

        if (input.files.length > 0) {
            this.files = [];
            const fe = input.files[0].name.split('.').pop();

            if (this.ext.includes(fe) === false) {
                DefaultNotify.notifyDanger('نوع فایل انتخابی مورد قبول نمی باشد', '', NotiConfig.notifyConfig);
                return;
            }
        }
        if (input.files.length > 0) {
            this.files = [];
            for (const i of input.files) {
                if (i.size < 100000000) {
                    const file: FileModel = new FileModel();
                    const f = i.type.split('/');
                    file.name = i.name;
                    file.type = f[0];
                    file.lastModified = i.lastModified;
                    this.fileModel.push(file);
                    this.onUploadFile(i);
                } else {
                    DefaultNotify.notifyWarning('حجم فایل ' + i.name + 'نباید بیشتر از ۱۰۰ مگابایت باشد.', '', NotiConfig.notifyConfig);
                }
            }
            if (this.files.length > 0) {
            }
        }
    }

    onUploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);
        this.uploadLoading = true;

        this.uploadService.uploadImage(formData).subscribe((data: any) => {
            this.uploadLoading = false;

            if (data && data.id) {
                this.assetTemplate.image = data;
            }
        });
    }

    deleteProperty(id) {
        const properties = this.assetTemplateProperties.find(property => property.id === id);
        properties.data = [];
        this.propertyList.push(properties);
        this.assetTemplateProperties = this.assetTemplateProperties.filter(property => property.id !== id);
        this.selectedProperty = new PropertyDto.Create();
        this.selectedProperty.id = '-1';
    }

    changeUser() {
        if (this.selectedUser.id !== '-1' && this.selectedUser.id) {

            this.assetTemplate.users.push(this.userList.find(user => user.id === this.selectedUser.id));

            this.userList = this.userList.filter(user => user.id !== this.selectedUser.id);
            this.selectedUser = new UserDto.Create();
            this.selectedUser.id = '-1';
        }
    }

    deleteUser(id) {
        this.userList.push(this.assetTemplate.users.find(user => user.id === id));
        this.assetTemplate.users = this.assetTemplate.users.filter(user => user.id !== id);
    }

    deleteImage() {
        this.assetTemplate.image = new DocumentFile();
        this.files = [];
    }

    addProperty() {

        if (this.propertyMode === ActionMode.EDIT) {

            if (this.selectedProperty.type === PropertyType[PropertyType.keyValue.toString()]) {
                if (!this.valueOfKay) {
                    DefaultNotify.notifyDanger('ابتدا مقدار وارد گردد!', '', NotiConfig.notifyConfig);
                    return;
                }

                this.selectedProperty.data = [];
                this.selectedProperty.data.push(this.valueOfKay);
            }
            if (!this.selectedProperty.data.length) {
                DefaultNotify.notifyDanger('ابتدا مقدار انتخاب گردد!', '', NotiConfig.notifyConfig);
                return;
            }
            //     property.id === this.selectedProperty.id));
            //     property.id === this.selectedProperty.id)]);
            if (!this.selectedProperty.data.length) {
                DefaultNotify.notifyDanger('ابتدا مقدار انتخاب گردد!', '', NotiConfig.notifyConfig);
                return;
            }
            this.assetTemplateProperties[this.assetTemplateProperties.findIndex(property => property.id
                === this.selectedProperty.id)] = this.selectedProperty;


        } else if (this.propertyMode === ActionMode.ADD) {
            const index = this.assetTemplateProperties.findIndex(e => e.id === this.selectedProperty.id);

            if (this.selectedProperty.type === PropertyType[PropertyType.keyValue.toString()]) {
                if (!this.valueOfKay) {
                    DefaultNotify.notifyDanger('ابتدا مقدار وارد گردد!', '', NotiConfig.notifyConfig);
                    return;
                }
                this.selectedProperty.data = [];
                this.selectedProperty.data.push(this.valueOfKay);
            }
            if (!this.selectedProperty.data.length) {
                DefaultNotify.notifyDanger('ابتدا مقدار انتخاب گردد!', '', NotiConfig.notifyConfig);
                return;
            }
            if (index !== -1) {
                this.assetTemplateProperties.splice(index, 1);
            }
            this.assetTemplateProperties.push(this.selectedProperty);
        }

        // this.propertyList = this.propertyList.filter(property => property.id !== this.selectedProperty.id);

        this.valueOfKay = null;
        this.selectedProperty = new PropertyDto.Create();
        this.propertyMode = ActionMode.ADD;
        this.selectedProperty.id = '-1';

    }

    addOrRemoveData(item: string) {
        if (this.selectedProperty.data.find(d => d === item)) {
            this.selectedProperty.data = this.selectedProperty.data.filter(d => d !== item);
        } else {
            this.selectedProperty.data.push(item);
        }
    }

    addValueInData(item: string) {
        this.selectedProperty.data = [];
        this.selectedProperty.data.push(item);
    }

    previousData: Array<string> = [];

    editProperty(item: PropertyDto.Create) {
        this.selectedProperty = new PropertyDto.Create();
        this.selectedProperty = item;

        if (this.selectedProperty.type === this.propertyType[this.propertyType.keyValue.toString()] &&
            this.selectedProperty.data && this.selectedProperty.data.length === 1) {
            this.valueOfKay = this.selectedProperty.data[0];
        }
        // this.propertyList = this.propertyList.filter(property => property.id !== this.selectedProperty.id);
        this.previousData = JSON.parse(JSON.stringify(this.selectedProperty.data));

        this.propertyMode = ActionMode.EDIT;
    }

    checkChecked(item: string) {
        if (!isNullOrUndefined(this.selectedProperty.data.find(value => value === item))) {
            return true;
        }
        return false;
    }

    cancelEditProperty() {
        this.selectedProperty.data = this.previousData;
        this.propertyMode = this.actionMode.ADD;
        this.selectedProperty = new PropertyDto.Create();
        this.selectedProperty.id = '-1';
    }

    next() {
        $('#assetCreate').carousel('next');
        this.getPropertyCategory();
        if (this.assetTemplate.parentCategoryId !== this.assetTemplateCopy.parentCategoryId ||
            this.assetTemplate.subCategoryId !== this.assetTemplateCopy.subCategoryId
        ) {
            // this.updateAssetTemplateProperties();
        } else {
            this.getPropertyOfAssetTemplate();
        }

    }

    prev() {
        $('#assetCreate').carousel('prev');
        if (JSON.stringify(this.assetTemplatePropertiesCopy) !== JSON.stringify(this.assetTemplateProperties)) {
            this.updateAssetTemplateProperties('prev');
        }
    }


    getPropertyCategory() {
        this.propertyCategoryService.getAllPropertyCategoryTitle().subscribe(res => {
            if (res) {
                this.propertyCategoryList = res;
            }
        });
    }

    assetTemplateProperties: PropertyDto.Create[] = [];
    assetTemplatePropertiesCopy: PropertyDto.Create[] = [];

    getPropertyOfAssetTemplate() {
        this.assetTemplateService.getPropertyOfAssetTemplate({assetTemplateId: this.assetTemplateId}).subscribe(res => {
            if (res) {
                if (res.properties) {
                    if (res.properties.length > 0) {
                        for (const p of res.properties) {
                            if (!this.assetTemplateProperties.some(ap => ap.id === p.id)) {
                                this.assetTemplateProperties.push(p);
                            }
                        }
                        this.assetTemplatePropertiesCopy = JSON.parse(JSON.stringify(this.assetTemplateProperties));

                        // this.assetTemplateProperties = this.assetTemplateProperties.concat(res.properties);
                    }
                }
            }
        });
    }

    loadingUpdateAssetTemplateProperties = false;

    updateAssetTemplateProperties(type?) {
        if (this.loadingUpdateAssetTemplateProperties) {
            return;
        }
        this.loadingUpdateAssetTemplateProperties = true;
        this.assetTemplateService.updateAssetTemplateProperties(
            {assetTemplateId: this.assetTemplateId},
            this.assetTemplateProperties).subscribe(res => {
            this.loadingUpdateAssetTemplateProperties = false;
            this.getPropertyOfAssetTemplate();

            if (res) {
                if (type === 'edit') {
                    DefaultNotify.notifySuccess('با موفقیت ویرایش شد.', '', NotiConfig.notifyConfig);
                }
            }
        }, error => {
            this.loadingUpdateAssetTemplateProperties = false;
        });
    }

    changePropertyCategory() {
        this.propertyList = [];
        this.propertyService.getPropertyByPropertyCategoryId({propertyCategoryId: this.selectedPropertyCategory}).subscribe(res => {
            if (res) {
                if (this.assetTemplateProperties) {
                    if (this.assetTemplateProperties.length > 0) {
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
        });
    }

    checkHasProperty(id) {
        return this.assetTemplateProperties.find(item => {
            return item.id === id;
        });
    }

    //////////////////////////////////////////////////////////
    userTypeList2: UserType[] = [];
    loadingUserTypeList2 = true;
    selectedUserTypeId2: string;
    parentUserId2 = '';
    userList2: UserDto.Create[] = [];
    loadingUserList2 = false;

    allowGetAllUserType = true;
    assetTemplateUsers: AssetTemplatePersonnelDTO[] = [];

    selectUser() {
        if (this.parentUserId2 !== '-1' && this.parentUserId2) {
            if (this.assetTemplateUsers.some(user => user.userId === this.parentUserId2)) {
                DefaultNotify.notifyDanger('کاربر قبلا انتخاب شده است.', '', NotiConfig.notifyConfig);
                setTimeout(e => {
                    this.parentUserId2 = null;
                }, 10);
                return;
            }
            const selectedUser = new AssetTemplatePersonnelDTO();
            const index = this.userList2.findIndex(user => user.id === this.parentUserId2);
            selectedUser.userId = this.userList2[index].id;
            selectedUser.userFamily = this.userList2[index].family;
            selectedUser.userName = this.userList2[index].name;
            selectedUser.userTypeId = this.userList2[index].userTypeId;
            selectedUser.userTypeName = this.userList2[index].userTypeName;
            this.assetTemplateUsers.push(selectedUser);
            setTimeout(e => {
                this.parentUserId2 = null;
            }, 10);
        }
    }

    getAllUserType() {
        if (this.allowGetAllUserType) {
            this.loadingUserTypeList2 = true;
            this.allowGetAllUserType = false;
            this.userTypeService.getAllRole()
                .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
                this.loadingUserTypeList2 = false;
                if (!isNullOrUndefined(res)) {
                    this.userTypeList2 = res;
                }
            });
        }
    }

    assignedToGroupList: AssignedToGroup[] = [];

    changeUserType(event: UserType) {
        this.parentUserId2 = null;
        this.userList2 = [];
        if (event) {
            this.selectedUserTypeId2 = event.id;
            if (this.assignedToGroup) {
                const item = {
                    userTypeId: event.id,
                    userTypeName: event.name
                };
                const exist = this.assignedToGroupList.some(p => p.userTypeId === item.userTypeId);
                if (exist) {
                    DefaultNotify.notifyDanger('این پست قبلا انتخاب شده است.', '', NotiConfig.notifyConfig);
                    return;
                }
                if (!exist) {
                    this.assignedToGroupList.push(item);
                }
                setTimeout(e => {
                    this.selectedUserTypeId2 = null;
                }, 10);
                return;
            }
            this.getAllUsersOfUserType();
        }

    }

    getAllUsersOfUserType() {
        const paging = new Paging();
        paging.size = 15;
        this.loadingUserList2 = true;
        this.userService.getAllUsersOfUserType({paging, totalElements: 0, userTypeId: this.selectedUserTypeId2})
            .pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<UserDto.Create>) => {
            this.loadingUserList2 = false;
            if (this.userList2.length === 0) {
                this.userList2 = res.content;
            } else {
                this.userList2 = this.userList2.concat(res.content);
            }
            // this.userList2 = this.userList2.filter(u => u.id !== this.userId);

        });
    }

    getGroupOfProjectAllow = true;

    getGroupPersonnelOfAssetTemplate() {
        if (this.getGroupOfProjectAllow) {
            // if (this.project.users.length > 0) {
            this.getGroupOfProjectAllow = false;
            this.assetTemplateService.getGroupPersonnelOfAssetTemplate({assetTemplateId: this.assetTemplateId}).subscribe((res: any) => {
                if (res) {
                    this.assignedToGroupList = res;
                }
            });
            // }
        }
    }

    deleteUser2(id) {
        // this.userList2.push(this.projectUsers.find(user => user.id === id));
        this.assetTemplateUsers = this.assetTemplateUsers.filter(user => user.userId !== id);
        setTimeout(e => {
            this.parentUserId2 = null;
        }, 10);
        // this.selectedUser.id = '';
    }

    deleteGroup(id) {
        // this.userList2.push(this.projectUsers.find(user => user.id === id));
        this.assignedToGroupList = this.assignedToGroupList.filter(group => group.userTypeId !== id);
        setTimeout(e => {
            this.selectedUserTypeId2 = null;
        }, 10);
        // this.selectedUser.id = '';
    }

    loadingAddGroupPersonnelToAssetTemplate = false;

    addGroupPersonnelToAssetTemplate() {
        if (this.loadingAddPersonnelToAssetTemplate || this.loadingAddGroupPersonnelToAssetTemplate) {
            return;
        }
        this.loadingAddGroupPersonnelToAssetTemplate = true;
        this.assetTemplateService.addGroupPersonnelToAssetTemplate(this.assignedToGroupList,
            {assetTemplateId: this.assetTemplateId}).subscribe((res: any) => {
            this.loadingAddGroupPersonnelToAssetTemplate = false;

            if (res) {
                DefaultNotify.notifySuccess('با موفقیت ثبت شد.', '', NotiConfig.notifyConfig);
            }
        }, error => {
            this.loadingAddGroupPersonnelToAssetTemplate = false;

        });
    }

    loadingAddPersonnelToAssetTemplate = false;

    addPersonnelToAssetTemplate() {
        if (this.loadingAddPersonnelToAssetTemplate || this.loadingAddGroupPersonnelToAssetTemplate) {
            return;
        }
        // this.project.users = this.projectUsers.map(e => e.id && e.userTypeId);

        const assignedToPersonList: AssignedToPerson[] = [];
        for (const item of this.assetTemplateUsers) {
            const dto = {
                userId: item.userId,
                userTypeId: item.userTypeId
            };
            assignedToPersonList.push(dto);
        }
        this.loadingAddPersonnelToAssetTemplate = true;
        this.assetTemplateService.addPersonTypePersonnel(assignedToPersonList,
            {assetTemplateId: this.assetTemplateId}).subscribe((res: any) => {
            this.loadingAddPersonnelToAssetTemplate = false;
            if (res) {
                DefaultNotify.notifySuccess('با موفقیت ثبت شد.', '', NotiConfig.notifyConfig);
            }
        }, error => {
            this.loadingAddPersonnelToAssetTemplate = false;
        });
    }

    getAllUsers2Allow = true;

    getAllUsers2() {
        if (this.getAllUsers2Allow === true) {
            this.getAllUsers2Allow = false;
            this.assetTemplateService.getPersonnelOfAssetTemplate({assetTemplateId: this.assetTemplateId}).subscribe((res: any) => {
                if (res && res.length) {
                    this.assetTemplateUsers = res;
                    if (this.mode !== ActionMode.ADD) {
                        if (!isNullOrUndefined(this.assetTemplateId)) {
                            this.filterUser();
                        }
                    }
                }
            });
        }
    }

    //////////////////////////////////////////////////////////
    assignedToUser = true;
    assignedToGroup = false;

    openAssignedToUserCard(event) {
        this.selectedUserTypeId2 = null;
        this.parentUserId2 = null;
        if (event.source._checked) {
            this.assignedToUser = true;
            this.assignedToGroup = false;
        }
    }

    openAssignedToGroupCard(event) {
        this.selectedUserTypeId2 = null;
        this.getGroupPersonnelOfAssetTemplate();
        if (event.source._checked) {
            this.assignedToGroup = true;
            this.assignedToUser = false;
        }
    }
}
