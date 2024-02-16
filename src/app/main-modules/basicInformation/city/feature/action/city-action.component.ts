import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionMode, DefaultNotify, isNullOrUndefined} from '@angular-boot/util';
import {City} from '../../model/city';
import {Province} from '../../../../dashboard/model/dto/province';
import {Location} from '@angular/common';
import {Location as MyLocation} from '../../../../dashboard/model/dto/location';
import {ActivatedRoute, Router} from '@angular/router';
import {CityService} from '../../endpoint/city.service';
import {takeUntilDestroyed} from '@angular-boot/core';
import {LatLngLiteral} from '@agm/core';
import {MyPattern} from '../../../../../shared/shared/tools/myPattern';
import {ProvinceService} from '../../../province/endpoint/province.service';
import {NotiConfig} from "../../../../../shared/tools/notifyConfig";

@Component({
    selector: 'app-city-action',
    templateUrl: './city-action.component.html',
    styleUrls: ['./city-action.component.scss']
})
export class CityActionComponent implements OnInit, OnDestroy {
    disabledButton = false;
    lat = 35.6970118;
    lng = 51.4899051;
    zoom = 8;

    locationSelected = false;
    lastCenter = {
        lat: this.lat,
        lng: this.lng
    };

    mode: ActionMode = ActionMode.ADD;
    actionMode = ActionMode;
    city = new City();
    cityCopy = new City();
    cityId: string;
    myPattern = MyPattern;
    provinceList: Province[] = [];
    cityList: City[] = [];
    doSave = false;
    loading = false;

    constructor(
        public location: Location,
        public cityService: CityService,
        public provinceService: ProvinceService,
        private activatedRoute: ActivatedRoute,
        public router: Router
    ) {
        // this.city.provinceId = '-1';
        this.mode = this.activatedRoute.snapshot.queryParams.mode;
        this.cityId = this.activatedRoute.snapshot.queryParams.cityId;
    }

    ngOnInit() {
        if (this.mode === ActionMode.EDIT) {
            if (!isNullOrUndefined(this.cityId)) {
                this.getOne();
            }
        }
        this.getAllProvince();
        // if ('geolocation' in navigator) {
        //   navigator.geolocation.getCurrentPosition((position) => {
        //     this.lat = position.coords.latitude;
        //     this.lng = position.coords.longitude;
        //     this.zoom = 15;
        //   });
        // }
    }

    //
    getAllProvince() {
        this.provinceService.getAll()
            .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {

            if (!isNullOrUndefined(res)) {
                this.provinceList = res;
                if (this.mode === ActionMode.ADD) {
                    if (this.provinceList.length > 0) {
                        this.city.provinceId = this.provinceList[0].id;
                    }
                }
            }
        });
    }

    getOne() {
        this.loading = true;
        this.cityService.getOne({cityId: this.cityId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: City) => {
            this.loading = false;
            if (res) {
                this.city = res;
                this.cityCopy = JSON.parse(JSON.stringify(res));
                // this.lat = this.city.location.lat;
                // this.lng = this.city.location.lng;
                // this.lastCenter.lat = this.lat;
                // this.lastCenter.lng = this.lng;
                this.locationSelected = true;
            }
        });
    }

    action(form) {
        this.doSave = true;
        if (form.invalid) {
            DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            return;
        }
        // if (isNullOrUndefined(this.city.location.lat) ||
        //   isNullOrUndefined(this.city.location.lat)) {
        //   DefaultNotify.notifyDanger('وارد کردن مکان شهر اجباریست.');
        //   return;
        // }
        if (this.mode === ActionMode.ADD) {
            this.loading = true;
            this.disabledButton = true;
            this.cityService.create(this.city)
                .pipe(takeUntilDestroyed(this)).subscribe(res => {
                this.loading = false;
                if (res) {
                    DefaultNotify.notifySuccess('با موفقیت افزوده شد.', '', NotiConfig.notifyConfig);
                    form.reset();
                    this.cancel();
                }
            });
        } else if (this.mode === ActionMode.EDIT) {
            if (JSON.stringify(this.city) === JSON.stringify(this.cityCopy)) {
                this.loading = false;
                DefaultNotify.notifyDanger('شما هیچ ویرایشی انجام نداده اید', '', NotiConfig.notifyConfig);
            } else {
                this.loading = true;
                this.cityService.update(this.city, {cityId: this.cityId})
                    .pipe(takeUntilDestroyed(this)).subscribe(res => {
                    this.loading = false;
                    if (res) {
                        DefaultNotify.notifySuccess('ویرایش با موفقیت انجام شد.', '', NotiConfig.notifyConfig);
                        this.cancel();
                    }
                });
            }
        }
    }

    cancel() {
        // this.location.back();
        this.router.navigate(['/panel/basicInformation/city'], {
            queryParams: {selectedProvinceId: this.city.provinceId},
            relativeTo: this.activatedRoute
        });
    }

    //
    ngOnDestroy(): void {
    }

    doSetCityMarker() {
        this.locationSelected = true;
    }

    changeLocation() {
        this.locationSelected = false;
        this.city.location = new MyLocation();
    }

    centerChange(event: LatLngLiteral) {
        // this.lastCenter.lat = event.lat;
        // this.lastCenter.lng = event.lng;
    }

    getCityList() {
        const province = this.provinceList.find(p => p.id === this.city.provinceId);
        // this.lat = province.location.lat;
        // this.lng = province.location.lng;
        // this.lastCenter.lat = this.lat;
        // this.lastCenter.lng = this.lng;
        this.cityList = [];
        this.cityService.getAllByProvinceId({provinceId: this.city.provinceId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            if (!isNullOrUndefined(res)) {
                this.cityList = res;
            }
        });
    }

}
