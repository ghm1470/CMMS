import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionMode, DefaultNotify, isNullOrUndefined} from '@angular-boot/util';
import {MyPattern} from '../../../../shared/shared/tools/myPattern';
import {Province} from '../../../dashboard/model/dto/province';
import {City} from '../../../basicInformation/city/model/city';
import {StorageService} from '../../endpoint/storage.service';
import {Storage} from '../../model/domain/storage';
import {ProvinceService} from '../../../basicInformation/province/endpoint/province.service';
import {CityService} from '../../../basicInformation/city/endpoint/city.service';
import {ActivatedRoute} from '@angular/router';
import {takeUntilDestroyed} from '@angular-boot/core';
import {Location} from '@angular/common';
import {LatLngLiteral} from '@agm/core';
import {AssetDto} from '../../../asset/model/dto/assetDto';
import {CategoryDto} from '../../../category/model/dto/categoryDto';
import {ModalUtil} from '@angular-boot/widgets';
import CategoryType = CategoryDto.CategoryType;
import {CompanyDto} from '../../../company/model/dto/companyDto';
import Address = CompanyDto.Address;
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

declare var $: any;

@Component({
    selector: 'app-storage-action',
    templateUrl: './storage-action.component.html',
    styleUrls: ['./storage-action.component.scss']
})
export class StorageActionComponent implements OnInit, OnDestroy {

    // lat = 35.6970118;
    // lng = 51.4899051;
    // zoom = 7;
    locationSelected = false;
    // lastCenter = {
    //     lat: this.lat,
    //     lng: this.lng
    // };

    mode: ActionMode = ActionMode.ADD;
    actionMode = ActionMode;
    storage = new Storage.Create();
    storageCopy = new Storage.Create();
    storageId: string;
    myPattern = MyPattern;
    doSave = false;
    asset = new Asset();
    sendTypeGetAll = 'B';
    independent = false;
    dependent = false;
    disabledButton = false;

    provinceList: Province[] = [];
    cityList: City[] = [];

    codeExist;

    constructor(
        public location: Location,
        public storageService: StorageService,
        public provinceService: ProvinceService,
        public cityService: CityService,
        private activatedRoute: ActivatedRoute,
    ) {
        // this.storage.address.province.id = '-1';
        // this.storage.address.city.id = '-1';
        this.mode = this.activatedRoute.snapshot.queryParams.mode;
        this.storageId = this.activatedRoute.snapshot.queryParams.entityId;
    }

    ngOnInit() {
        if (this.mode === ActionMode.ADD) {
            this.independent = false;
            this.dependent = false;
            setTimeout(() => {
                $('#independentStorage').click();
            }, 200);
        }
        if (this.mode === ActionMode.EDIT || this.mode === ActionMode.VIEW) {
            if (!isNullOrUndefined(this.storageId)) {
                this.getOne();
            }
        }
        this.getAllProvince();
    }

    getAllProvince() {
        this.provinceService.getAllByTerm({term: ''}).pipe(takeUntilDestroyed(this))
            .subscribe((res: any) => {
                if (!isNullOrUndefined(res)) {
                    this.provinceList = res;
                }
            });
    }

    getOne() {
        this.storageService.getOne({storageId: this.storageId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: Storage.GetOne) => {
            if (res) {
                if (!isNullOrUndefined(res.asset)) {
                    this.asset.name = res.asset.name;
                    this.asset.code = res.asset.code;
                    this.storage.assetId = res.asset.id;
                }
                this.storage.code = res.code;
                this.storage.title = res.title;
                this.storage.id = res.id;
                if (!isNullOrUndefined(res.address)) {
                    this.storage.address = res.address;
                    if (!isNullOrUndefined(this.storage.address.location)) {
                        // this.lat = this.storage.address.location.lat;
                        // this.lng = this.storage.address.location.lng;
                        // this.lastCenter.lat = this.lat;
                        // this.lastCenter.lng = this.lng;
                        this.locationSelected = true;
                        if (res.address.provinceId) {
                            this.getCityList();
                        }
                    }
                }
                this.storageCopy = JSON.parse(JSON.stringify(this.storage));
                if (res.asset) {
                    setTimeout(() => {
                        this.dependent = true;
                        $('#dependentStorage').click();
                    }, 200);
                } else if (this.storage.address) {
                    setTimeout(() => {
                        $('#independentStorage').click();
                        this.independent = true;
                    }, 200);
                }
            }
        });
    }

    stringLength(value, id) {
        if (!isNullOrUndefined(value)) {
            value = value.trim();
            if (value.length === 0) {
                $('#' + id).addClass('is-invalid ').removeClass('is-valid ');
                $('#' + id).addClass('ng-invalid').removeClass('ng-valid');
                $('form').addClass('ng-invalid is-invalid').removeClass('ng-valid ');
                return false;
            } else {

                $('#' + id).addClass('is-valid').removeClass('is-invalid');
                $('#' + id).addClass('ng-valid').removeClass('ng-invalid');
                // $('form').valid();
                return true;

            }
        }
    }

    loading = false;

    action(form) {
        this.doSave = true;
        if (this.loading) {
            return;
        }
        if (!this.storage.title || isNullOrUndefined(this.storage.title)) {
            DefaultNotify.notifyDanger('ورودی نام انبار را بررسی کنید.', '', NotiConfig.notifyConfig);
            return;
        }
        if (!this.storage.code || isNullOrUndefined(this.storage.code)) {
            DefaultNotify.notifyDanger('ورودی کد انبار را بررسی کنید.', '', NotiConfig.notifyConfig);
            return;
        }
        this.storage.title = this.storage.title.trim();
        if (form.invalid) {
            DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            return;
        }
        if (this.independent === false && (!this.asset.name || isNullOrUndefined(this.asset.name))) {
            DefaultNotify.notifyDanger('مکان انبار را انتخاب  کنید.', '', NotiConfig.notifyConfig);
            return;
        }
        if (JSON.stringify(this.storageCopy) === JSON.stringify(this.storage)) {
            DefaultNotify.notifyDanger('تغییری اعمال نشده است.', '', NotiConfig.notifyConfig);
            return;
        }
        if (this.independent === true) {
            this.storage.assetId = null;
        } else if (this.dependent === true) {
            this.storage.address = null;
        }
        // if (this.independent === true) {
        //   if (isNullOrUndefined(this.storage.address.location.lat) ||
        //     isNullOrUndefined(this.storage.address.location.lng)) {
        //     DefaultNotify.notifyDanger('وارد کردن مکان انبار اجباریست.');
        //     return;
        //   }
        // }
        this.loading = true;
        if (this.mode === ActionMode.ADD) {
            this.storageService.create(this.storage)
                .pipe(takeUntilDestroyed(this)).subscribe(res => {
                this.loading = false;
                if (res) {
                    DefaultNotify.notifySuccess('با موفقیت افزوده شد.', '', NotiConfig.notifyConfig);
                    // form.reset();
                    this.cancel();
                }
            }, error => {
                this.loading = false;

            });
        } else if (this.mode === ActionMode.EDIT) {
            this.storageService.update(this.storage, {storageId: this.storageId})
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

    cancel() {
        this.location.back();
    }

    ngOnDestroy(): void {
    }

    doSetCompanyMarker() {
        this.locationSelected = true;
        // this.storage.address.location.lat = this.lastCenter.lat;
        // this.storage.address.location.lng = this.lastCenter.lng;
    }

    changeLocation() {
        this.locationSelected = false;
        this.storage.address.location.lat = null;
        this.storage.address.location.lng = null;
    }

    centerChange(event: LatLngLiteral) {
        // this.lastCenter.lat = event.lat;
        // this.lastCenter.lng = event.lng;
    }

    loadingCityList = false;

    getCityList(doChangeSelectedCity?: boolean, from?) {
        this.cityList = [];
        if (from === 'html') {
            this.storage.address.cityId = null;
        }
        if (!this.storage.address.provinceId) {
            return;
        }
        if (doChangeSelectedCity) {
            // this.storage.address.city.id = '-1';
            // this.storage.address.provinceId.name = this.provinceList.find(p => p.id === this.storage.address.provinceId.id).name;
            // this.storage.address.provinceId.location = this.provinceList.find(p => p.id === this.storage.address.provinceId.id).location;
            // this.lat = this.storage.address.provinceId.location.lat;
            // this.lng = this.storage.address.provinceId.location.lng;
            // this.lastCenter.lat = this.lat;
            // this.lastCenter.lng = this.lng;
            // this.zoom = 9;
        }
        this.loadingCityList = true;
        this.cityService.getAllByProvinceId({provinceId: this.storage.address.provinceId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            this.loadingCityList = false;
            if (!isNullOrUndefined(res)) {
                this.cityList = res;
            }
        }, error => {
            this.loadingCityList = false;
        });
    }

    changeCity() {
        // this.storage.address.cityId.name = this.cityList.find(p => p.id === this.storage.address.cityId.id).name;
        // this.storage.address.cityId.location = this.cityList.find(p => p.id === this.storage.address.cityId.id).location;
        // this.lat = this.storage.address.cityId.location.lat;
        // this.lng = this.storage.address.cityId.location.lng;
        // this.lastCenter.lat = this.lat;
        // this.lastCenter.lng = this.lng;
        // this.zoom = 12;
    }

    changeStorageCode() {
        this.codeExist = true;
        this.storageService.checkStorageCode({code: this.storage.code})
            .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            // alert(res)
            if (res === true) {
                DefaultNotify.notifyDanger('کد وارد شده موجود است.', '', NotiConfig.notifyConfig);
                if (isNullOrUndefined(this.storage.id)) {
                    this.storage.code = '';
                    this.codeExist = false;
                } else {
                    this.storage.code = this.storageCopy.code;
                    this.codeExist = false;
                }
            } else {
                this.codeExist = false;
            }
        });
    }

    independentStorage(event) {
        // مستقل
        if (event.target.checked) {
            this.independent = true;
            this.storage.assetId = null;
            this.storageCopy.assetId = null;
            if (this.dependent === true) {
                $('#dependentStorage').click();
            }
        } else {
            this.independent = false;
            if (this.dependent === false) {
                $('#dependentStorage').click();
            }
        }
    }

    dependentStorage(event) {
        //وابسته
        if (event.target.checked) {
            this.dependent = true;
            this.storage.address = new Address();
            if (this.independent === true) {
                $('#independentStorage').click();
            }
        } else {
            this.dependent = false;
            if (this.independent === false) {
                $('#independentStorage').click();
            }
        }
    }

    receiveParentAsset(event: Asset) {
        this.asset = new Asset();
        this.asset = event;
        this.storage.assetId = event.id;
    }

    openGetAllModal() {
        ModalUtil.showModal('treeAsset');
    }

    deleteSelectedPlace() {
        this.asset = new Asset();
    }
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

