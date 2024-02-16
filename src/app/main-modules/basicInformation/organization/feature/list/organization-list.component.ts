import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {BaseListComponentSeven, ListComponentData, ListQueryParam} from '@angular-boot/common';
import {ActivatedRoute, Router} from '@angular/router';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {isNullOrUndefined} from 'util';
import {ActionMode, DefaultNotify, ListHelper, ModalSize, PageContainer} from '@angular-boot/util';
import {OrganizationDto} from '../../model/organizationDto';
import {OrganizationService} from '../../endpoint/organization.service';
import {Province} from '../../../../dashboard/model/dto/province';
import {City} from '../../../city/model/city';
import {CityService} from '../../../city/endpoint/city.service';
import {ProvinceService} from '../../../province/endpoint/province.service';
import {ModalUtil} from '@angular-boot/widgets';
import {UserTypeService} from '../../../../securityManagement/endpoint/user-type.service';
import {TokenRoleList} from '../../../../../shared/shared/constants/tokenRoleList';
import {Auth} from '../../../../../shared/constants/cacheKeys';
import {DeleteModel} from '../../../../../shared/conferm-delete/model/delete-model';
import {Tools} from '../../../../../shared/tools/Tools';
import {NotiConfig} from '../../../../../shared/tools/notifyConfig';

@Component({
  selector: 'app-organization-list',
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.scss']
})
export class OrganizationListComponent extends BaseListComponentSeven<OrganizationListNsp.RouteParam, OrganizationListNsp.QueryParam,
  OrganizationListNsp.ComponentData, OrganizationDto.GetAll>
  implements OnInit, OnChanges, OnDestroy {

  constructor(public organizationService: OrganizationService,
              public provinceService: ProvinceService,
              public cityService: CityService,
              public userTypeService: UserTypeService,
              public activatedRoute: ActivatedRoute,
              private cacheService: CacheService,
              public router: Router) {
    super(activatedRoute, router, OrganizationListNsp.RouteParam, OrganizationListNsp.QueryParam);
    this.dataOfOrganizationList = new OrganizationListNsp.ComponentData(OrganizationListNsp.RouteParam, OrganizationListNsp.QueryParam);
    /**
     * If You want change default values in dataOfOrganizationList, you can do like blew
     * --> this.dataOfOrganizationList.init({sizeList: [2, 5, 10, 15]});
     */
    this.dataOfOrganizationList = new OrganizationListNsp.ComponentData(OrganizationListNsp.RouteParam, OrganizationListNsp.QueryParam);
    this.fireInitiatePagination();
    super.receiveData();
  }
  MyModalSize = ModalSize;
  selectedItemForDelete = new DeleteModel();

  lat = 35.6970118;
  lng = 51.4899051;
  zoom = 8;
  userTypeForSearch: string;
  @Input() listOnCallback: () => any;
  @Input() readService;
  totalElements = 0;
  dataOfOrganizationList: OrganizationListNsp.ComponentData;
  getAllOrganizationByFilter = new OrganizationDto.GetAllByFilter();
  provinceList: Province[] = [];
  cityList: City[] = [];
  parentOrganizationList: OrganizationDto.GetAll[] = [];
  organizationList = [];
  tools = Tools;

  orgName: string;
  userTypeListForOrg: any[] = [];
  loading = false;

  roleList = new TokenRoleList();

  options: '';

  orgId: string;

  canDeactivate(): boolean {
    return true;
  }

  private fireInitiatePagination() {
    this.initiatePagination({size: 10});
  }

  private fireResetPagination() {
    this.resetPagination({size: 10});
  }

  ngOnInit() {
    // this.getAllOrganization();
    this._setToQueryParams(this.dataOfOrganizationList.queryParam);
    this.getRoleListKey();
  }

  ngOnChanges() {
    if (this.readService) {
      this.getAllProvince();
      this.getAllParentOrganization();
    }

  }


  getListOnCallback() {
    return this.listOnCallback;
  }


  getRoleListKey() {
    this.cacheService.getItem(Auth.RoleListKey, CacheType.LOCAL_STORAGE).pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
      if (res) {
        this.roleList = res;
      }
    });
  }

  getAllProvince() {
    this.provinceService.getAll()
      .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
      
      if (!isNullOrUndefined(res)) {
        this.provinceList = res;
      }
    });
  }

  getAllOrganization() {
    this.organizationService.getAll().pipe(takeUntilDestroyed(this))
      .subscribe(res => {
        if (res) {
          console.log('organizationList', res);
          this.organizationList = res;
        } else {
          DefaultNotify.notifyDanger('ابتدا سازمان ثبت کنید.', '', NotiConfig.notifyConfig);
        }
      });
  }

  getListRemoteArg(optionsOfGetList?: any) {
    return new ListHelper(
      {
        paging: this.dataOfOrganizationList.queryParamReal.paging,
        term: this.dataOfOrganizationList.term
      }
    );
  }

  getListByFilter(options: string) {
    if (this.getAllOrganizationByFilter.provinceId || this.getAllOrganizationByFilter.cityId || this.getAllOrganizationByFilter.parentOrganId ||
      this.getAllOrganizationByFilter.organizationName || this.getAllOrganizationByFilter.organizationCode) {
      this.dataOfOrganizationList.queryParamReal.paging.page = 0;
      this.getListSelf();
    } else {
      this.getListSelf();
    }
  }

  getListSelf(options?: any) {
    if (isNullOrUndefined(this.getAllOrganizationByFilter.provinceId) || this.getAllOrganizationByFilter.provinceId === '') {
      this.getAllOrganizationByFilter.provinceId = null;
    }
    if (isNullOrUndefined(this.getAllOrganizationByFilter.cityId) || this.getAllOrganizationByFilter.cityId === '') {
      this.getAllOrganizationByFilter.cityId = null;
    }
    if (isNullOrUndefined(this.getAllOrganizationByFilter.parentOrganId) || this.getAllOrganizationByFilter.parentOrganId === '') {
      this.getAllOrganizationByFilter.parentOrganId = null;
    }
    if (isNullOrUndefined(this.getAllOrganizationByFilter.organizationName) || this.getAllOrganizationByFilter.organizationName === '') {
      this.getAllOrganizationByFilter.organizationName = null;
    }
    if (isNullOrUndefined(this.getAllOrganizationByFilter.organizationCode) || this.getAllOrganizationByFilter.organizationCode === '') {
      this.getAllOrganizationByFilter.organizationCode = null;
    }
    this.loading = true;
    this.organizationService.getAllByFilterAndPagination(this.getAllOrganizationByFilter, {
      paging: this.dataOfOrganizationList.queryParamReal.paging,
      totalElements: this.dataOfOrganizationList.itemPage.totalElements
    }).pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<OrganizationDto.GetAll>) => {
      
      this.loading = false;
      if (res) {
//      && res.totalElements && res.totalElements > 0
// از شرط این ها رو ورداشتم علت وجودش رو نمی دونم و باگ ایجاد می کرد
        this.dataOfOrganizationList.itemPage = res;
        console.log('==>', this.dataOfOrganizationList);
      }
    });
  }

  chooseSelectedItemForEdit(item: OrganizationDto.GetAll) {
    this.router.navigate(['action'], {
      queryParams: {mode: ActionMode.EDIT, organizationId: item.id},
      relativeTo: this.activatedRoute
    });
  }

  chooseSelectedItemForView(item: OrganizationDto.GetAll) {
    this.router.navigate([item.id, ActionMode.VIEW], {
      relativeTo: this.activatedRoute
    });
  }


  deleteItem(event) {
    if (event) {
      this.selectedItemForDelete.loading = true;

      this.organizationService.delete({id: this.selectedItemForDelete.id})
        .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
          console.log('res', res);
          if (res === true) {
          this.dataOfOrganizationList.itemPage.content = this.dataOfOrganizationList.itemPage.content
            .filter((e) => {
              return e.id !== this.selectedItemForDelete.id;

            });
          ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
          DefaultNotify.notifySuccess('با موفقیت حذف شد.', '', NotiConfig.notifyConfig);

          // this.processPage();
        } else if (res !== true) {
          ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
          // DefaultNotify.notifyDanger('این سازمان قابل حذف نمی باشد. برای حذف آن ابتدا باید کاربرهای سازمان را حذف نمایید.');
          DefaultNotify.notifyDanger(res, '', NotiConfig.notifyConfig);

        }
      });
    } else {
      ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
    }
  }


  showModalDelete(item, i) {
    console.log(item);
    this.selectedItemForDelete.loading = false;

    this.selectedItemForDelete.id = item.id;
    this.selectedItemForDelete.title = ' آیا    ' + item.name + ' حذف  شود؟ ';
    this.selectedItemForDelete.index = i;
    setTimeout(e => {
      ModalUtil.showModal('modalId' + this.selectedItemForDelete.id);
    }, 10);
  }


  onReceiveQueryParam(queryParam: OrganizationListNsp.QueryParam): any {
    super.defaultOnReceiveQueryParam(queryParam);
    this.dataOfOrganizationList.queryParamReal = JSON.parse(JSON.stringify(queryParam));
  }

  onReceiveRouteParam(routeParam: OrganizationListNsp.RouteParam): any {
    this.fireResetPagination();
    this.hardSyncQueryParamReal();
    this.getList();
  }

  onReceiveRouteData(routeData: any): any {
  }

  onChangedTerm() {
    this.getList();
  }

  public _setToQueryParams(queryParam) {
    super.setToQueryParams(queryParam);
  }

  sortify(event) {
    this.dataOfOrganizationList.sortings =
      super.defaultSortify(this.dataOfOrganizationList.sortings, event);
    this.getList();
  }

  chooseOne(item: OrganizationDto.GetAll) {
    this.selectedItem.emit(item);
  }

  selectDeselectItem(item: OrganizationDto.GetAll) {
    if (this.selectedList.filter(e => e.id === item.id).length > 0) {
      this.selectedList
        .splice(this.selectedList.map(e => e.id)
          .indexOf(item.id), 1);
      this.deSelectedItem.emit(item);
    } else {
      this.selectedList.push(item);
      this.selectedItem.emit(item);
    }
  }

  isInSelected(arg: { item: OrganizationDto.GetAll, selectedList: OrganizationDto.GetAll[] }) {
    if (isNullOrUndefined(arg.selectedList)) {
      return false;
    }
    // const b = arg.selectedList.includes(arg.item);
    let b: boolean;
    if (arg.selectedList.filter(e => e.id === arg.item.id).length > 0) {
      b = true;
    } else {
      b = false;
    }
    return b;
  }

  onChooseMultiMode() {
  }

  onChooseOneMode() {
  }

  onDefaultMode() {
  }

  getComponentData(): OrganizationListNsp.ComponentData {
    return this.dataOfOrganizationList;
  }

  ngOnDestroy(): void {
  }

  getCityList() {
    this.cityList = [];
    this.getAllOrganizationByFilter.cityId = '';
    if (!isNullOrUndefined(this.getAllOrganizationByFilter.provinceId)) {
      this.cityService.getAllByProvinceId({provinceId: this.getAllOrganizationByFilter.provinceId})
        .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
        if (!isNullOrUndefined(res)) {
          this.cityList = res;
        }
      });
    }
  }

  getAllParentOrganization() {
    this.organizationService.getAllParentOrganization()
      .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
      if (!isNullOrUndefined(res)) {
        this.parentOrganizationList = res;
      }
    });
  }

  changeCity() {
    const city = this.cityList.find(c => c.id === this.getAllOrganizationByFilter.cityId);
    this.lat = city.location.lat;
    this.lng = city.location.lng;
    this.zoom = 10;
  }

  openUserTypeModal(org: string, orgId: string) {
    this.userTypeListForOrg = [];
    this.orgName = null;
    this.orgName = org;
    this.orgId = null;
    this.orgId = orgId;
    this.userTypeService.getAllUserTypesOfThOrganization({organizationId: orgId})
      .subscribe(res => {
        if (!isNullOrUndefined(res)) {
          ModalUtil.showModal('UserTypeModal');
          this.userTypeListForOrg = res;

        } else {

          DefaultNotify.notifyDanger('پستی برای ' + this.orgName + ' افزوده نشده', '', NotiConfig.notifyConfig);
        }
      });
  }

  getListByFilterForUserType() {
    if (isNullOrUndefined(this.userTypeForSearch)) {
      this.userTypeForSearch = null;
    }
    this.userTypeService.getAllUserTypesOfThOrganizationByFilter({
      organizationId: this.orgId,
      term: this.userTypeForSearch
    }).pipe(takeUntilDestroyed(this)).subscribe((res) => {
      
      if (res) {
        this.userTypeListForOrg = [];
        this.userTypeListForOrg = res;
      } else {
        DefaultNotify.notifyDanger('این پست در این سازمان وجود ندارد', '', NotiConfig.notifyConfig);
      }
    });
  }
}

export namespace OrganizationListNsp {

  export class ComponentData extends ListComponentData<OrganizationDto.GetAll, RouteParam, QueryParam> {
    labels: Labels = new Labels();
  }


  class Labels {
    listTitle = 'لیست سازمان ها';
  }

  export class RouteParam {
  }

  export class QueryParam extends ListQueryParam {
  }
}
