import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {BaseAnyComponentSeven, BaseListComponentSeven, ListComponentData, ListQueryParam} from '@angular-boot/common';
import {
    ActionMode,
    DefaultNotify,
    EnumHandle,
    isNullOrUndefined,
    ListHelper,
    ModalSize,
    PageContainer,
    Paging
} from '@angular-boot/util';
import {ActivatedRoute, Router} from '@angular/router';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {AssetConsumringReference} from '../../model/asset-consumring-reference';
import {AssetConsumingReferenceService} from '../../../endpoint/asset-consuming-reference.service';
import {ModalUtil} from '@angular-boot/widgets';
import {PartDto} from '../../../model/dto/part';
import {DeleteModel} from '../../../../../shared/conferm-delete/model/delete-model';
import {TokenRoleList} from '../../../../../shared/shared/constants/tokenRoleList';
import {CategoryDto} from '../../../../category/model/dto/categoryDto';
import {CategoryService} from '../../../../category/endpoint/category.service';
import {Auth} from '../../../../../shared/constants/cacheKeys';
import {NotiConfig} from "../../../../../shared/tools/notifyConfig";

@Component({
    selector: 'app-asset-consuming-reference-list',
    templateUrl: './asset-consuming-reference-list.component.html',
    styleUrls: ['./asset-consuming-reference-list.component.scss']
})
export class AssetConsumingReferenceListComponent implements OnInit, OnDestroy, OnChanges {
    @Input() partId: string;
    @Input() modePart: ActionMode;
    loading = false;
    dataOfACRList: AssetConsumringReference [] = [];
    actionMode = ActionMode;
    autoplay = false;
    showMessage = false;
    mode: ActionMode = ActionMode.ADD;
    id: string;
    sendACRForEdit = new PartDto.GetAll();
    selectedItemForDelete = new DeleteModel();
    roleList = new TokenRoleList();
    shoWModal = false;
    type = '';

    constructor(protected router: Router,
                protected activatedRoute: ActivatedRoute,
                protected assetConsumingReferenceService: AssetConsumingReferenceService,
    ) {
    }

    canDeactivate(): boolean {
        return true;
    }

    ngOnInit() {
        // this.getRoleListKey();
    }


    getListSelf(options?: any) {
        this.loading = true;
        this.dataOfACRList = [];
        const paging = new Paging();
        paging.page = this.pageIndex;
        paging.size = this.pageSize;
        this.type = 'getPage';
        this.assetConsumingReferenceService.getAllByPaginationACR({
            paging,
            totalElements:-1,
            term: this.term,
            partId: this.partId
        }).pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<AssetConsumringReference>) => {
            this.loading = false;
            this.dataOfACRList = res.content;
            this.length = res.totalElements;
            if (res.content.length === 0) {
                this.showMessage = true;
            } else if (res.content.length > 0) {
                this.showMessage = false;
            }
        });
    }


    search() {
        if (this.pageIndex == 0) {
            this.getListSelf();
        } else {
            this.pageIndex = 0;
            this.getListSelf();
        }
    }

    chooseSelectedItemForEdit(item: AssetConsumringReference) {
        this.id = JSON.parse(JSON.stringify(item.id));
        item.partId = this.partId;
        this.mode = this.actionMode.EDIT;
        this.sendACRForEdit = JSON.parse(JSON.stringify(item));
        this.shoWModal = true;
        setTimeout(() => {
            ModalUtil.showModal('AssetConsumingReferenceModal');
        }, 50);
    }

    chooseSelectedItemForView(item: AssetConsumringReference) {
        this.router.navigate([item.id, ActionMode.VIEW], {
            relativeTo: this.activatedRoute
        });
    }

    deleteItem(event) {
        if (event) {
            this.selectedItemForDelete.loading = true;
            this.assetConsumingReferenceService.deleteACR({ACRId: this.selectedItemForDelete.id})
                .pipe(takeUntilDestroyed(this)).subscribe((res) => {
                if (res !== true) {
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
                    DefaultNotify.notifyDanger(res, '', NotiConfig.notifyConfig);
                    return;
                } else if (res === true) {
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);

                    this.dataOfACRList = this.dataOfACRList

                        .filter((e) => {
                            return e.id !== this.selectedItemForDelete.id;
                        });

                    DefaultNotify.notifySuccess('با موفقیت حذف شد.', '', NotiConfig.notifyConfig);

                } else {
                    DefaultNotify.notifyDanger(res.message, '', NotiConfig.notifyConfig);
                }
            }, error => {
            });

        } else {
            ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
        }
    }


    showModalDelete(item, i) {
        this.selectedItemForDelete.loading = false;
        this.selectedItemForDelete.id = item.id;
        this.selectedItemForDelete.title = ' آیامرجع تجهیز    ' + item.assetName + '#' + item.assetCode + '  برای این قطعه حذف  شود؟ ';
        this.selectedItemForDelete.index = i;
        setTimeout(e => {
            ModalUtil.showModal('modalId' + this.selectedItemForDelete.id);
        }, 10);
    }


    ngOnDestroy(): void {
    }

    receiveMessage(event: AssetConsumringReference) {
        event.partId = this.partId;
        if (this.mode === ActionMode.EDIT) {
            const index = this.dataOfACRList.findIndex(e => e.id === this.id);
            if (index !== -1) {
                this.eventMethod(event, index);
            }
        } else {
            this.eventMethod(event, -1);

        }
    }

    openModal() {
        this.autoplay = !this.autoplay;
        this.mode = ActionMode.ADD;
        this.shoWModal = false;
        this.type = 'openModal';
        setTimeout(() => {
            this.shoWModal = true;
        }, 50);

        setTimeout(() => {
            ModalUtil.showModal('AssetConsumingReferenceModal');
        }, 100);
    }


    eventMethod(event, index) {
        if (index !== -1) {
            this.dataOfACRList[index] = event;
        } else {
            this.dataOfACRList.push(event);
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.partId) {
            this.getListSelf();
        }
    }

    pageSize = 10;
    pageIndex = 0;
    length = -1;
    term: string;

    changePage(event: any) {
        this.length = event.length;
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.getListSelf();

    }
}






