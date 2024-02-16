import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ActionMode, DefaultNotify, ListHelper, ModalSize, PageContainer, Paging} from '@angular-boot/util';
import {BaseListComponentSeven, ListComponentData, ListQueryParam} from '@angular-boot/common';
import {PartDto} from '../../../part/model/dto/part';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular-boot/core';
import {ModalUtil} from '@angular-boot/widgets';
import {PartService} from '../../../part/endpoint/part.service';

declare var $: any;

@Component({
    selector: 'app-current-inventory-view',
    templateUrl: './current-inventory-view.component.html',
    styleUrls: ['./current-inventory-view.component.scss']
})
export class CurrentInventoryViewComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() listOnCallback: () => any;
    totalElements = 0;
    @Output() messageEvent = new EventEmitter<PartDto.Create>();
    MyModalSize = ModalSize;
    partsList: any[] = [];
    parts = new PartDto.Create();
    @Input() modalId;

    constructor(public partService: PartService,
                public activatedRoute: ActivatedRoute,
                public router: Router) {
    }


    ngOnInit() {
        this.getListSelf();
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

    search() {
        this.pageIndex = 0;
        this.getListSelf();

    }

    getListSelf(options?: any) {
        const paging = new Paging();
        paging.page = this.pageIndex;
        paging.size = this.pageSize;
        this.partService.getAllPartByPagination({
            paging,
            totalElements:-1,
            term: this.term
        }).pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<PartDto.Create>) => {
            this.length = res.totalElements;
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < res.content.length; i++) {
                res.content[i].selected = false;
            }
            this.partsList = res.content;
        });
        // ===========================================================================
    }

    // chooseSelectedItemForEdit(item: PartDto.Create) {
    //   this.router.navigate(['action'], {
    //     queryParams: {mode: ActionMode.EDIT, inventoryId: item.id},
    //     relativeTo: this.activatedRoute
    //   });
    // }

    // chooseSelectedItemForView(item: PartDto.Create) {
    //   this.router.navigate([item.id, ActionMode.VIEW], {
    //     relativeTo: this.activatedRoute
    //   });
    // }

    // deleteItem(item: PartDto.Create) {
    //   // if (confirm('از حذف این '))
    //   this.partService.delete({partId: item.id})
    //     .pipe(takeUntilDestroyed(this)).subscribe((res) => {
    //     if (res === true) {
    //       this.partsList = this.partsList
    //         .filter((e) => {
    //           return e.id !== item.id;
    //         });
    //       this.processPage();
    //     }
    //   });
    // }


    ngOnDestroy(): void {
    }


    cancelModal() {
        ModalUtil.hideModal(this.modalId);
    }


    sendMassage(event, part, index) {
        if (event === true) {
            for (let i = 0; i < this.partsList.length; i++) {
                if (i !== index) {
                    this.partsList[i].selected = false;
                } else if (i === index) {
                    this.partsList[index].selected = true;
                }
            }
            this.parts = part;
            this.messageEvent.emit(this.parts);
            this.cancelModal();
        } else if (event === false) {
            this.partsList[index].selected = false;

            this.parts = new PartDto.Create();
            this.messageEvent.emit(this.parts);
        }

    }

    changeChecked(part, i) {
        if (this.partsList[i].selected === true) {
            return true;

        } else {
            return false;

        }
    }

    ngAfterViewInit(): void {
        ModalUtil.showModal('adjustmentInventory');
    }
}

