import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ActionMode, DefaultNotify, EnumHandle, isNullOrUndefined, ModalSize, Toolkit2} from '@angular-boot/util';
import {AssetDto} from '../../model/dto/assetDto';
import {MyPattern} from '../../../../shared/shared/tools/myPattern';
import {AssetTemplateDto} from '../../../assetTemplate/model/dto/assetTemplateDto';
import {UserDto} from '../../../user/model/dto/user-dto';
import {Location} from '@angular/common';
import {AssetService} from '../../endpoint/asset.service';
import {UploadService} from '../../../../shared/service/upload.service';
import {AssetTemplateService} from '../../../assetTemplate/endpoint/asset-template.service';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular-boot/core';
import {FileModel} from '../../../../shared/model/fileModel';
import {CategoryDto} from '../../../category/model/dto/categoryDto';
import {CompanyDto} from '../../../company/model/dto/companyDto';
import {ModalUtil} from '@angular-boot/widgets';
import {ActivityService} from '../../../activity/service/activity.service';
import DocumentFile = CompanyDto.DocumentFile;
import CategoryType = CategoryDto.CategoryType;
import {PropertyDto} from '../../../basicInformation/property/model/dto/propertyDto';
import {AssetCategoryService} from '../../../basicInformation/asset-category/endpoint/asset-category.service';
import {NotiConfig} from "../../../../shared/tools/notifyConfig";
import {ImageCompressorService} from "../../../../shared/tools/image-compressor.service";

declare var $: any;

@Component({
    selector: 'app-tree-action',
    templateUrl: './tree-action.component.html',
    styleUrls: ['./tree-action.component.scss']
})
export class TreeActionComponent implements OnInit, OnDestroy {

    constructor(
        public location: Location,
        public router: Router,
        public assetService: AssetService,
        public uploadService: UploadService,
        public activityService: ActivityService,
        public assetTemplateService: AssetTemplateService,
        private activatedRoute: ActivatedRoute,
        private assetCategoryService: AssetCategoryService,
        private imageCompressService: ImageCompressorService
    ) {

        this.activatedRoute.queryParams.subscribe(params => {
            params.mode ? this.mode = params.mode : '';
            params.entityId ? this.assetId = params.entityId : '';
            params.from ? this.from = params.from : '';
        });
        // this.asset.assetTemplateId = '-1';
        // this.selectedUser.id = '-1';
        // this.mode = this.activatedRoute.snapshot.queryParams.mode;
        // this.assetId = this.activatedRoute.snapshot.queryParams.entityId;
        this.categoryTypeList = EnumHandle.getAsValueTitleList(CategoryDto.CategoryType);
        this.assetPriorityList = EnumHandle.getAsValueTitleList(CategoryDto.AssetPriority);
    }

    @Input() mode: ActionMode = ActionMode.ADD;
    @Input() assetId: string;
    @Input() from: string;
    @Output() back = new EventEmitter<any>();
    @Output() assetForUpdate = new EventEmitter<any>();

    actionMode = ActionMode;
    assetEntity = new AssetDto.CreateAsset();
    assetCopy = new AssetDto.CreateAsset();
    showBasicList;
    myPattern = MyPattern;
    files: Array<File> = [];
    fileModel: Array<any> = [];
    doSave = false;
    assetTemplateList: AssetTemplateDto.Create[] = [];
    selectedUser: UserDto.Create = new UserDto.Create();
    menuStatus = false;
    assetList: AssetDto.CreateAsset[] = [];
    categoryTypeList: any[] = [];
    assetPriorityList: any[] = [];
    assetCategoryList: any[] = [];
    activityList: any[] = [];
    showInput = false;
    sendTypeGetAll: string;
    rootBuilding = false;
    hasParent = false;

    hasBuildingParentForFacility = false;
    hasFacilityParentForFacility = false;

    hasBuildingParentForTools = false;
    hasFacilityParentForTools = false;

    parentAssetB = new Asset();
    parentAssetF = new Asset();
    parentAssetT = new Asset();
    parentAssetBCopy = new Asset();

    modeOfCategoryType: string;
    disabledButton = false;
    tabTitle = 'ConsumedResources';

// TODO
//     اولویت با اد شدهای دستی
    assetPropertyList: PropertyDto.Create[] = [];

    loadingGetOne = false;

    loading = false;

    ext: string[] = ['jpg', 'jpeg', 'webp', 'psd', 'tiff', 'JPG', 'JPEG', 'webp', 'PSD', 'TIFF'];
    tabList = [false, false, false, false, false, false, false]

    ngOnInit() {
        this.activityList = [];
        this.getAllActivity();

        if (this.mode === ActionMode.EDIT || this.mode === ActionMode.VIEW) {
            if (!isNullOrUndefined(this.assetId)) {
                this.getOne();
                this.getPropertyListByAssetId();
                this.menuStatus = true;
            }
        } else if (this.mode === ActionMode.ADD) {
            this.assetEntity.status = true;

        }
        this.getAllAssetTemplate();
        this.getAllAssetCategory();
    }

    getAllAssetCategory() {
        this.assetCategoryService.getAll().subscribe((res: any) => {
            if (res) {
                this.assetCategoryList = res;
            }
        });
    }

    getAllAssetTemplate(type?) {
        // this.parentAssetB = new Asset();
        // this.parentAssetF = new Asset();
        // this.parentAssetT = new Asset();
        this.showInput = true;
        if (type !== 'getOne') {
            // this.asset.assetTemplateId = null;
            if (this.assetEntity.id) {
                return;
            }
        }
        this.assetTemplateList = [];
        if (this.assetEntity.categoryType === CategoryType[CategoryType.BUILDING.toString()]) {
            this.modeOfCategoryType = 'B';
            if (this.mode === ActionMode.ADD) {
                this.rootBuilding = false;
                this.hasParent = false;
                setTimeout(() => {
                    $('#rootBuilding').click();
                }, 200);
            }
            if (this.mode === ActionMode.EDIT) {
                if (this.assetEntity.isPartOfAsset) {
                    setTimeout(() => {
                        $('#hasParent').click();
                    }, 200);
                    // this.parentAssetB =
                } else {
                    setTimeout(() => {
                        $('#rootBuilding').click();
                    }, 200);
                }
            }
        }
        if (this.assetEntity.categoryType === CategoryType[CategoryType.FACILITY.toString()]) {
            this.modeOfCategoryType = 'F';
            if (this.mode === ActionMode.ADD) {
                this.hasBuildingParentForFacility = false;
                this.hasFacilityParentForFacility = false;
            }
            if (this.mode === ActionMode.EDIT) {
                if (this.assetEntity.isPartOfAsset && this.parentAssetB.categoryType === CategoryType[CategoryType.BUILDING.toString()]) {
                    setTimeout(() => {
                        $('#hasBuildingParentForFacility').click();
                    }, 200);
                    // this.parentAssetB =

                } else if (this.assetEntity.isPartOfAsset && this.parentAssetB.categoryType === CategoryType[CategoryType.FACILITY.toString()]) {
                    setTimeout(() => {
                        $('#hasFacilityParentForFacility').click();
                    }, 200);
                    this.parentAssetF.id = this.parentAssetB.id;
                    this.parentAssetF.isPartOfAsset = this.parentAssetB.isPartOfAsset;
                    this.parentAssetF.hasChild = this.parentAssetB.hasChild;
                    this.parentAssetF.code = this.parentAssetB.code;
                    this.parentAssetF.name = this.parentAssetB.name;
                    this.parentAssetF.status = this.parentAssetB.status;
                    this.parentAssetF.categoryType = this.parentAssetB.categoryType;
                    this.parentAssetB = new Asset();

                }
            } else if (isNullOrUndefined(this.assetEntity.isPartOfAsset)) {

            }
        }
        if (this.assetEntity.categoryType === CategoryType[CategoryType.TOOLS.toString()]) {
            this.modeOfCategoryType = 'T';
            if (this.mode === ActionMode.ADD) {
                this.hasBuildingParentForTools = false;
                this.hasFacilityParentForTools = false;
            }
            if (this.mode === ActionMode.EDIT) {
                if (this.assetEntity.isPartOfAsset && this.parentAssetB.categoryType === CategoryType[CategoryType.BUILDING.toString()]) {
                    setTimeout(() => {
                        $('#hasBuildingParentForTools').click();
                    }, 200);
                    // this.parentAssetB =
                } else if (this.assetEntity.isPartOfAsset && this.parentAssetB.categoryType === CategoryType[CategoryType.FACILITY.toString()]) {
                    setTimeout(() => {
                        $('#hasFacilityParentForTools').click();
                    }, 200);
                    this.parentAssetT.id = this.parentAssetB.id;
                    this.parentAssetT.isPartOfAsset = this.parentAssetB.isPartOfAsset;
                    this.parentAssetT.hasChild = this.parentAssetB.hasChild;
                    this.parentAssetT.code = this.parentAssetB.code;
                    this.parentAssetT.name = this.parentAssetB.name;
                    this.parentAssetT.status = this.parentAssetB.status;
                    this.parentAssetT.categoryType = this.parentAssetB.categoryType;
                    this.parentAssetB = new Asset();

                }
            } else if (isNullOrUndefined(this.assetEntity.isPartOfAsset)) {
            }
        }
        this.assetTemplateService.getAllAssetTemplate({categoryTypeValue: this.assetEntity.categoryType}).pipe(takeUntilDestroyed(this))
            .subscribe((res: AssetTemplateDto.Create[]) => {
                if (res && res.length) {
                    this.assetTemplateList = res;
                }
            });
    }

    // assetPropertyListCopy: PropertyDto.Create[] = [];

    getPropertyOfAssetTemplate() {
        if (this.assetEntity.assetTemplateId) {
            // const assetPropertyListAdd = this.assetPropertyList.filter(a => a.parentCategoryId && a.parentCategoryId.length > 0);
            this.assetPropertyList = this.assetPropertyList.filter(a => !a.parentCategoryId);
            // this.assetPropertyList = this.assetPropertyList.concat(assetPropertyListAdd);
            this.assetTemplateService.getPropertyOfAssetTemplate({assetTemplateId: this.assetEntity.assetTemplateId}).subscribe(res => {
                if (res) {
                    if (res.properties) {
                        if (res.properties.length > 0) {
                            for (const p of res.properties) {
                                //     if (!this.assetPropertyList.some(ap => ap.id === p.id)) {
                                //         this.assetPropertyList.push(p);
                                //     }
                                const assetProperty = p as PropertyDto.Create;
                                // assetProperty.parentCategoryId = this.asset.assetTemplateId;
                                if (!this.assetPropertyList.some(a => a.id === assetProperty.id)) {
                                    this.assetPropertyList.push(assetProperty);
                                }
                            }
                            // this.assetPropertyListCopy = JSON.parse(JSON.stringify(this.assetPropertyList));

                        }
                    }
                }
            });
        }
    }

    //// خواندن مشخصات
    getPropertyListByAssetId() {
        this.assetService.getPropertyListByAssetId({assetId: this.assetId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            if (res.propertyList && res.propertyList.length > 0) {
                this.assetPropertyList = res.propertyList;
            }
        });
    }

    //// بروز رسانی مشخصات

    updateAssetPropertyList() {
        // || !this.asset.assetTemplateId
        if (!this.assetEntity.name || !this.assetEntity.code || !this.assetEntity.activityIdList
            || !this.assetEntity.categoryType || !this.assetEntity.assetPriority) {
            DefaultNotify.notifyDanger('ورودی ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            return;
        }
        this.assetService.updateAssetPropertyList(this.assetPropertyList, {assetId: this.assetId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            if (res) {
                // DefaultNotify.notifySuccess('عملیات با موفقیت انجام شد.');
            } else {
                // DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.');
            }
        });
    }

    getOne() {
        this.loadingGetOne = true;
        this.assetService.getOneTow({assetId: this.assetId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: AssetDto.GetOneAsset) => {
            this.loadingGetOne = false;
            if (res) {
                this.assetEntity = res.mainAsset;
                if (!this.assetEntity.installYear) {
                    this.assetEntity.installYear = null;
                }
                if (!this.assetEntity.constructionYear) {
                    this.assetEntity.constructionYear = null;
                }
                this.assetCopy = JSON.parse(JSON.stringify(res.mainAsset));
                // this.getPropertyOfAssetTemplate();
                if (res.parentAsset) {
                    this.parentAssetB.id = res.parentAsset.id;
                    this.parentAssetB.isPartOfAsset = res.parentAsset.isPartOfAsset;
                    this.parentAssetB.hasChild = res.parentAsset.hasChild;
                    this.parentAssetB.code = res.parentAsset.code;
                    this.parentAssetB.name = res.parentAsset.name;
                    this.parentAssetB.status = res.parentAsset.status;
                    this.parentAssetB.categoryType = res.parentAsset.categoryType;
                }

                this.getAllAssetTemplate('getOne');
            }
        });
    }

    action(form, type?) {
        if (this.loadingGetOne) {
            return;
        }


        if (this.modeOfCategoryType === 'B') {
            if (this.hasParent) {
                if (!this.parentAssetB.id) {
                    DefaultNotify.notifyDanger('سالن انتخاب شود.', '', NotiConfig.notifyConfig);
                    return;
                }
            }
        }
        if (this.modeOfCategoryType === 'F') {
            if (this.hasBuildingParentForFacility) {
                if (!this.parentAssetB.id) {
                    DefaultNotify.notifyDanger('سالن انتخاب شود.', '', NotiConfig.notifyConfig);
                    return;
                }
            }
            if (this.hasFacilityParentForFacility) {
                if (!this.parentAssetF.id) {
                    DefaultNotify.notifyDanger('تجهیز انتخاب شود.', '', NotiConfig.notifyConfig);
                    return;
                }
            }
        }
        if (this.modeOfCategoryType === 'T') {
            if (this.hasBuildingParentForTools) {
                if (!this.parentAssetB.id) {
                    DefaultNotify.notifyDanger('سالن انتخاب شود.', '', NotiConfig.notifyConfig);
                    return;
                }
            }
            if (this.hasFacilityParentForTools) {
                if (!this.parentAssetT.id) {
                    DefaultNotify.notifyDanger('تجهیز انتخاب شود.', '', NotiConfig.notifyConfig);
                    return;
                }
            }
        }
        if (this.loading) {
            return;
        }
        this.doSave = true;
        // if (this.asset.name) {
        // || !this.asset.assetTemplateId
        if (!this.assetEntity.name || !this.assetEntity.code || !this.assetEntity.activityIdList
            || !this.assetEntity.categoryType || !this.assetEntity.assetPriority) {
            DefaultNotify.notifyDanger('ورودی ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            return;
        }
        this.assetEntity.name = this.assetEntity.name.trim();
        // } else
        if (!this.assetEntity.name) {
            DefaultNotify.notifyDanger('کارکتر فاصله به عنوان ورودی , صحیح نمی باشد.', '', NotiConfig.notifyConfig);
            return;
        }
        if (form.invalid) {
            DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            return;
        }
        // if (this.hasParent) {
        //     if (!this.asset.isPartOfAsset) {
        //         DefaultNotify.notifyDanger('مکان دارایی را انتخاب کنید');
        //         return;
        //     }
        // }

        if (type === 'next') {
            this.next();
        }
        if (JSON.stringify(this.assetCopy) === JSON.stringify(this.assetEntity)) {
            if (type !== 'next') {
                DefaultNotify.notifyDanger(' تغییر اعمال نشده  .', '', NotiConfig.notifyConfig);
            }
            return;
        }
        if (this.mode === ActionMode.ADD) {
            if (isNullOrUndefined(this.assetEntity.isPartOfAsset)) {
                this.assetEntity.isPartOfAsset = null;
            }
            if (isNullOrUndefined(this.assetEntity.description)) {
                this.assetEntity.description = null;
            }
            this.disabledButton = true;
            this.loading = true;
            this.assetService.create(this.assetEntity)
                .pipe(takeUntilDestroyed(this)).subscribe(res => {
                this.loading = false;

                if (res) {
                    DefaultNotify.notifySuccess('با موفقیت افزوده شد.', '', NotiConfig.notifyConfig);
                    this.disabledButton = false;
                    this.menuStatus = true;
                    this.assetId = res.id;
                    this.assetEntity.id = res.id;
                    this.mode = ActionMode.EDIT;
                    this.router.navigate([], {
                        queryParams: {mode: 'EDIT', entityId: res.id},
                        relativeTo: this.activatedRoute
                    });
                    this.updateAssetPropertyList();
                    this.assetCopy = JSON.parse(JSON.stringify(this.assetEntity));

                } else {
                    DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.', '', NotiConfig.notifyConfig);
                    this.disabledButton = false;

                }
            }, error => {
                this.loading = false;
            });
            this.disabledButton = false;

        } else if (this.mode === ActionMode.EDIT) {
            this.disabledButton = true;
            this.loading = true;
            this.updateAssetPropertyList();
            this.assetService.update(this.assetEntity, {assetId: this.assetId})
                .pipe(takeUntilDestroyed(this)).subscribe(res => {

                this.loading = false;
                if (res) {
                    if (this.assetEntity.categoryId) {
                        this.assetEntity.categoryTitle = this.assetCategoryList.find(a => a.id === this.assetEntity.categoryId).title;
                    }
                    this.assetForUpdate.emit(this.assetEntity);
                    this.assetCopy = JSON.parse(JSON.stringify(this.assetEntity));
                    this.disabledButton = false;

                    DefaultNotify.notifySuccess('ویرایش با موفقیت انجام شد.', '', NotiConfig.notifyConfig);
                } else {
                    this.disabledButton = false;

                    DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.', '', NotiConfig.notifyConfig);
                }
            }, error => {
                this.loading = false;
            });
            this.disabledButton = false;

        }
    }

    cancel() {
        if (this.from === 'asset') {

            this.back.emit(true);
        } else if (this.from === 'assignedAsset') {
            this.router.navigateByUrl('/panel/assignedAsset?page=0&size=10');
        }


        // this.location.back();

    }

    ngOnDestroy(): void {
    }

    getAllActivity() {
        this.activityService.getAllActivity().subscribe(res => {
            if (!isNullOrUndefined(res)) {
                this.activityList = res;

            }
        });
    }

/////////////////////تصویر
    MyModalSize = ModalSize;

    showImageModalAsset() {
        ModalUtil.showModal('showImageModalAsset')
    }

    maxFileSizeInKb = 200;
    threshold = 10;

    onChangeUploader(input) {

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

    getFile(blob: any, maxFileSizeInKb: number, threshold: number): Promise<any> {
        return this.imageCompressService.compress(blob, maxFileSizeInKb, threshold);
    }

    loadingUpload = false;

    onUploadFile(file) {
        this.loadingUpload = true;
        const formData = new FormData();
        file.arrayBuffer().then((arrayBuffer) => {
            const blob = new Blob([new Uint8Array(arrayBuffer)], {type: file.type});

            this.getFile(blob, this.maxFileSizeInKb, this.threshold)
                .then((b) => {

                    formData.append('file', b, 'imageName.jpg');


                    this.uploadService.uploadImage(formData).pipe(takeUntilDestroyed(this))
                        .subscribe((data: any) => {
                            this.loadingUpload = false;
                            if (data) {
                                this.assetEntity.image = data;
                            }
                        }, error => {
                            this.loadingUpload = true;
                        });
                });
        });

    }

    deleteItem(id: string) {
        this.assetEntity.documents = this.assetEntity.documents.filter(doc => doc.id !== id);
    }

    changeAssetStatus(event: any) {
        this.assetEntity.status = event.target.checked;
    }

    deleteImage() {
        this.assetEntity.image = new DocumentFile();
        this.files = [];
    }

    changeAssetCode() {
        this.assetService.checkAssetCode({assetCode: this.assetEntity.code})
            .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            if (res && res.exist) {
                DefaultNotify.notifyDanger('کد وارد شده موجود است.', '', NotiConfig.notifyConfig);
                if (isNullOrUndefined(this.assetEntity.id)) {
                    this.assetEntity.code = '';
                } else {
                    this.assetEntity.code = this.assetCopy.code;
                }
            }
        });
    }

    changeAssetTemplate() {
        // این متد در html در قسمت  assetTemplate ودر داخل متد (change)="changeAssetTemplate()" فراخوانی شه بود
        this.assetTemplateService.getCategoryTypeByAssetTemplateId({assetTemplateId: this.assetEntity.assetTemplateId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: CategoryDto.Create) => {
            if (res && res.id) {
                this.assetEntity.categoryType = res.categoryType;
                this.getAssetListByCategoryType();
            }
        });
    }

    getAssetListByCategoryType() {
        this.assetService.getAssetListByCategoryType({categoryType: this.assetEntity.categoryType})
            .pipe(takeUntilDestroyed(this)).subscribe((res: AssetDto.CreateAsset[]) => {
            if (res && res.length) {
                this.assetList = res;
                // this.asset.isPartOfAsset = '-1';
            }
        });
    }

    changeDocumentList(event: CompanyDto.DocumentFile[]) {
        // this.assetService.updateAssetDocumentList(event, {assetId: this.assetId}).pipe(takeUntilDestroyed(this))
        //   .subscribe( (res: any) => {
        //     if (res) {
        //       DefaultNotify.notifySuccess('عملیات با موفقیت انجام شد.');
        //     } else {
        //       DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.');
        //     }
        //   });
    }

    changeIsPartOfAsset() {
        // if (this.asset.isPartOfAsset !== '-1') {
        //
        // }
    }

    getAssetTemplateForThisCategoryType() {

    }

    otherAssetSubset(event) {
        if (!event.target.checked) {
            this.deleteParentAssetB();
            this.assetEntity.isPartOfAsset = null;
            // =======================================================
            if (this.modeOfCategoryType === 'B') {
                this.rootBuilding = false;
                if (!this.hasParent) {
                    $('#hasParent').click();
                }
            }
            // ==========================================================
            if (this.modeOfCategoryType === 'F') {
                this.hasBuildingParentForFacility = false;
                this.assetEntity.isPartOfAsset = '';
                // if (this.hasFacilityParentForFacility === false) {
                //   $('#hasFacilityParentForFacility').click();
                // }
            }
            // ==========================================================
            if (this.modeOfCategoryType === 'T') {
                this.hasBuildingParentForTools = false;
                this.assetEntity.isPartOfAsset = '';
                // if (this.hasFacilityParentForTools === false) {
                //   $('#hasFacilityParentForTools').click();
                // }
            }
            // ==========================================================
        } else {
            this.getAssetListByCategoryType();

            if (this.modeOfCategoryType === 'B') {
                this.rootBuilding = true;
                if (this.hasParent) {
                    $('#hasParent').click();
                }
            }
            // ==========================================================
            if (this.modeOfCategoryType === 'F') {
                this.hasBuildingParentForFacility = true;
                this.parentAssetF = new Asset();
                this.sendTypeGetAll = 'B';
                if (this.hasFacilityParentForFacility) {
                    $('#hasFacilityParentForFacility').click();
                }
            }
            // ==========================================================
            if (this.modeOfCategoryType === 'T') {
                this.hasBuildingParentForTools = true;
                this.parentAssetT = new Asset();
                this.sendTypeGetAll = 'B';
                if (this.hasFacilityParentForTools) {
                    $('#hasFacilityParentForTools').click();
                }
            }
        }
        // ==========================================================
        // if (event.target.checked === false) {
        //   this.rootBuilding = false;
        //   if (this.hasParent === false) {
        //     $('#hasParent').click();
        //   }
        // } else {
        //   this.rootBuilding = true;
        //   if (this.hasParent ) {
        //     $('#hasParent').click();
        //   }
        // }
    }

    hasParents(event) {
        if (event.target.checked) {
            this.getAssetListByCategoryType();
            if (this.modeOfCategoryType === 'B') {
                this.hasParent = true;
                this.sendTypeGetAll = 'B';
                if (this.rootBuilding) {
                    $('#rootBuilding').click();
                }
            }
            // ==========================================================
            if (this.modeOfCategoryType === 'F') {
                this.hasFacilityParentForFacility = true;
                this.sendTypeGetAll = 'F';
                if (this.hasBuildingParentForFacility) {
                    $('#hasBuildingParentForFacility').click();
                }
            }
            // ==========================================================
            if (this.modeOfCategoryType === 'T') {
                this.hasFacilityParentForTools = true;
                this.sendTypeGetAll = 'T';
                if (this.hasBuildingParentForTools) {
                    $('#hasBuildingParentForTools').click();
                }
            }
            // ===========================================================
        } else {
            this.assetEntity.isPartOfAsset = null;
            if (this.modeOfCategoryType === 'B') {
                this.hasParent = false;
                if (!this.rootBuilding) {
                    $('#rootBuilding').click();
                }
            }
            // ==========================================================
            if (this.modeOfCategoryType === 'F') {
                this.hasFacilityParentForFacility = false;
                // if (this.hasBuildingParentForFacility === false) {
                //   $('#hasBuildingParentForFacility').click();
                // }
            }
            // ==========================================================
            if (this.modeOfCategoryType === 'T') {
                this.hasFacilityParentForTools = false;
                // if (this.hasBuildingParentForTools === false) {
                //   $('#hasBuildingParentForTools').click();
                // }
            }
        }
    }

    openGetAllModal() {
        // if (this.assetList.length === 0) {
        //     DefaultNotify.notifyDanger('مکانی ثبت نشده است.');
        // } else {
        ModalUtil.showModal('treeAsset');
        // }
    }

    receiveParentAsset(event: Asset) {
        // console.log('sendTypeGetAll', this.sendTypeGetAll);
        // console.log('modeOfCategoryType', this.modeOfCategoryType);
        if (this.modeOfCategoryType === 'B') {
            this.parentAssetB = new Asset();
            this.parentAssetB = event;
        }
        if (this.modeOfCategoryType === 'F') {
            if (this.hasBuildingParentForFacility) {
                this.parentAssetB = new Asset();
                this.parentAssetB = event;
            }
            if (this.hasFacilityParentForFacility) {
                this.parentAssetF = new Asset();
                this.parentAssetF = event;
            }

        }
        if (this.modeOfCategoryType === 'T') {

            if (this.hasBuildingParentForTools) {
                this.parentAssetB = new Asset();
                this.parentAssetB = event;
            }
            if (this.hasFacilityParentForTools) {
                this.parentAssetT = new Asset();
                this.parentAssetT = event;
            }


        }
        this.assetEntity.isPartOfAsset = event.id;
    }

    deleteParentAssetB() {
        this.parentAssetB = new Asset();
        this.parentAssetT = new Asset();
        this.parentAssetF = new Asset();
        if (this.mode === ActionMode.EDIT) {
            this.assetEntity.isPartOfAsset = '';
        }
    }

    next() {
        this.tabList[0] = true;
        // || !this.asset.assetTemplateId
        if (!this.assetEntity.name || !this.assetEntity.code || !this.assetEntity.activityIdList
            || !this.assetEntity.categoryType || !this.assetEntity.assetPriority) {
            DefaultNotify.notifyDanger('ورودی ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            return;
        }
        this.showBasicList = true;
        setTimeout(e => {
            $('#assetCreate').carousel('next');
        }, 10);
        // this.updateAssetPropertyList();
    }

    prev() {
        $('#assetCreate').carousel('prev');
    }

}

export class AssetForFTB {
    toolsInFacility: string;
    toolsInBuilding: string;
    facilityInFacility: string;
    facilityInBuilding: string;
    buildingInBuilding: string;
    rootBuilding: string;
    rootFacility: string;
    rootTools: string;
}

export class Asset {
    id: string;
    name: string; //
    // description: string;  //
    code: string; //
    status: boolean; //
    // assetTemplateId: string; //
    isPartOfAsset: string;
    // image: DocumentFile = new DocumentFile();
    // users: Array<any>; //
    categoryType: CategoryType;
    // documents: Array<CompanyDto.DocumentFile>; //
    childAssetList: AssetDto.CreateAsset[] = [];
    openPlus = false;
    marginLeft = 5;
    hasChild = false;
}
