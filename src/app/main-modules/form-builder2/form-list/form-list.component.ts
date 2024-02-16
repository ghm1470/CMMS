import {Component, OnDestroy, OnInit} from '@angular/core';
import {TokenRoleList} from '../../../shared/shared/constants/tokenRoleList';
import {FormCategory} from '../../basicInformation/formCategory/model/dto/formCategory';
import {Form} from '../model/form';
import {DeleteModel} from '../../../shared/conferm-delete/model/delete-model';
import {FormService} from '../service/form.service';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {FormCategoryService} from '../../basicInformation/formCategory/endpoint/form-category.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Auth} from '../../../shared/constants/cacheKeys';
import {ActionMode, DefaultNotify, Paging} from '@angular-boot/util';
import {ModalUtil} from '@angular-boot/widgets';
import {NotiConfig} from "../../../shared/tools/notifyConfig";

@Component({
    selector: 'app-form-list',
    templateUrl: './form-list.component.html',
    styleUrls: ['./form-list.component.scss']
})
export class FormListComponent implements OnInit, OnDestroy {
    roleList = new TokenRoleList();
    categoryList: FormCategory[] = [];
    loading: boolean;
    entityList: Form[] = [];
    pageSize = 10;
    pageIndex = 0;
    length = -1;

    selectedItemForDelete = new DeleteModel();
    FormSearchInput = new FormSearchInputDTO();

    constructor(
        private entityService: FormService,
        private cacheService: CacheService,
        private formCategoryService: FormCategoryService,
        public router: Router,
        private activatedRoute: ActivatedRoute,
    ) {
        this.activatedRoute.queryParams.subscribe(params => {
            params.pageIndex ? this.pageIndex = params.pageIndex : '';
            params.pageSize ? this.pageSize = params.pageSize : '';
            this.getPage();

        });
    }

    ngOnInit(): void {
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

        this.entityService.getAllWithPagination(this.FormSearchInput, {
            paging,
            totalElements:-1,
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

    chooseSelectedItemForEdit(item: Form) {
        this.entityService.ifFormUsedInActivity({formId: item.id}).subscribe(res => {
            if (res) {
                DefaultNotify.notifyDanger('این فرم در فرایند استفاده شده و امکان ویرایش وجود ندارد', '', NotiConfig.notifyConfig);
            } else {
                this.router.navigate(['upsert'], {
                    queryParams: {mode: ActionMode.EDIT, entityId: item.id},
                    relativeTo: this.activatedRoute
                });
            }
        });
    }

    chooseSelectedItemForView(item: Form) {
        this.router.navigate(['view'], {
            queryParams: {mode: ActionMode.VIEW, entityId: item.id},
            relativeTo: this.activatedRoute
        });
    }

    showModalDelete(item: Form, i) {

        console.log(item);
        this.entityService.ifFormUsedInActivity({formId: item.id}).subscribe(res => {
            if (res) {
                DefaultNotify.notifyDanger('این فرم در فرایند استفاده شده و امکان حذف وجود ندارد', '', NotiConfig.notifyConfig);
            } else {
                this.selectedItemForDelete.loading = false;

                this.selectedItemForDelete.id = item.id;
                this.selectedItemForDelete.title = ' آیا    ' + item.title + ' حذف  شود؟ ';
                this.selectedItemForDelete.index = i;
                setTimeout(e => {
                    ModalUtil.showModal('modalId' + this.selectedItemForDelete.id);
                }, 10);
            }
        });

    }

    changePage(event: any) {
        this.length = event.length;
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.navigate();

    }

    search() {
        if (this.pageIndex == 0) {
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
            },
        });

    }

    deleteItem(event) {
        if (event) {
            this.selectedItemForDelete.loading = true;
            this.entityService.delete({newFormId: this.selectedItemForDelete.id})
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
                    DefaultNotify.notifyDanger('این فرم قابل حذف نمی باشد. ', '', NotiConfig.notifyConfig);
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
                }
            });


        } else {
            ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
        }
    }

    formForCopyId: string;
    loadingCopy = false;

    copyForm(form: Form) {
        if (this.loadingCopy) {
            return;
        }
        this.formForCopyId = JSON.parse(JSON.stringify(form.id));
        this.loadingCopy = true;

        this.entityService.getOne({id: this.formForCopyId}).subscribe((res: Form) => {
            const newForm = new Form();
            newForm.title = ' کپی ' + res.title;
            newForm.newElementList = res.newElementList;
            newForm.description = res.description;
            newForm.formCategoryTitle = res.formCategoryTitle;
            newForm.formCategoryId = res.formCategoryId;
            this.entityService.create(newForm).subscribe((res2: Form) => {
                this.loadingCopy = false;
                this.formForCopyId = null;
                res2.formCategoryTitle = JSON.parse(JSON.stringify(form.formCategoryTitle));
                res2.formCategoryId = JSON.parse(JSON.stringify(form.formCategoryId));
                this.entityList.push(res2);
                DefaultNotify.notifySuccess('فرم با موفقیت کپی شد.', '', NotiConfig.notifyConfig);
            }, error => {
                this.loadingCopy = false;
                this.formForCopyId = null;

            });
        }, error => {
            this.loadingCopy = false;
            this.formForCopyId = null;
        });


    }

    ngOnDestroy(): void {
    }
}

export class FormSearchInputDTO {
    title: string;
    formCategoryId: string;
}
