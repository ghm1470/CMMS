import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {
    ActionMode,
    DefaultNotify,
    isNullOrUndefined,
    ListHelper,
    ModalSize,
    PageContainer,
    Paging,
    Toolkit2
} from '@angular-boot/util';
import {Form} from './fb-model/form/form';
import {FormService} from './fb-service/form.service';
import {SmartTableConfig, SmartTableConfigI} from '../../shared/util-module/smart-table-test/smart-table-config';
import {TokenRoleList} from '../../shared/shared/constants/tokenRoleList';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {Auth} from '../../shared/constants/cacheKeys';
import {ActivatedRoute, Router} from '@angular/router';
import {DeleteModel} from '../../shared/conferm-delete/model/delete-model';
import {ModalUtil} from '@angular-boot/widgets';
import {FormCategory} from './fb-model/form/form-category';
import {FormCategoryService} from '../basicInformation/formCategory/endpoint/form-category.service';
import {Tools} from '../../shared/tools/Tools';
import {ActivityService} from '../activity/service/activity.service';
import {NotiConfig} from "../../shared/tools/notifyConfig";

declare var $: any;

@Component({
    selector: 'app-form-builder',
    templateUrl: './form-builder.component.html',
    styleUrls: ['./form-builder.component.css']
})
export class FormBuilderComponent implements OnInit, OnDestroy {

    constructor(private entityService: FormService,
                public router: Router,
                private cacheService: CacheService,
                private activatedRoute: ActivatedRoute,
                private activityService: ActivityService,
                private formCategoryService: FormCategoryService) {
        this.activatedRoute.queryParams.subscribe(params => {
            params.pageIndex ? this.pageIndex = params.pageIndex : '';
            params.pageSize ? this.pageSize = params.pageSize : '';
            params.term ? this.term = params.term : '';
            this.getPage();

        });
        this.config = {
            data: [],
            table: {
                rows: [],
                columns: [
                    {
                        title: '#'
                    },
                    {
                        title: 'عنوان فرم',
                        name: 'title',
                        sort: '',
                        filtering: {filterString: ''},
                    },
                    {
                        title: 'توضیحات',
                        name: 'description',
                        sort: '',
                        filtering: {filterString: ''},
                    },
                    {
                        title: 'عملیات',
                    },
                ]
            },
            export: {},
            paging: {},
            filtering: {filterString: ''},
        };

    }


///////////////////////////////
    pageSize = 10;
    pageIndex = 0;
    length = -1;
    term: string;

    entityList: FormFieldsAndFormCategoryDTO[] = [];
    loading: boolean;

    selectedItemForDelete = new DeleteModel();

    roleList = new TokenRoleList();
    mySurveyForm: Form = new Form();
    formList: FormFieldsAndFormCategoryDTO[] = [];
    plan: string;
    formRegister: any;
    modalOpen: boolean;
    mode: ActionMode = ActionMode.ADD;
    actionMode = ActionMode;
    data: any[];
    config: SmartTableConfigI;
    expanderTemplate: any;
    companyId = '';
    MyModalSize = ModalSize;
    formId;
    formTitle;
    NextStep1 = false;
    FormSearchInput = new FormSearchInputDTO();
    categoryList: any[] = [];
    tools = Tools;

    // ==================================
    totalElements = 0;
    // dataOfFormFieldsAndFormCategoryDTO: FormFieldsAndFormCategoryDTONsp.ComponentData;
    toolkit2 = Toolkit2;

    edit = false;

    ngOnInit() {
        this.getRoleListKey();
        this.getAllFormCategory();

    }

    getAllFormCategory() {
        this.formCategoryService.getAll().subscribe((res) => {

            if (res.data.length > 0) {
                this.categoryList = res.data;
                console.log('yyyyyio', this.categoryList);
            }
        });
    }

    getRoleListKey() {
        this.cacheService.getItem(Auth.RoleListKey,
            CacheType.LOCAL_STORAGE).pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            if (res) {
                this.roleList = res;
            }
        });
    }

    getPage() {
        this.loading = true;
        const paging = new Paging();
        paging.page = this.pageIndex;
        paging.size = this.pageSize;

        this.entityService.getAllByPagination(this.FormSearchInput, {
            paging,
            totalElements:-1,
        })
            // this.entityService.getAll()
            .subscribe((res: any) => {
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
        if (this.pageIndex === 0) {
            this.getPage();
        } else {
            this.pageIndex = 0;
            this.navigate();
        }

    }

    navigate() {
        this.router.navigate([window.location.hash.split('#/')[1].split('?')[0]], {
            queryParams: {
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
                term: this.term,
            },
        });

    }

    changePage(event: any) {
        this.length = event.length;
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.navigate();

    }

    chooseSelectedItemForEdit(item: FormFieldsAndFormCategoryDTO) {
        this.activityService.checkIfFormUsedInActivity({formId: item.id}).subscribe(res => {
            if (res) {
                DefaultNotify.notifyDanger('این فرم در فرایند استفاده شده و امکان ویرایش وجود ندارد', '', NotiConfig.notifyConfig);
            } else {
                this.entityService.getOneForm(item.id).subscribe((form: Form) => {
                    this.mySurveyForm = form;
                    this.edit = true;
                });
            }
        });
    }

    chooseSelectedItemForView(item: FormFieldsAndFormCategoryDTO) {
        this.router.navigate(['view'], {
            queryParams: {mode: ActionMode.VIEW, formId: item.id},
            relativeTo: this.activatedRoute
        });
    }

    showModalDelete(item: FormFieldsAndFormCategoryDTO, i) {
        console.log(item);
        this.selectedItemForDelete.loading = false;

        this.selectedItemForDelete.id = item.id;
        this.selectedItemForDelete.title = ' آیا    ' + item.name + ' حذف  شود؟ ';
        this.selectedItemForDelete.index = i;
        setTimeout(e => {
            ModalUtil.showModal('modalId' + this.selectedItemForDelete.id);
        }, 10);
    }

    deleteItem(event) {
        if (event) {
            this.selectedItemForDelete.loading = true;
            this.entityService.deleteForm(this.selectedItemForDelete.id)
                .pipe(takeUntilDestroyed(this)).subscribe((res) => {
                this.selectedItemForDelete.loading = false;
                if (res) {
                    this.entityList.splice(this.selectedItemForDelete.index, 1);
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
                    if (this.entityList.length === 0) {
                        this.pageIndex = this.pageIndex - 1;
                        if (this.pageIndex < 0) {
                            this.pageIndex = 0;
                            this.getPage();
                        }
                        this.navigate();
                    }
                } else {
                    DefaultNotify.notifyDanger(res.message, '', NotiConfig.notifyConfig);
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
                }
            });


        } else {
            ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
        }
    }

    changeEditBoolean(event: boolean) {
        this.edit = event;
        this.getPage();
    }

    createForm() {
        $('#form-search').collapse('hide');
        this.mySurveyForm = new Form();
        this.edit = true;
    }

    cancelCreateForm(item) {
        if (item === true) {
            this.mySurveyForm = new Form();
            this.edit = false;
        }
    }

    ngOnDestroy(): void {
    }
}

export class FormFieldsAndFormCategoryDTO {
    id: string;
    name: string;
    description: string;
    formCategory = new FormCategory();
}

export class FormSearchInputDTO {
    title: string;
    formCategoryId: string;
}

//////////////////////////////////////

//   constructor(public activatedRoute: ActivatedRoute,
//               private cacheService: CacheService,
//               private formCategoryService: FormCategoryService,
//               private activityService: ActivityService,
//               public router: Router,
//               private formService: FormService) {
//     super(activatedRoute, router, FormFieldsAndFormCategoryDTONsp.RouteParam, FormFieldsAndFormCategoryDTONsp.QueryParam);
//     this.config = {
//       data: [],
//       table: {
//         rows: [],
//         columns: [
//           {
//             title: '#'
//           },
//           {
//             title: 'عنوان فرم',
//             name: 'title',
//             sort: '',
//             filtering: {filterString: ''},
//           },
//           {
//             title: 'توضیحات',
//             name: 'description',
//             sort: '',
//             filtering: {filterString: ''},
//           },
//           {
//             title: 'عملیات',
//           },
//         ]
//       },
//       export: {},
//       paging: {},
//       filtering: {filterString: ''},
//     };
//     this.dataOfFormFieldsAndFormCategoryDTO =
//       new FormFieldsAndFormCategoryDTONsp.ComponentData(FormFieldsAndFormCategoryDTONsp.RouteParam,
//       FormFieldsAndFormCategoryDTONsp.QueryParam);
//     /**
//      * If You want change default values in dataOfFormFieldsAndFormCategoryDTO, you can do like blew
//      * --> this.dataOfFormFieldsAndFormCategoryDTO.init({sizeList: [2, 5, 10, 15]});
//      */
//     this.dataOfFormFieldsAndFormCategoryDTO =
//       new FormFieldsAndFormCategoryDTONsp.ComponentData(FormFieldsAndFormCategoryDTONsp.RouteParam,
//       FormFieldsAndFormCategoryDTONsp.QueryParam);
//
//     this.fireInitiatePagination();
//     super.receiveData();
//   }
//
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
//     this.getAllFormCategory();
//     // this._setToQueryParams(this.dataOfFormFieldsAndFormCategoryDTO.queryParam);
//     const user: any = JSON.parse(sessionStorage.getItem('user'));
//     this.companyId = user.orgId;
//     // this.getAllLimit();
//     this.getRoleListKey();
//   }
//
//   getListOnCallback() {
//     return this.listOnCallback;
//   }
//
//   getListRemoteArg(optionsOfGetList?: any) {
//     return new ListHelper(
//       {
//         paging: this.dataOfFormFieldsAndFormCategoryDTO.queryParamReal.paging,
//         term: this.dataOfFormFieldsAndFormCategoryDTO.term
//       }
//     );
//   }
//
//   getListByFilter() {
//     if (this.dataOfFormFieldsAndFormCategoryDTO.term) {
//       this.dataOfFormFieldsAndFormCategoryDTO.queryParamReal.paging.page = 0;
//     }
//     this.getListSelf();
//   }
//
//   getListSelf(options?: any) {
//     this.loading = true;
//     this.formService.getAllByPagination(this.FormSearchInput, {
//       paging: this.dataOfFormFieldsAndFormCategoryDTO.queryParamReal.paging,
//       totalElements: this.dataOfFormFieldsAndFormCategoryDTO.itemPage.totalElements,
//     }).pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<FormFieldsAndFormCategoryDTO>) => {
//       this.loading = false;
//
//       this.dataOfFormFieldsAndFormCategoryDTO.itemPage = res;
//       console.log(this.dataOfFormFieldsAndFormCategoryDTO.itemPage.content);
//       this.config.data = this.createData(this.formList);
//       this.config = SmartTableConfig.getInstance(this.config);
//     });
//   }
//
//   chooseSelectedItemForEdit(id) {
//     this.activityService.checkIfFormUsedInActivity({formId: id}).subscribe(res => {
//       if (res) {
//         DefaultNotify.notifyDanger('این فرم در فرایند استفاده شده و امکان ویرایش وجود ندارد');
//       } else {
//         this.formService.getOneForm(id).subscribe((form: Form) => {
//           this.mySurveyForm = form;
//           this.edit = true;
//         });
//       }
//     });
//
//   }
//
//   chooseSelectedItemForView(id) {
//     this.router.navigate(['view'], {
//       queryParams: {mode: ActionMode.VIEW, formId: id},
//       relativeTo: this.activatedRoute
//     });
//   }
//
//
//   deleteItem(event) {
//     if (event) {
//       this.selectedItemForDelete.loading = true;
//       this.formService.deleteForm(this.selectedItemForDelete.id)
//         .pipe(takeUntilDestroyed(this)).subscribe((res) => {
//
//         if (res !== true) {
//           ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
//           DefaultNotify.notifyDanger(res);
//         } else if (res === true) {
//           ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
//
//           this.dataOfFormFieldsAndFormCategoryDTO.itemPage.content = this.dataOfFormFieldsAndFormCategoryDTO.itemPage.content
//
//             .filter((e) => {
//               return e.id !== this.selectedItemForDelete.id;
//             });
//           this.processPage();
//
//           DefaultNotify.notifySuccess('با موفقیت حذف شد.');
//
//         }
//       }, error => {
//       });
//
//     } else {
//       ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
//     }
//   }
//
//
//   showModalDelete(item, i) {
//     console.log(item);
//     this.selectedItemForDelete.loading = false;
//
//     this.selectedItemForDelete.id = item.id;
//     this.selectedItemForDelete.title = ' آیا    ' + item.name + ' حذف  شود؟ ';
//     this.selectedItemForDelete.index = i;
//     setTimeout(e => {
//       ModalUtil.showModal('modalId' + this.selectedItemForDelete.id);
//     }, 10);
//   }
//
//
//   onReceiveQueryParam(queryParam: FormFieldsAndFormCategoryDTONsp.QueryParam): any {
//     super.defaultOnReceiveQueryParam(queryParam);
//     this.dataOfFormFieldsAndFormCategoryDTO.queryParamReal = JSON.parse(JSON.stringify(queryParam));
//   }
//
//   onReceiveRouteParam(routeParam: FormFieldsAndFormCategoryDTONsp.RouteParam): any {
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
//     this.dataOfFormFieldsAndFormCategoryDTO.sortings =
//       super.defaultSortify(this.dataOfFormFieldsAndFormCategoryDTO.sortings, event);
//     this.getList();
//   }
//
//   chooseOne(item: FormFieldsAndFormCategoryDTO) {
//     this.selectedItem.emit(item);
//   }
//
//   selectDeselectItem(item: FormFieldsAndFormCategoryDTO) {
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
//   isInSelected(arg: { item: FormFieldsAndFormCategoryDTO, selectedList: FormFieldsAndFormCategoryDTO[] }) {
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
//   getComponentData(): FormFieldsAndFormCategoryDTONsp.ComponentData {
//     return this.dataOfFormFieldsAndFormCategoryDTO;
//   }
//
//   ngOnDestroy(): void {
//   }
//
//
//   createData(res) {
//     // فقط دیتایی رو به شکل خاصی درست می کند.
//     this.config.data = [];
//     const data = [];
//     for (const i of res) {
//       try {
//         const row = {
//           id: i.id,
//           title: i.title ? i.title : '---',
//           description: i.description ? i.description : '---',
//         };
//         console.log(row);
//         data.push(row);
//       } catch (e) {
//         console.log('this request have problem : ' + i);
//       }
//     }
//     return data;
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
//   createForm() {
//     $('#form-search').collapse('hide');
//     this.mySurveyForm = new Form();
//     this.edit = true;
//   }
//
//   cancelCreateForm(item) {
//     if (item === true) {
//       this.mySurveyForm = new Form();
//       this.edit = false;
//     }
//   }
//
//   // showNoSaveItem() {
//   //   ModalUtil.showModal('noSaveMessage');
//   //
//   // }
//
//
//   checkUsingThisForm(id) {
//     this.formService.checkUsingForm(id).subscribe((res: any) => {
//       if (res === false) {
//         DefaultNotify.notifySuccess('حذف شد');
//         // this.deleteForm(id);
//       } else {
//         DefaultNotify.notifyDanger('به علت استفاده ی این فرم در فرایند ساز شما قادر به حذف آن نیستید.');
//       }
//     });
//   }
//
//   changeEditBoolean(event: boolean) {
//     this.edit = event;
//     this.getListByFilter();
//   }
//
//   getAllFormCategory() {
//     this.formCategoryService.getAll().subscribe((res) => {
//
//       if (res.data.length > 0) {
//         this.categoryList = res.data;
//         console.log('yyyyyio', this.categoryList);
//       }
//     });
//   }
//
//
//   // goToNextStep() {
//   //  this.NextStep1 = true;
//   // }
//   trimTitle() {
//     this.FormSearchInput.title = this.FormSearchInput.title.trim();
//   }
// }
//
// export class FormFieldsAndFormCategoryDTO {
//   id: string;
//   name: string;
//   description: string;
//   formCategory = new FormCategory();
// }
//
// export class FormSearchInputDTO {
//   title: string;
//   formCategoryId: string;
// }
//
// export namespace FormFieldsAndFormCategoryDTONsp {
//
//   export class ComponentData extends ListComponentData<FormFieldsAndFormCategoryDTO, RouteParam, QueryParam> {
//     labels: Labels = new Labels();
//   }
//
//
//   class Labels {
//     listTitle = 'لیست دسته ها';
//   }
//
//   export class RouteParam {
//   }
//
//   export class QueryParam extends ListQueryParam {
//   }
//
// }
// // ====================================================================
//
// //
// // implements OnInit , OnDestroy {
// //
// //   edit = false;
// //   mySurveyForm: Form = new Form();
// //   formList: Form[] = [];
// //   plan: string;
// //   formRegister: any;
// //   modalOpen: boolean;
// //   mode: ActionMode = ActionMode.ADD;
// //   actionMode = ActionMode;
// //   data: any[];
// //   config: SmartTableConfigI;
// //   expanderTemplate: any;
// //   companyId = '';
// //   MyModalSize = ModalSize;
// //   formId;
// //   formTitle;
// //
// //   roleList = new TokenRoleList();
// //
// //   constructor(private formService: FormService,
// //     private cacheService: CacheService,
// //     public router: Router,
// //     public activatedRoute: ActivatedRoute
// // ) {
// //     this.config = {
// //       data: [],
// //       table: {
// //         rows: [],
// //         columns: [
// //           {
// //             title: '#'
// //           },
// //           {
// //             title: 'عنوان فرم',
// //             name: 'title',
// //             sort: '',
// //             filtering: {filterString: ''},
// //           },
// //           {
// //             title: 'توضیحات',
// //             name: 'description',
// //             sort: '',
// //             filtering: {filterString: ''},
// //           },
// //           {
// //             title: 'عملیات',
// //           },
// //         ]
// //       },
// //       export: {},
// //       paging: {},
// //       filtering: {filterString: ''},
// //     };
// //   }
// //
// //   createData(res) {
// //     // فقط دیتایی رو به شکل خاصی درست می کند.
// //     this.config.data = [];
// //     const data = [];
// //     for (const i of res) {
// //       try {
// //         const row = {
// //           id: i.id,
// //           title: i.title ? i.title : '---',
// //           description: i.description ? i.description : '---',
// //         };
// //         console.log(row);
// //         data.push(row);
// //       } catch (e) {
// //         console.log('this request have problem : ' + i);
// //       }
// //     }
// //     return data;
// //   }
// //
// //   ngOnInit() {
// //     // از یوزری که هست id شرکتش رو بر می داره بعدش تمامی فرم های اون شرکت رو گت می کنه
// //     const user: any = JSON.parse(sessionStorage.getItem('user'));
// //     console.log(user);
// //     this.companyId = user.orgId;
// //     this.getAllLimit();
// //     this.getRoleListKey();
// //   }
// //   getAllLimit() {
// //     this.formService.getAllLimit(this.companyId).subscribe((res: Form[]) => {
// //       this.formList = res;
// //       // console.log('this.formList', this.formList);
// //       this.config.data = this.createData(this.formList);
// //       // console.log('this.config.data', this.config);
// //       this.config = SmartTableConfig.getInstance(this.config);
// //       // console.log('this.config', this.config);
// //     });
// //   }
// //
// //   getRoleListKey() {
// //     this.cacheService.getItem(Auth.RoleListKey, CacheType.LOCAL_STORAGE).pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
// //       if (res) {
// //         this.roleList = res;
// //       }
// //     });
// //   }
// //
// //
// //   ChangeSurveyForm($event) {
// //     // if (!isNullOrUndefined($event.id)) {
// //     //   let beInList = false;
// //     //   for (let i = 0; i < this.formList.length; i++) {
// //     //     if (this.formList[i].id === $event.id) {
// //     //       this.formList.splice(i, 1);
// //     //       this.formList.push($event);
// //     //       beInList = true;
// //     //     }
// //     //   }
// //     //   if (!beInList) {
// //     //
// //     //     this.formList.push($event);
// //     //   }
// //     //   this.config.data = this.createData(this.formList);
// //     //   this.config = SmartTableConfig.getInstance(this.config);
// //     //   this.edit = false;
// //     // }
// //   }
// //
// //   addPlan2($event) {
// //     console.log($event);
// //   }
// //
// //   editForm(id) {
// //     this.formService.getOneForm(id).subscribe((res: Form) => {
// //       this.mySurveyForm = res;
// //       this.edit = true;
// //     });
// //   }
// //
// //   createForm() {
// //     this.mySurveyForm = new Form();
// //     this.edit = true;
// //   }
// //
// //   cancelCreateForm() {
// //     this.mySurveyForm = new Form();
// //     this.edit = false;
// //   }
// //   checkUsingThisForm(id) {
// //     this.formService.checkUsingForm(id).subscribe((res: any) => {
// //       if (res === false) {
// //         DefaultNotify.notifySuccess('حذف شد')
// //         // this.deleteForm(id);
// //       } else {
// //         DefaultNotify.notifyDanger('به علت استفاده ی این فرم در فرایند ساز شما قادر به حذف آن نیستید.')
// //       }
// //     });
// //   }
// //   // deleteForm(id: any) {
// //   //   this.formService.deleteForm(id).subscribe((res: any) => {
// //   //     if (res === true) {
// //   //       for (let i = 0; i < this.formList.length; i++) {
// //   //         if (this.formList[i].id === id) {
// //   //           this.formList.splice(i, 1);
// //   //           this.config.data = this.createData(this.formList);
// //   //           this.config = SmartTableConfig.getInstance(this.config);
// //   //           DefaultNotify.notifySuccess('عملیات با موفقیت انجام شد.');
// //   //           break;
// //   //         }
// //   //       }
// //   //     } else if (res.error && res.error.text && res.error.text === 'CAN_NOT_BE_EDITED') {
// //   //       DefaultNotify.notifyDanger('از این فرم استفاده شده و شما نمیتوانید آن را حذف کنید.');
// //   //     } else {
// //   //       DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.');
// //   //     }
// //   //   }, error => {
// //   //     DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.');
// //   //   });
// //   // }
// //
// //   showForm(id: any, title) {
// //     this.formId = id;
// //     this.formTitle = title;
// //     this.editForm(id);
// //     this.edit = true;
// //     this.mode = this.actionMode.VIEW;
// //   }
// //
// //   ngOnDestroy(): void {
// //   }
// //
// //   changeEditBoolean(event: boolean) {
// //     this.edit = event;
// //     this.getAllLimit();
// //   }
// //   chooseSelectedItemForView(id) {
// //     this.router.navigate(['view'], {
// //       queryParams: {mode: ActionMode.VIEW, formId: id},
// //       relativeTo: this.activatedRoute
// //     });
// //   }
// // }
