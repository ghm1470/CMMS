import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BaseListComponentSeven, ListComponentData, ListQueryParam} from '@angular-boot/common';
import {ActivatedRoute, Router} from '@angular/router';
import {ActionMode, isNullOrUndefined, ListHelper, PageContainer} from '@angular-boot/util';
import {takeUntilDestroyed} from '@angular-boot/core';
import {Purchase} from '../../model/domain/purchase';
import {PurchaseService} from '../../endpoint/purchase.service';

@Component({
  selector: 'app-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.scss']
})
export class PurchaseListComponent extends BaseListComponentSeven<PurchaseListNsp.RouteParam, PurchaseListNsp.QueryParam,
  PurchaseListNsp.ComponentData, Purchase>
  implements OnInit, OnDestroy {
  @Input() listOnCallback: () => any;
  totalElements = 0;
  dataOfPurchaseList: PurchaseListNsp.ComponentData;

  constructor(public purchaseService: PurchaseService,
              public activatedRoute: ActivatedRoute,
              public router: Router) {
    super(activatedRoute, router, PurchaseListNsp.RouteParam, PurchaseListNsp.QueryParam);
    this.dataOfPurchaseList = new PurchaseListNsp.ComponentData(PurchaseListNsp.RouteParam, PurchaseListNsp.QueryParam);
    /**
     * If You want change default values in dataOfPurchaseList, you can do like blew
     * --> this.dataOfPurchaseList.init({sizeList: [2, 5, 10, 15]});
     */
    this.dataOfPurchaseList = new PurchaseListNsp.ComponentData(PurchaseListNsp.RouteParam, PurchaseListNsp.QueryParam);
    this.fireInitiatePagination();
    super.receiveData();
  }
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
    this._setToQueryParams(this.dataOfPurchaseList.queryParam);
  }

  getListOnCallback() {
    return this.listOnCallback;
  }

  getListRemoteArg(optionsOfGetList?: any) {
    return new ListHelper(
      {
        paging: this.dataOfPurchaseList.queryParamReal.paging,
        term: this.dataOfPurchaseList.term
      }
    );
  }

  getListSelf(options?: any) {
    this.purchaseService.getAllByPagination( {
      paging: this.dataOfPurchaseList.queryParamReal.paging,
      totalElements: this.dataOfPurchaseList.itemPage.totalElements,
      term: this.dataOfPurchaseList.term
    }).pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<Purchase>) => {
      ;
      this.dataOfPurchaseList.itemPage = res;
    });
  }

  chooseSelectedItemForEdit(item: Purchase) {
    this.router.navigate(['action'], {
      queryParams: {mode: ActionMode.EDIT, purchaseId: item.id},
      relativeTo: this.activatedRoute
    });
  }

  chooseSelectedItemForView(item: Purchase) {
    this.router.navigate([item.id, ActionMode.VIEW], {
      relativeTo: this.activatedRoute
    });
  }

  deleteItem(item: Purchase) {
    // if (confirm('از حذف این '))
    this.purchaseService.delete({purchaseId: item.id})
      .pipe(takeUntilDestroyed(this)).subscribe((res: boolean) => {
      if (res) {
        this.dataOfPurchaseList.itemPage.content = this.dataOfPurchaseList.itemPage.content
          .filter((e) => {
            return e.id !== item.id;
          });
        this.processPage();
      }
    });
  }

  onReceiveQueryParam(queryParam: PurchaseListNsp.QueryParam): any {
    super.defaultOnReceiveQueryParam(queryParam);
    this.dataOfPurchaseList.queryParamReal = JSON.parse(JSON.stringify(queryParam));
  }

  onReceiveRouteParam(routeParam: PurchaseListNsp.RouteParam): any {
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
    this.dataOfPurchaseList.sortings =
      super.defaultSortify(this.dataOfPurchaseList.sortings, event);
    this.getList();
  }

  chooseOne(item: Purchase) {
    this.selectedItem.emit(item);
  }

  selectDeselectItem(item: Purchase) {
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

  isInSelected(arg: { item: Purchase, selectedList: Purchase[] }) {
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

  getComponentData(): PurchaseListNsp.ComponentData {
    return this.dataOfPurchaseList;
  }

  ngOnDestroy(): void {
  }
}

export namespace PurchaseListNsp {

  export class ComponentData extends ListComponentData<Purchase, RouteParam, QueryParam> {
    labels: Labels = new Labels();
  }


  class Labels {
    listTitle = 'لیست خرید ها';
  }

  export class RouteParam {
  }

  export class QueryParam extends ListQueryParam {
  }
}
