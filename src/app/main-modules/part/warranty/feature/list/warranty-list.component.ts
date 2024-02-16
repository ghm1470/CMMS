import {AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {BaseAnyComponentSeven} from '@angular-boot/common';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular-boot/core';
import {ActionMode, DefaultNotify, PageContainer, Paging} from '@angular-boot/util';
import {WarrantyService} from '../../endpoint/warranty.service';
import {PartDto} from '../../../model/dto/part';
import {ModalUtil} from '@angular-boot/widgets';
import {DateViewMode} from '../../../../../shared/tools/date-view-mode.enum';
import {isNullOrUndefined} from 'util';
import {DeleteModel} from '../../../../../shared/conferm-delete/model/delete-model';
import GetAllWarranty = PartDto.GetAllWarranty;
import Warranty = PartDto.Warranty;
import {Moment} from "../../../../../shared/shared/tools/date/moment";
import {NotiConfig} from "../../../../../shared/tools/notifyConfig";

@Component({
    selector: 'app-warranty-list',
    templateUrl: './warranty-list.component.html',
    styleUrls: ['./warranty-list.component.scss']
})
export class WarrantyListComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
    @Input() type: string;
    @Input() partId: string;
    @Input() assetId: string;
    @Input() modePage: ActionMode;
    totalPages = 0;
    loading: boolean;
    dateViewMode = DateViewMode;
    selectedItemForDelete = new DeleteModel();
    dataOfWarrantyList: GetAllWarranty[] = [];
    mode: ActionMode = ActionMode.ADD;
    actionMode = ActionMode;
    myMoment = Moment;
    id;
    openModal = false;
    variableToReadGetOn = 0;

    pageSize = 10;
    pageIndex = 0;
    length = -1;
    term: string;

    constructor(
        protected router: Router,
        protected activatedRoute: ActivatedRoute,
        public warrantyService: WarrantyService,
    ) {
        // this.partId = this.activatedRoute.snapshot.queryParams.entityId;
        // this.loading = true;

    }


    ngOnInit() {
    }


    changePage(event: any) {
        this.length = event.length;
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.getMyWarrantyList();

    }

    getMyWarrantyList() {
        this.loading = true;
        const paging = new Paging();
        paging.page = this.pageIndex;
        paging.size = this.pageSize;

        let partId = null;
        let assetId = null;
        if (this.type === 'part') {
            partId = this.activatedRoute.snapshot.queryParams.entityId;
        }
        if (this.type === 'asset') {
            assetId = this.activatedRoute.snapshot.queryParams.entityId;
        }
        if (partId || assetId) {
            this.warrantyService.getAllByPagination({
                paging,
                totalElements:-1,
                term: this.term,
                partId,
                assetId,
            }).pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<GetAllWarranty>) => {
                this.loading = false;
                if (res) {
                    this.dataOfWarrantyList = res.content;
                    this.length = res.totalElements;
                    this.totalPages = res.totalPages;
                }
            });
        }
    }


    chooseSelectedItemForEdit(item: GetAllWarranty) {
        this.variableToReadGetOn = this.variableToReadGetOn + 1;
        this.openModal = true;
        this.id = item.id;
        this.mode = this.actionMode.EDIT;
        setTimeout(() => {
            ModalUtil.showModal('warrantyModal');
        }, 50);
    }

    chooseSelectedItemForView(item: GetAllWarranty) {
        this.variableToReadGetOn = this.variableToReadGetOn + 1;
        this.openModal = true;
        this.id = item.id;
        this.mode = this.actionMode.VIEW;
        setTimeout(() => {
            ModalUtil.showModal('warrantyModal');
        }, 50);
    }

    showModalDelete(item: GetAllWarranty, i) {
        this.selectedItemForDelete.loading = false;

        this.selectedItemForDelete.id = item.id;
        this.selectedItemForDelete.title = ' آیا گارانتی    ' + item.warrantyCode + '#' + item.name + ' حذف  شود؟ ';
        this.selectedItemForDelete.index = i;
        setTimeout(e => {
            ModalUtil.showModal('modalId' + this.selectedItemForDelete.id);
        }, 10);
    }


    setService() {
        this.variableToReadGetOn = this.variableToReadGetOn + 1;
        this.openModal = true;
        this.mode = ActionMode.ADD;
        setTimeout(() => {
            ModalUtil.showModal('warrantyModal');
        }, 50);
    }

    receiveMessage(event: Warranty) {
        if (this.mode === ActionMode.EDIT) {
            const index = this.dataOfWarrantyList.findIndex(e => e.id === this.id);
            if (index !== -1) {
                this.eventMethod(event, index);
            }
        } else {
            this.eventMethod(event, -1);
        }
    }

    eventMethod(event: Warranty, index) {
        if (index !== -1) {
            this.dataOfWarrantyList[index].name = event.name;
            this.dataOfWarrantyList[index].expiry = event.expiry;
            this.dataOfWarrantyList[index].id = event.id;
            this.dataOfWarrantyList[index].time = event.time;
            this.dataOfWarrantyList[index].companyName = event.companyName;
            this.dataOfWarrantyList[index].warrantyCode = event.warrantyCode;
            this.dataOfWarrantyList[index].unitOfMeasurementName = event.unitOfMeasurementName;
            this.dataOfWarrantyList[index].kilometerWarranty = event.kilometerWarranty;
            this.dataOfWarrantyList[index].time = event.time;
            this.dataOfWarrantyList[index].expiry = event.expiry;
        } else {
            this.dataOfWarrantyList.push(event);
        }
    }

    deleteItem(event) {
        if (event) {
            this.selectedItemForDelete.loading = true;
            this.warrantyService.delete({warrantyId: this.selectedItemForDelete.id})
                .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {

                if (res !== true) {
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
                    DefaultNotify.notifyDanger(res, '', NotiConfig.notifyConfig);
                } else if (res === true) {
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);

                    this.dataOfWarrantyList = this.dataOfWarrantyList

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

    search() {
        this.pageIndex = 0;
        this.getMyWarrantyList();
    }

    ngOnDestroy(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.getMyWarrantyList();

    }


    ngAfterViewInit(): void {
    }

}








