import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {ActionMode, DefaultNotify, isNullOrUndefined, Paging} from '@angular-boot/util';
import {Budget} from '../../model/dto/budget';
import {BudgetService} from '../../endpoint/budget.service';
import {TokenRoleList} from '../../../../../shared/shared/constants/tokenRoleList';
import {Auth} from '../../../../../shared/constants/cacheKeys';
import {ModalUtil} from '@angular-boot/widgets';
import {DeleteModel} from '../../../../../shared/conferm-delete/model/delete-model';
import {Currency} from "../../../currency/model/dto/currency";
import {CurrencyService} from "../../../currency/endpoint/currency.service";
import set = Reflect.set;
import {NotiConfig} from "../../../../../shared/tools/notifyConfig";

@Component({
    selector: 'app-budget-list',
    templateUrl: './budget-list.component.html',
    styleUrls: ['./budget-list.component.scss']
})
export class BudgetListComponent implements OnInit, OnDestroy {
    currencyList: Currency[] = [];


    pageSize = 10;
    pageIndex = 0;
    length = -1;
    term: string;

    entityList: Budget[] = [];
    loading: boolean;

    selectedItemForDelete = new DeleteModel();
    budgetFilter = new BudgetSearch();

    roleList = new TokenRoleList();

    constructor(private entityService: BudgetService,
                public router: Router,
                private cacheService: CacheService,
                public currencyService: CurrencyService,
                private activatedRoute: ActivatedRoute) {
        this.activatedRoute.queryParams.subscribe(params => {
            if (params.pageIndex) {
                this.pageIndex = params.pageIndex;
                this.pageSize = params.pageSize;
                this.term = params.term;
            }
            this.getPage();

        });
    }

    ngOnInit() {
        this.getRoleListKey();
        this.getAllCurrency();
    }


    getRoleListKey() {
        this.cacheService.getItem(Auth.RoleListKey,
            CacheType.LOCAL_STORAGE).pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            if (res) {
                this.roleList = res;
            }
        });
    }

    getAllCurrency() {
        this.currencyService.getAll()
            .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {

            if (!isNullOrUndefined(res)) {
                this.currencyList = res;
            }
        });
    }

    getPage() {
        this.loading = true;
        const paging = new Paging();
        paging.page = this.pageIndex;
        paging.size = this.pageSize;
        this.entityService.getAllByFilterAndPagination(this.budgetFilter, {
            paging,
            totalElements:-1,
            term: this.term,
        }).subscribe((res: any) => {
            if (res) {
                this.entityList = res.content;
                this.length = res.totalElements;
                this.loading = false;
            }

        }, error => {
            this.loading = false;
        });
    }

    search() {
        this.pageIndex = 0;
        this.getPage();
        // this.navigate();
    }

    navigate() {
        this.router.navigate([window.location.hash.split('#/')[1].split('?')[0]], {
            queryParams: {
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
                // term: this.term,
            },
        });

    }

    changePage(event: any) {
        this.length = event.length;
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.navigate();

    }

    chooseSelectedItemForEdit(item: Budget) {
        this.router.navigate(['action'], {
            queryParams: {mode: ActionMode.EDIT, entityId: item.id},
            relativeTo: this.activatedRoute
        });
    }


    showModalDelete(item, i) {
        this.selectedItemForDelete.loading = false;

        this.selectedItemForDelete.id = item.id;
        this.selectedItemForDelete.title = ' آیا    ' + item.title + ' حذف  شود؟ ';
        this.selectedItemForDelete.index = i;
        setTimeout(e => {
            ModalUtil.showModal('modalId' + this.selectedItemForDelete.id);
        }, 10);
    }

    deleteItem(event) {
        if (event) {
            this.selectedItemForDelete.loading = true;
            this.entityService.delete({budgetId: this.selectedItemForDelete.id})
                .pipe(takeUntilDestroyed(this)).subscribe((res) => {
                this.selectedItemForDelete.loading = false;
                if (res === 'true') {
                    this.entityList = this.entityList
                        .filter((e) => {
                            return e.id !== this.selectedItemForDelete.id;
                        });
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);

                } else {
                    DefaultNotify.notifyDanger(res), '', NotiConfig.notifyConfig;
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
                }
            });


        } else {
            ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
        }
    }

    checkAmount(type: string) {
        if (type === 'a') {
            if (this.budgetFilter.primaryBudgetAmount < 0) {
                this.budgetFilter.primaryBudgetAmount = 0;
            }
        } else {
            if (this.budgetFilter.finalBudgetAmount < 0) {
                this.budgetFilter.finalBudgetAmount = 0;
            }
        }
        if (this.budgetFilter.finalBudgetAmount > 0) {
            if (this.budgetFilter.primaryBudgetAmount > this.budgetFilter.finalBudgetAmount) {
                DefaultNotify.notifyDanger('مبلغ شروع نمیتواند از مبلغ پایان بزرگتر باشد'), '', NotiConfig.notifyConfig;
            }
        }
    }

    ngOnDestroy(): void {
    }
}

////////////////////////////////
//   @Input() listOnCallback: () => any;
//   totalElements = 0;
//   dataOfBudgetList: BudgetListNsp.ComponentData;
//   loading = false;
//
//   roleList = new TokenRoleList();
//   selectedItemForDelete = new DeleteModel();
//   options: '';
//   page;
//   budgetFilter = new BudgetSearch();
//   currencyList: Currency[] = [];
//   toolkit2 = Toolkit2;
//
//   constructor(public budgetService: BudgetService,
//               public activatedRoute: ActivatedRoute,
//               public currencyService: CurrencyService,
//               private cacheService: CacheService,
//               public router: Router) {
//     super(activatedRoute, router, BudgetListNsp.RouteParam, BudgetListNsp.QueryParam);
//     this.page = this.cacheService.get('budgetPage', CacheType.LOCAL_STORAGE);
//     this.dataOfBudgetList = new BudgetListNsp.ComponentData(BudgetListNsp.RouteParam, BudgetListNsp.QueryParam);
//     /**
//      * If You want change default values in dataOfBudgetList, you can do like blew
//      * --> this.dataOfBudgetList.init({sizeList: [2, 5, 10, 15]});
//      */
//     this.dataOfBudgetList = new BudgetListNsp.ComponentData(BudgetListNsp.RouteParam, BudgetListNsp.QueryParam);
//     this.dataOfBudgetList.queryParamReal.paging.page = this.page;
//     this.fireInitiatePagination();
//     super.receiveData();
//   }
//
//   canDeactivate(): boolean {
//     return true;
//   }
//
//   private fireInitiatePagination() {
//     this.initiatePagination({size: 10});
//   }
//
//   private fireResetPagination() {
//     this.resetPagination({size: 10});
//   }
//
//   ngOnInit() {
//     // this._setToQueryParams(this.dataOfBudgetList.queryParam);
//     this.getRoleListKey();
//     this.getAllCurrency();
//   }
//
//   getListOnCallback() {
//     return this.listOnCallback;
//   }
//
//   getListRemoteArg(optionsOfGetList?: any) {
//     return new ListHelper(
//       {
//         paging: this.dataOfBudgetList.queryParamReal.paging,
//         term: this.dataOfBudgetList.term
//       }
//     );
//   }
//
//   getAllCurrency() {
//     this.currencyService.getAll()
//       .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
//
//       if (!isNullOrUndefined(res)) {
//         this.currencyList = res;
//       }
//     });
//   }
//
//   getRoleListKey() {
//     this.cacheService.getItem(Auth.RoleListKey, CacheType.LOCAL_STORAGE).pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
//       if (res) {
//         this.roleList = res;
//       }
//     });
//   }
//
//
//   getListSelf(options?: any) {
//     if (this.budgetFilter.finalBudgetAmount > 0) {
//       if (this.budgetFilter.primaryBudgetAmount > this.budgetFilter.finalBudgetAmount) {
//         DefaultNotify.notifyDanger('مبلغ شروع نمیتواند از مبلغ پایان بزرگتر باشد');
//         return;
//       }
//     }
//
//
//     if (this.budgetFilter.primaryBudgetAmount) {
//       this.budgetFilter.primaryBudgetAmount = +Toolkit2.Common.Fa2En(+this.budgetFilter.primaryBudgetAmount);
//     }
//     if (this.budgetFilter.finalBudgetAmount) {
//       this.budgetFilter.finalBudgetAmount = +Toolkit2.Common.Fa2En(+this.budgetFilter.finalBudgetAmount);
//     }
//     // if (this.page === this.dataOfBudgetList.queryParamReal.paging.page) {
//     this.loading = true;
//     this.budgetService.getAllByFilterAndPagination(this.budgetFilter, {
//       paging: this.dataOfBudgetList.queryParamReal.paging,
//       totalElements: this.dataOfBudgetList.itemPage.totalElements,
//       term: this.dataOfBudgetList.term
//     }).pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<Budget>) => {
//       this.loading = false;
//
//       this.dataOfBudgetList.itemPage = res;
//     });
//     // }
//   }
//
//   chooseSelectedItemForEdit(item: Budget) {
//     this.cacheService.set('budgetPage', this.page, CacheType.LOCAL_STORAGE);
//     this.router.navigate(['action'], {
//       queryParams: {mode: ActionMode.EDIT, budgetId: item.id},
//       relativeTo: this.activatedRoute
//     });
//   }
//
//   chooseSelectedItemForView(item: Budget) {
//     this.router.navigate([item.id, ActionMode.VIEW], {
//       relativeTo: this.activatedRoute
//     });
//   }
//
//
//   deleteItem(event) {
//     if (event) {
//       this.selectedItemForDelete.loading = true;
//       this.budgetService.delete({budgetId: this.selectedItemForDelete.id})
//         .pipe(takeUntilDestroyed(this)).subscribe((res) => {
//         if (res === 'true') {
//           this.dataOfBudgetList.itemPage.content = this.dataOfBudgetList.itemPage.content
//             .filter((e) => {
//               return e.id !== this.selectedItemForDelete.id;
//             });
//           DefaultNotify.notifySuccess('با موفقیت حذف شد.');
//
//           ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
//
//           this.processPage();
//         } else if (res !== 'true') {
//           DefaultNotify.notifyDanger(res);
//           ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
//         }
//       });
//
//     } else {
//       ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
//     }
//   }
//
//
//   showModalDelete(item, i) {
//     this.selectedItemForDelete.loading = false;
//
//     this.selectedItemForDelete.id = item.id;
//     this.selectedItemForDelete.title = ' آیا    ' + item.title + ' حذف  شود؟ ';
//     this.selectedItemForDelete.index = i;
//     setTimeout(e => {
//       ModalUtil.showModal('modalId' + this.selectedItemForDelete.id);
//     }, 10);
//   }
//
//
//   onReceiveQueryParam(queryParam: BudgetListNsp.QueryParam): any {
//     super.defaultOnReceiveQueryParam(queryParam);
//     this.dataOfBudgetList.queryParamReal = JSON.parse(JSON.stringify(queryParam));
//   }
//
//   onReceiveRouteParam(routeParam: BudgetListNsp.RouteParam): any {
//     this.fireResetPagination();
//     this.hardSyncQueryParamReal();
//     this.getList();
//   }
//
//   onReceiveRouteData(routeData: any): any {
//   }
//
//   onChangedTerm() {
//     this.getList();
//   }
//
//   public _setToQueryParams(queryParam) {
//     super.setToQueryParams(queryParam);
//   }
//
//   sortify(event) {
//     this.dataOfBudgetList.sortings =
//       super.defaultSortify(this.dataOfBudgetList.sortings, event);
//     this.getList();
//   }
//
//   chooseOne(item: Budget) {
//     this.selectedItem.emit(item);
//   }
//
//   selectDeselectItem(item: Budget) {
//     if (this.selectedList.filter(e => e.id === item.id).length > 0) {
//       this.selectedList
//         .splice(this.selectedList.map(e => e.id)
//           .indexOf(item.id), 1);
//       this.deSelectedItem.emit(item);
//     } else {
//       this.selectedList.push(item);
//       this.selectedItem.emit(item);
//     }
//   }
//
//   isInSelected(arg: { item: Budget, selectedList: Budget[] }) {
//     if (isNullOrUndefined(arg.selectedList)) {
//       return false;
//     }
//     // const b = arg.selectedList.includes(arg.item);
//     let b: boolean;
//     if (arg.selectedList.filter(e => e.id === arg.item.id).length > 0) {
//       b = true;
//     } else {
//       b = false;
//     }
//     return b;
//   }
//
//   onChooseMultiMode() {
//   }
//
//   onChooseOneMode() {
//   }
//
//   onDefaultMode() {
//   }
//
//   getComponentData(): BudgetListNsp.ComponentData {
//     return this.dataOfBudgetList;
//   }
//
//   ngOnDestroy(): void {
//   }
//
//   d() {
//     this.page = this.dataOfBudgetList.queryParamReal.paging.page;
//     this.cacheService.set('budgetPage', this.dataOfBudgetList.queryParamReal.paging.page, CacheType.LOCAL_STORAGE);
//     this.getListSelf();
//
//   }
//
//   checkAmount(type: string) {
//     if (type === 'a') {
//       if (this.budgetFilter.primaryBudgetAmount < 0) {
//         this.budgetFilter.primaryBudgetAmount = 0;
//       }
//     } else {
//       if (this.budgetFilter.finalBudgetAmount < 0) {
//         this.budgetFilter.finalBudgetAmount = 0;
//       }
//     }
//     if (this.budgetFilter.finalBudgetAmount > 0) {
//       if (this.budgetFilter.primaryBudgetAmount > this.budgetFilter.finalBudgetAmount) {
//         DefaultNotify.notifyDanger('مبلغ شروع نمیتواند از مبلغ پایان بزرگتر باشد');
//       }
//     }
//   }
//
//   search(budgetFilter: BudgetSearch, nbvPattern: any, nbvPattern2: any) {
//     if (nbvPattern === null && nbvPattern2 === null) {
//       this.getListSelf(budgetFilter);
//     }
//   }
// }
//
// export namespace BudgetListNsp {
//
//   export class ComponentData extends ListComponentData<Budget, RouteParam, QueryParam> {
//     labels: Labels = new Labels();
//   }
//
//
//   class Labels {
//     listTitle = 'لیست بودجه ها';
//   }
//
//
//   export class RouteParam {
//   }
//
//   export class QueryParam extends ListQueryParam {
//   }
//
//
// }
//
export class BudgetSearch {
    id: string;
    title: string;
    description: string;
    code: string;
    budgetAmount: string;
    currency: string;
    primaryBudgetAmount: number;
    finalBudgetAmount: number;
}
