import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-paginator',
    templateUrl: './paginator.component.html',
    styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {
    @Input('totalElements') totalElements: number;
    @Input('pageSize') pageSize: number;
    @Input('pageIndex') pageIndex: number;
    @Input('pageSizeOptions') pageSizeOptions: number[];
    @Input('showFirstLastButtons') showFirstLastButtons: boolean;
    @Output('page') private page = new EventEmitter<any>();


    constructor() {
    }

    ngOnInit() {
        this.pageSizeOptions = [1, 2, 5, 10, 15, 20]
    }

    changePage(event) {
        this.page.emit(event);
    }
}
