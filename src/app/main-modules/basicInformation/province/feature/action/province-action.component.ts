import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ActionMode, DefaultNotify} from '@angular-boot/util';
import {takeUntilDestroyed} from '@angular-boot/core';
import {ProvinceService} from '../../endpoint/province.service';
import {isNullOrUndefined} from 'util';
import {Location} from '@angular/common';
import {Province} from '../../../../dashboard/model/dto/province';
import {MyPattern} from '../../../../../shared/shared/tools/myPattern';
import {City} from '../../../city/model/city';
import {Location as MyLocation} from '../../../../dashboard/model/dto/location';
import {LatLngLiteral} from '@agm/core';
import {NotiConfig} from "../../../../../shared/tools/notifyConfig";

declare var $: any;

@Component({
    selector: 'app-province-action',
    templateUrl: './province-action.component.html',
    styleUrls: ['./province-action.component.scss']
})
export class ProvinceActionComponent implements OnInit, OnDestroy {
    lat = 35.6970118;
    lng = 51.4899051;
    zoom = 8;
    locationSelected = false;
    disabledButton = false;
    lastCenter = {
        lat: this.lat,
        lng: this.lng
    };
    provinceList: Province[] = [];
    mode: ActionMode = ActionMode.ADD;
    actionMode = ActionMode;
    myPattern = MyPattern;
    provinceId: string;
    locationOfProvince = new Province();
    locationOfProvinceCopy = new Province();
    loading = false;
    doSave = false;
    //
    disableButton = false;

    constructor(private  activatedRoute: ActivatedRoute,
                public location: Location,
                private provinceService: ProvinceService,
    ) {
        this.mode = this.activatedRoute.snapshot.queryParams.mode;
        this.provinceId = this.activatedRoute.snapshot.queryParams.entityId;
    }

    ngOnInit() {
        if (this.mode === ActionMode.EDIT) {
            if (!isNullOrUndefined(this.provinceId)) {
                this.getOne();
            }
        }
        this.getAllProvince();
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
                this.zoom = 15;
            });
        }
    }

    ngOnDestroy(): void {
    }

    doSetCityMarker() {
        this.locationSelected = true;
        this.locationOfProvince.location.lat = this.lastCenter.lat;
        this.locationOfProvince.location.lng = this.lastCenter.lng;
    }

    changeLocation() {
        this.locationSelected = false;
        this.locationOfProvince.location = new MyLocation();
    }

    centerChange(event: LatLngLiteral) {
        this.lastCenter.lat = event.lat;
        this.lastCenter.lng = event.lng;
    }

    //
    getAllProvince() {
        this.provinceService.getAll()
            .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            if (!isNullOrUndefined(res)) {
                this.provinceList = res;
            }
        });
    }

    getOne() {
        this.loading = true;
        this.provinceService.getOne({provinceId: this.provinceId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: City) => {
            this.loading = false;
            if (res) {
                this.locationOfProvince = res;
                this.locationOfProvinceCopy = JSON.parse(JSON.stringify(res));
                this.lat = this.locationOfProvince.location.lat;
                this.lng = this.locationOfProvince.location.lng;
                this.lastCenter.lat = this.lat;
                this.lastCenter.lng = this.lng;
                this.locationSelected = true;
            }
        });
    }

    action(form) {
        if (this.loading) {
            return;
        }
        this.doSave = true;
        this.loading = true;
        if (form.invalid) {
            DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            this.loading = false;
            return;
        }
        this.locationOfProvince.name = this.locationOfProvince.name.trim();
        if (this.mode === ActionMode.ADD) {
            this.loading = true;
            this.provinceService.create(this.locationOfProvince)
                .subscribe((res: any) => {
                    this.loading = false;
                    if (res.message) {
                        if (res.message === 'ورودی تکراری') {
                            DefaultNotify.notifyDanger('این استان قبلا ثبت شده است.', '', NotiConfig.notifyConfig);

                        } else {
                            DefaultNotify.notifyDanger(res.message, '', NotiConfig.notifyConfig);

                        }
                        return;

                    }
                    if (res) {
                        DefaultNotify.notifySuccess('با موفقیت افزوده شد.', '', NotiConfig.notifyConfig);
                        form.reset();
                        this.cancel();
                    }
                }, error => {
                    if (error.status === 302) {
                        this.loading = false;
                        DefaultNotify.notifyDanger('این استان قبلا ثبت شده است', '', NotiConfig.notifyConfig);
                    }
                });
        } else {
            if (JSON.stringify(this.locationOfProvince) === JSON.stringify(this.locationOfProvinceCopy) && this.mode === ActionMode.EDIT) {
                DefaultNotify.notifyDanger('شما هیچ ویرایشی انجام نداده اید', '', NotiConfig.notifyConfig);
                this.loading = false;
            } else {
                this.loading = true;
                this.provinceService.update(this.locationOfProvince, {provinceId: this.provinceId})
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
        this.location.back();
    }

    stringLength(value, id) {
        if (!isNullOrUndefined(value)) {
            value = value.trim();
            if (value.length === 0) {
                $('#name').addClass('is-invalid').removeClass('is-valid');
                $('#name').addClass('ng-invalid').removeClass('ng-valid');
                this.disableButton = true;
                return false;
            } else {
                $('#name').addClass('is-valid').removeClass('is-invalid');
                $('#name').addClass('ng-valid').removeClass('ng-invalid');
                this.disableButton = false;

                return true;

            }
        } else {
            this.disableButton = false;

            return true;
        }
    }


//

}

interface Marker {
    x: number;
    y: number;
    label: string;
    draggable: boolean;
}
