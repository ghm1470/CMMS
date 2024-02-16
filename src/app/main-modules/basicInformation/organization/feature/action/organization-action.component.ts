import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionMode, DefaultNotify, isNullOrUndefined, Toolkit2} from '@angular-boot/util';
import {OrganizationDto} from '../../model/organizationDto';
import {Location} from '@angular/common';
import {Location as MyLocation} from '../../../../dashboard/model/dto/location';
import {OrganizationService} from '../../endpoint/organization.service';
import {ActivatedRoute} from '@angular/router';
import {takeUntilDestroyed} from '@angular-boot/core';
import {Province} from '../../../../dashboard/model/dto/province';
import {City} from '../../../city/model/city';
import {LatLngLiteral} from '@agm/core';
import {CityService} from '../../../city/endpoint/city.service';
import {MyPattern} from '../../../../../shared/shared/tools/myPattern';
import {ProvinceService} from '../../../province/endpoint/province.service';
import {UserTypeService} from '../../../../securityManagement/endpoint/user-type.service';
import {UserType} from '../../../../securityManagement/model/userType';
import {concat, Observable, of, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap, tap} from 'rxjs/operators';
import {NotiConfig} from "../../../../../shared/tools/notifyConfig";

@Component({
  selector: 'app-organization-action',
  templateUrl: './organization-action.component.html',
  styleUrls: ['./organization-action.component.scss']
})
export class OrganizationActionComponent implements OnInit, OnDestroy {

  lat = 35.6970118;
  lng = 51.4899051;
  zoom = 8;
  disabledButton = false;

  mode: ActionMode = ActionMode.ADD;
  actionMode = ActionMode;
  organization = new OrganizationDto.Create();
  organizationCopy = new OrganizationDto.Create();
  organizationId: string;
  myPattern = MyPattern;
  provinceList: Province[] = [];
  cityList: City[] = [];

  parentOrganizationList: OrganizationDto.Create[] = [];
  private geoCoder;
  address: any;
  doSave = false;
  locationSelected = false;
  lastCenter = {
    lat: this.lat,
    lng: this.lng
  };

  // get list//
  userTypeList: UserType[] = [];
  userTypeList$: Observable<any[]>;
  userTypeInput = new Subject<string>();
  userTypeLoading = false;
  usersType: string[] = [];
  loading = false;

  totalEstimate = 10;
  ctx = {estimate: this.totalEstimate};
  codeCheck = false;

  constructor(
    public location: Location,
    public cityService: CityService,
    public userTypeService: UserTypeService,
    public provinceService: ProvinceService,
    public organizationService: OrganizationService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.organization.cityId = '-1';
    this.organization.provinceId = '-1';
    this.organization.parentOrganId = '-1';
    this.organization.parentOrganId = 'PARENT';
    this.mode = this.activatedRoute.snapshot.queryParams.mode;
    this.organizationId = this.activatedRoute.snapshot.queryParams.organizationId;
  }

  ngOnInit() {
    if (this.mode === ActionMode.EDIT) {
      if (!isNullOrUndefined(this.organizationId)) {
        this.getOne();
      }
    }
    this.getAllProvince();
    this.getAllParentOrganization();
    this.getAllUserType();

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 15;
      });
    }
  }


  login() {
    console.log('Login');
  }

  signUp() {
    console.log('Sign Up');
  }


  getAllProvince() {
    this.provinceService.getAll()
      .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
      ;
      if (!isNullOrUndefined(res)) {
        this.provinceList = res;
      }
    });
  }

  getCityList(doChangeSelectedCity?: boolean) {
    if (doChangeSelectedCity) {
      // this.organization.cityId = '-1';
      // this.lat = this.provinceList.find(p => p.id === this.organization.provinceId).location.lat;
      // this.lng = this.provinceList.find(p => p.id === this.organization.provinceId).location.lng;
      // this.lastCenter.lat = this.lat;
      // this.lastCenter.lng = this.lng;
      // this.zoom = 9;
    }
    this.cityList = [];
    this.cityService.getAllByProvinceId({provinceId: this.organization.provinceId})
      .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
      if (!isNullOrUndefined(res)) {
        this.cityList = res;
      }
    });
  }

  getAllParentOrganization() {
    this.organizationService.getAllParentOrganization()
      .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
      if (!isNullOrUndefined(res)) {
        this.parentOrganizationList = res;
        ;
        console.log(this.organization.id);

        if (this.mode === this.actionMode.EDIT) {
          this.parentOrganizationList = this.parentOrganizationList.filter(e => e.id !== this.organization.id);
          console.log(this.parentOrganizationList);
        }
      }
    });
  }


  // ***************** getAllUserType ***************************

  getAllUserType() {
    this.userTypeService.getAllRole()
      .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
      console.log('getAllUserType', res);
      if (!isNullOrUndefined(res)) {
        this.userTypeList = res;
        this.loaduserTypeList();

      }
    });
  }

  loaduserTypeList() {
    this.userTypeList$ = concat(
      of(this.userTypeList), // default items
      this.userTypeInput.pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap(() => this.userTypeLoading = true),
        switchMap(term =>
          this.userTypeService.getAllRole().pipe(
            tap(() => this.userTypeLoading = false),
          )
        )
      )
    );
  }


  getOne() {
    this.loading = true;
    this.organizationService.getOne({orgId: this.organizationId}).pipe(takeUntilDestroyed(this)).subscribe((res: OrganizationDto.Create) => {
      console.log('getOne', res);
      this.loading = false;
      if (res) {
        this.organization = res;
        this.codeCheck = true ;
        this.organizationCopy = JSON.parse(JSON.stringify(res));
        this.lat = this.organization.organLocation.lat;
        this.lng = this.organization.organLocation.lng;
        this.lastCenter.lat = this.lat;
        this.lastCenter.lng = this.lng;
        this.locationSelected = true;
        this.getCityList();
      }
    });
  }

  action(form) {
    if (this.codeCheck) {
      this.disabledButton = true;
      this.doSave = true;
      console.log('this.organization', this.organization);
      if (form.invalid || isNullOrUndefined(this.organization.provinceId) || isNullOrUndefined(this.organization.cityId)) {
        this.disabledButton = false;
        DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
        return;
      }
      // if (isNullOrUndefined(this.organization.organLocation.lat) ||
      //   isNullOrUndefined(this.organization.organLocation.lat)) {
      //   DefaultNotify.notifyDanger('وارد کردن مکان سازمان اجباریست.');
      //   return;
      // }
      if (this.usersType) {
        for (let i = 0; i < this.usersType.length; i++) {

        }
      }
      if (this.mode === ActionMode.ADD) {
        this.loading = true;
        this.organizationService.create(this.organization)
          .pipe(takeUntilDestroyed(this)).subscribe(res => {
          this.loading = false;
          this.disabledButton = false;
          if (res.id) {
            DefaultNotify.notifySuccess('با موفقیت افزوده شد.', '', NotiConfig.notifyConfig);
            form.reset();
            this.cancel();
          } else {
            DefaultNotify.notifyDanger(res, '', NotiConfig.notifyConfig);
          }
        });
      } else if (this.mode === ActionMode.EDIT) {
        if (JSON.stringify(this.organizationCopy) === JSON.stringify(this.organization)) {
          DefaultNotify.notifyDanger('شما هیچ ویرایشی انجام نداده اید', '', NotiConfig.notifyConfig);
          this.loading = false;
          this.disabledButton = false;

        } else {

          if (this.organization.parentOrganId === this.organization.id) {
            DefaultNotify.notifyDanger('یک سازمان نمی تواند به عنوان سازمان والد خود در نظر گرفته شود.', '', NotiConfig.notifyConfig);

          }

          this.loading = true;

          this.organizationService.update(this.organization, {organizationId: this.organizationId})
            .pipe(takeUntilDestroyed(this)).subscribe(res => {
            this.loading = false;
            console.log('update', res);
            if (res) {
              DefaultNotify.notifySuccess('ویرایش با موفقیت انجام شد.', '', NotiConfig.notifyConfig);
              this.cancel();
            }
          });
        }
      }
    }

  }

  cancel() {
    this.location.back();
  }

  ngOnDestroy(): void {
  }

  changeOrganizationCode() {
    this.organization.organCode = Toolkit2.Common.Fa2En(this.organization.organCode);
    this.organizationService.checkOrganizationCode({organCode: this.organization.organCode}).subscribe(res => {
      console.log('res', res);
      if (res) {
        this.codeCheck = false;
        DefaultNotify.notifyDanger('کد سازمانی وارد شده موجود است.', '', NotiConfig.notifyConfig);
        this.organization.organCode = '';
      } else {
        this.codeCheck = true;
      }
    });
  }

  doSetOrganizationMarker() {
    this.locationSelected = true;
    this.organization.organLocation.lat = this.lastCenter.lat;
    this.organization.organLocation.lng = this.lastCenter.lng;
    console.log(this.organization.organLocation);
  }

  changeLocation() {
    this.locationSelected = false;
    this.organization.organLocation = new MyLocation();
  }

  centerChange(event: LatLngLiteral) {
    this.lastCenter.lat = event.lat;
    this.lastCenter.lng = event.lng;
  }

  changeCity() {
    const city = this.cityList.find(c => c.id === this.organization.cityId);
    // this.lat = city.location.lat;
    // this.lng = city.location.lng;
    // this.lastCenter.lat = this.lat;
    // this.lastCenter.lng = this.lng;
    // this.zoom = 10;
  }

  trimName() {
    this.organization.name = this.organization.name.trim();
  }
}
