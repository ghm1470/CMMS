import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AssetDto} from '../../model/dto/assetDto';
import {LatLngLiteral} from '@agm/core';
import {takeUntilDestroyed} from '@angular-boot/core';
import {ActionMode, DefaultNotify, isNullOrUndefined} from '@angular-boot/util';
import {MyPattern} from '../../../../shared/shared/tools/myPattern';
import {Province} from '../../../dashboard/model/dto/province';
import {City} from '../../../basicInformation/city/model/city';
import {ProvinceService} from '../../../basicInformation/province/endpoint/province.service';
import {CityService} from '../../../basicInformation/city/endpoint/city.service';
import {Budget} from '../../../basicInformation/budget/model/dto/budget';
import {ChargeDepartment} from '../../../basicInformation/chargeDepartment/model/charge-department';
import {ChargeDepartmentService} from '../../../basicInformation/chargeDepartment/endpoint/charge-department.service';
import {BudgetService} from '../../../basicInformation/budget/endpoint/budget.service';
import {AssetService} from '../../endpoint/asset.service';
import {UnitOfMeasurementService} from '../../../basicInformation/unitOfMeasurement/endpoint/unit-of-measurement.service';
import {UnitOfMeasurement} from '../../../basicInformation/unitOfMeasurement/model/dto/unitOfMeasurement';
import {concat, Observable, of, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap, tap} from 'rxjs/operators';
import AssetBasicInformation = AssetDto.AssetBasicInformation;
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

@Component({
    selector: 'app-asset-basic-information',
    templateUrl: './asset-basic-information.component.html',
    styleUrls: ['./asset-basic-information.component.scss']
})
export class AssetBasicInformationComponent implements OnInit, OnDestroy {

    lat = 35.6970118;
    lng = 51.4899051;
    zoom = 7;
    disabledButton = false;
    locationSelected = false;
    lastCenter = {
        lat: this.lat,
        lng: this.lng
    };

    @Input() assetId: string;
    @Input() mode: ActionMode;
    actionMode = ActionMode;

    myPattern = MyPattern;
    assetBasicInformation = new AssetDto.AssetBasicInformation();
    assetBasicInformationCopy = new AssetDto.AssetBasicInformation();
    // ================================
    locationCodingSettingList: UnitOfMeasurement[] = [];
    locationCodingSettingList$: Observable<any[]>;
    locationCodingSettingInput = new Subject<string>();
    locationCodingSettingLoading = false;
// =====================================
    provinceList: Province[] = [];
    cityList: City[] = [];
    budgetList: Budget[] = [];
    chargeDepartmentList: ChargeDepartment[] = [];
    unitOfMeasurementList: UnitOfMeasurement[] = [];
    doSave = false;

    constructor(public provinceService: ProvinceService,
                public chargeDepartmentService: ChargeDepartmentService,
                public budgetService: BudgetService,
                public unitOfMeasurementService: UnitOfMeasurementService,
                public assetService: AssetService,
                public cityService: CityService) {
        // this.assetBasicInformation.address.province.id = '-1';
        // this.assetBasicInformation.address.city.id = '-1';
        // this.assetBasicInformation.budgetId = '-1';
    }

    ngOnInit() {
        // if (this.mode !== this.actionMode.VIEW) {

        this.getBudgetList();
        this.getChargeDepartmentList();
        this.getAllProvince();
        // this.getUnitOfMeasurement();
        this.getListunitOfMeasurement();
        // }
        // this.getBasicInformationByAssetId();
        setTimeout(() => {
            this.getBasicInformationByAssetId();
        }, 1000);


    }

    getBasicInformationByAssetId() {
        this.assetBasicInformation = new AssetDto.AssetBasicInformation();
        this.assetService.getBasicInformationByAssetId({assetId: this.assetId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: AssetBasicInformation) => {
            if (!isNullOrUndefined(res) && !isNullOrUndefined(res.address)) {

                this.assetBasicInformation = res;
                if (this.assetBasicInformation.address.cityId) {
                    this.getCityList(false);
                }
                this.assetBasicInformationCopy = JSON.parse(JSON.stringify(res));
                // if (this.mode !== this.actionMode.VIEW) {

                // this.getCityList(false);
                // }
                this.locationSelected = true;
                // this.lat = this.assetBasicInformation.address.location.lat;
                // this.lng = this.assetBasicInformation.address.location.lng;
                // this.lastCenter.lat = this.lat;
                // this.lastCenter.lng = this.lng;
                this.zoom = 12;
            }
        });
    }

    getUnitOfMeasurement() {
        this.unitOfMeasurementService.getAll().pipe(takeUntilDestroyed(this))
            .subscribe((res: UnitOfMeasurement[]) => {

                if (res && res.length) {
                    this.unitOfMeasurementList = res;
                }
            });
    }

    getAllProvince() {
        this.provinceService.getAll().pipe(takeUntilDestroyed(this))
            .subscribe((res: any) => {

                if (!isNullOrUndefined(res)) {
                    this.provinceList = res;

                }
            });
    }

    getChargeDepartmentList() {
        this.chargeDepartmentService.getAll().pipe(takeUntilDestroyed(this))
            .subscribe((res: ChargeDepartment[]) => {
                this.chargeDepartmentList = res;
            });
    }

    getBudgetList() {
        this.budgetService.getAll().pipe(takeUntilDestroyed(this))
            .subscribe((res: Budget[]) => {
                this.budgetList = res;

            });
    }


    doSetAssetMarker() {
        this.locationSelected = true;
        // this.assetBasicInformation.address.location.lat = this.lastCenter.lat;
        // this.assetBasicInformation.address.location.lng = this.lastCenter.lng;
    }

    changeLocation() {
        this.locationSelected = false;
        // this.assetBasicInformation.address.location.lat = null;
        // this.assetBasicInformation.address.location.lng = null;
    }

    centerChange(event: LatLngLiteral) {
        // this.lastCenter.lat = event.lat;
        // this.lastCenter.lng = event.lng;
    }

    loadingCity = false;

    getCityList(doChangeSelectedCity?: boolean) {
        this.cityList = [];

        if (doChangeSelectedCity) {
            this.assetBasicInformation.address.cityId = null;
            // this.assetBasicInformation.address.provinceId.name =
            //   this.provinceList.find(p => p.id === this.assetBasicInformation.address.provinceId.id).name;
            // this.assetBasicInformation.address.provinceId.location =
            //   this.provinceList.find(p => p.id === this.assetBasicInformation.address.provinceId.id).location;
            // this.lat = this.assetBasicInformation.address.provinceId.location.lat;
            // this.lng = this.assetBasicInformation.address.provinceId.location.lng;
            // this.lastCenter.lat = this.lat;
            // this.lastCenter.lng = this.lng;
            this.zoom = 9;
        }
        if (this.assetBasicInformation.address.provinceId) {
            this.loadingCity = true;

            this.cityService.getAllByProvinceId({provinceId: this.assetBasicInformation.address.provinceId})
                .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
                this.loadingCity = false;
                if (!isNullOrUndefined(res)) {
                    this.cityList = res;
                }
            }, error => {
                this.loadingCity = false;
            });
        }
    }

    changeCity() {
        // this.assetBasicInformation.address.cityId.name =
        //   this.cityList.find(p => p.id === this.assetBasicInformation.address.cityId.id).name;
        // this.assetBasicInformation.address.cityId.location =
        //   this.cityList.find(p => p.id === this.assetBasicInformation.address.cityId.id).location;
        // this.lat = this.assetBasicInformation.address.cityId.location.lat;
        // this.lng = this.assetBasicInformation.address.cityId.location.lng;
        // this.lastCenter.lat = this.lat;
        // this.lastCenter.lng = this.lng;
        this.zoom = 12;
    }

    ngOnDestroy(): void {
    }

    action(assetBasicInformationForm) {
        if (this.disabledButton) {
            return;
        }
        this.doSave = true;
        if (this.assetBasicInformation.unitIdList.length === 0) {
            DefaultNotify.notifyDanger('حداقل یک واحد اندازه گیری انتخاب کنید.', '', NotiConfig.notifyConfig);
            return;
        }
        if (assetBasicInformationForm.invalid) {
            DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            return;
        }
        this.disabledButton = true;
        this.assetService.updateAssetBasicInformation(this.assetBasicInformation, {assetId: this.assetId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            this.disabledButton = false;

            if (res) {
                DefaultNotify.notifySuccess('تغییرات با موفقیت ثبت شد.', '', NotiConfig.notifyConfig);
            } else {
                DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.', '', NotiConfig.notifyConfig);
            }
        }, error => {
            this.disabledButton = false;
        });
    }

    // ===========================================
    getListunitOfMeasurement() {
        this.unitOfMeasurementService.getAll()
            .subscribe((res: any) => {
                    if (res) {
                        this.locationCodingSettingList = res;
                        this.loadUnitOfMeasurementList();
                    }
                }
            );
    }

    loadUnitOfMeasurementList() {
        this.locationCodingSettingList$ = concat(of(this.locationCodingSettingList), // default items
            this.locationCodingSettingInput.pipe(
                debounceTime(1000),
                distinctUntilChanged(),
                tap(() => this.locationCodingSettingLoading = true),
                switchMap(term =>
                    this.unitOfMeasurementService.getAll().pipe(
                        tap(() => this.locationCodingSettingLoading = false),
                    )
                )
            )
        );
    }

    // ===================================================/
}
