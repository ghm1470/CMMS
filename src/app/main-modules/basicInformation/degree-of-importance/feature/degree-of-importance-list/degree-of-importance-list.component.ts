import {Component, OnDestroy, OnInit} from '@angular/core';
import {TokenRoleList} from '../../../../../shared/shared/constants/tokenRoleList';
import {DeleteModel} from '../../../../../shared/conferm-delete/model/delete-model';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Auth} from '../../../../../shared/constants/cacheKeys';
import {ActionMode, DefaultNotify, Paging} from '@angular-boot/util';
import {ModalUtil} from '@angular-boot/widgets';
import {NotiConfig} from '../../../../../shared/tools/notifyConfig';
import {DegreeOfImportanceDto} from '../../model/degree-of-importance-dto';
import {DegreeOfImportanceService} from '../../endpoint/degree-of-importance.service';
import {workingField} from "../../../working-field/model/working-field-dto";

@Component({
    selector: 'app-degree-of-importance-list',
    templateUrl: './degree-of-importance-list.component.html',
    styleUrls: ['./degree-of-importance-list.component.scss']
})
export class DegreeOfImportanceListComponent implements OnInit, OnDestroy {
    roleList = new TokenRoleList();
    term: string;
    loading: boolean;
    entityList: DegreeOfImportanceDto.GetPage[] = [];
    pageSize = 10;
    pageIndex = 0;
    length = -1;
    selectedItemForDelete = new DeleteModel();

    constructor(private entityService: DegreeOfImportanceService,
                private cacheService: CacheService,
                public router: Router,
                private activatedRoute: ActivatedRoute) {
        this.activatedRoute.queryParams.subscribe(params => {
            params.pageIndex ? this.pageIndex = params.pageIndex : '';
            params.pageSize ? this.pageSize = params.pageSize : '';
            this.getPage();
        });

    }

    ngOnInit(): void {
        this.getRoleListKey();
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

        this.entityService.getPage({
            term: this.term,
            paging,
            totalElements: -1,
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

    loadingCheck = false;
    selectedEntity = new workingField.GetPage();

    checkUsed(item: workingField.GetPage, type: string, index?) {
        if (this.loadingCheck) {
            return;
        }
        let ntiTitle = ' حذف ';
        if (type === 'edit') {
            ntiTitle = ' ویرایش ';
        }
        this.loadingCheck = true;
        this.selectedEntity = item;
        this.entityService.checkUsed({id: item.id}).subscribe((res: boolean) => {
            this.loadingCheck = false;
            if (res === true) {
                DefaultNotify.notifyDanger('این  درجه اهمیت قابل ' + ntiTitle + ' نمی باشد. ', '', NotiConfig.notifyConfig);
                return;
            } else {
                if (type === 'edit') {
                    this.chooseSelectedItemForEdit(item);
                } else if (type === 'delete') {
                    this.showModalDelete(item, index);
                }
            }
        }, error => {
            this.loadingCheck = false;
        });
    }

    chooseSelectedItemForEdit(item: DegreeOfImportanceDto.GetPage) {
        this.router.navigate(['upsert'], {
            queryParams: {mode: ActionMode.EDIT, entityId: item.id},
            relativeTo: this.activatedRoute
        });
    }

    chooseSelectedItemForView(item: DegreeOfImportanceDto.GetPage) {
        this.router.navigate(['view'], {
            queryParams: {mode: ActionMode.VIEW, entityId: item.id},
            relativeTo: this.activatedRoute
        });
    }

    showModalDelete(item: DegreeOfImportanceDto.GetPage, i) {


        this.selectedItemForDelete.loading = false;

        this.selectedItemForDelete.id = item.id;
        this.selectedItemForDelete.title = ' آیا    ' + item.name + ' حذف  شود؟ ';
        this.selectedItemForDelete.index = i;
        setTimeout(e => {
            ModalUtil.showModal('modalId' + this.selectedItemForDelete.id);
        }, 10);


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
            this.entityService.delete({id: this.selectedItemForDelete.id})
                .pipe(takeUntilDestroyed(this)).subscribe((res) => {
                this.selectedItemForDelete.loading = false;
                if (res) {
                    this.entityList.splice(this.selectedItemForDelete.index, 1);
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
                    if (this.entityList.length === 0) {
                        this.pageIndex = this.pageIndex - 1;
                        this.length = -1;
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

    ngOnDestroy(): void {
    }


}
