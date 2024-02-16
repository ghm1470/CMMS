import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActionMode, DefaultNotify, PageContainer, Paging, Toolkit2} from '@angular-boot/util';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular-boot/core';
import {ModalUtil} from '@angular-boot/widgets';
import {Reading} from '../../model/reading';
import {DateViewMode} from '../../../../shared/tools/date-view-mode.enum';
import {MeteringService} from '../../../part/endpoint/metering.service';
import {AssetDto} from '../../../asset/model/dto/assetDto';
import {UnitOfMeasurement} from '../../../basicInformation/unitOfMeasurement/model/dto/unitOfMeasurement';
import {AssetService} from '../../../asset/endpoint/asset.service';
import {Toolkit} from '../../../formBuilder/shared/utility/toolkit';
import {Tools} from '../../../../shared/tools/Tools';
import {Moment} from '../../../../shared/shared/tools/date/moment';
import {DeleteModel} from '../../../../shared/conferm-delete/model/delete-model';
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

@Component({
    selector: 'app-reading-list',
    templateUrl: './reading-list.component.html',
    styleUrls: ['./reading-list.component.scss']
})
export class ReadingListComponent implements OnInit, OnDestroy {
    @Input() assetId: string;
    show = false;
    asset = new AssetDto.CreateAsset();
    unitList: UnitOfMeasurement[] = [];
    hasUnitList = false;
    unitId: string;
    unitName: string;
    entityList: Reading.GetAll[] = [];
    tools = Tools;
    actionMode = ActionMode;
    mode: ActionMode = ActionMode.ADD;
    id: string;
    meteringId: string;
    sendReadingForEdit: Reading.GetAll;
    dateViewMode = DateViewMode;
    myMoment = Moment;
    showMessage = false;
    user;
    Toolkit2 = Toolkit2;
    MyToolkit = Toolkit;
    loading: any;

    pageSize = 10;
    pageIndex = 0;
    length = -1;

    constructor(private entityService: MeteringService,
                private assetService: AssetService,
                public activatedRoute: ActivatedRoute,
                public router: Router) {

    }

    ngOnInit() {
        const asset = sessionStorage.getItem('selectedAsset');
        if (asset) {
            this.asset = JSON.parse(asset);
            this.getAsset(this.asset);
        }
        this.user = JSON.parse(sessionStorage.getItem('user'));
    }

    changePage(event: any) {
        this.length = event.length;
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.getListSelf(this.unitId);

    }

    // selectedUid: string;

    getListSelf(uId) {
        console.log('....................', uId)
        this.loading = true;
        this.entityList = [];
        const paging = new Paging();
        paging.page = this.pageIndex;
        paging.size = this.pageSize;
        this.entityService.getMeteringListOfUnitOfAssetPagination({
            paging,
            totalElements:-1,
            assetId: this.asset.id,
            unitId: uId
        }).pipe(takeUntilDestroyed(this)).subscribe((UL: PageContainer<any>) => {
            this.loading = false;
            if (UL) {
                this.entityList = UL.content;
                this.length = UL.totalElements;
                console.log('resss', this.entityList);
                if (UL.content.length > 0) {
                    this.showMessage = false;
                } else if (UL.content.length === 0) {
                    this.showMessage = true;
                }
            }
        });
    }

    chooseSelectedItemForEdit(item: Reading.GetAll) {
        // this.id = JSON.parse(JSON.stringify(item.id));
        this.id = JSON.parse(JSON.stringify(item.assetId));
        this.mode = this.actionMode.EDIT;
        this.sendReadingForEdit = JSON.parse(JSON.stringify(item));
        ModalUtil.showModal('readingModal');
    }

    chooseSelectedItemForView(item: Reading.GetAll) {
        // this.meteringId = item.id;
        this.meteringId = item.meteringId;
        ModalUtil.showModal('readingForViewModal');

    }

    selectedItemForDelete = new DeleteModel();

    showModalDelete(item: Reading.GetAll, i) {
        console.log(item);
        this.selectedItemForDelete.loading = false;

        this.selectedItemForDelete.id = item.meteringId;
        this.selectedItemForDelete.title = ' آیا    ' + item.assetName + ' حذف  شود؟ ';
        this.selectedItemForDelete.index = i;
        setTimeout(e => {
            ModalUtil.showModal('modalId' + this.selectedItemForDelete.id);
        }, 10);
    }

    deleteItem(event) {
        if (event) {
            this.selectedItemForDelete.loading = true;
            this.entityService.delete({meteringId: this.selectedItemForDelete.id})
                .pipe(takeUntilDestroyed(this)).subscribe((res) => {
                this.selectedItemForDelete.loading = false;
                if (res === true) {
                    this.entityList.splice(this.selectedItemForDelete.index, 1);
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
                    // if (this.entityList.length === 0) {
                    //     this.pageIndex = this.pageIndex - 1;
                    //     if (this.pageIndex < 0) {
                    //         this.pageIndex = 0;
                    //         this.getListSelf();
                    //     }
                    //     this.navigate();
                    // }
                } else {
                    DefaultNotify.notifyDanger(res, '', NotiConfig.notifyConfig);
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
                }
            });


        } else {
            ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
        }
    }

    deleteItem1(item: Reading.GetAll) {
        // this.meteringService.delete({meteringId: item.id})
        this.entityService.delete({meteringId: item.assetId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: boolean) => {
            if (res) {
                DefaultNotify.notifySuccess('با موفقیت حذف شد .', '', NotiConfig.notifyConfig);
                this.entityList = this.entityList.filter((e) => {
                    // return e.id !== item.id;
                    return e.assetId !== item.assetId;
                });
            }
        });
    }


    ngOnDestroy(): void {
    }

    openModal() {
        this.show = !this.show;
        this.mode = ActionMode.ADD;
        ModalUtil.showModal('readingModal');
    }

    openAssetModal() {
        ModalUtil.showModal('ViewAsset');
    }

    getAsset(event) {
        this.asset.code = event.code;
        this.asset.name = event.name;
        this.asset.id = event.id;
        sessionStorage.setItem('selectedAsset', JSON.stringify(this.asset));
        this.assetService.getUnitListOfAsset(
            {assetId: this.asset.id}).pipe(takeUntilDestroyed(this)).subscribe((res: UnitOfMeasurement[]) => {
            if (res && res.length > 0) {
                if (res.length > 1) {
                    this.unitList = res;
                    this.hasUnitList = true;
                } else if (res.length < 1 || res.length === 1) {
                    this.hasUnitList = false;
                    this.unitName = res[0].title;
                    this.pageIndex = 0;
                    this.length = 0;
                    this.pageSize = 10;
                    this.unitId = res[0].id;
                    this.getListSelf(res[0].id);
                }
            }
        });
    }

    deleteSelectedAsset() {
        this.asset = new AssetDto.CreateAsset();
        this.entityList = [];
        sessionStorage.removeItem('selectedAsset');
    }

    // setPage(event: number) {
    //     this.paging.page = event;
    //     this.getListSelf(this.unitList[0].id);
    // }
}
