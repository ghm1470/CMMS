import {Injectable} from '@angular/core';
import {ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient} from '@angular/common/http';
import {Paging} from '@angular-boot/util';
import {GetAllByFilterAndPagination} from '../../worktable/feature/list/worktable-list.component';
import {GetAllByFilterAndPaginationHistory} from '../../workTableHistory/feature/list/work-table-history-list.component';

@Injectable({
    providedIn: 'root'
})
export class CalenderService extends ServiceBase2 {

    constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig) {
        super();
        this._objectName = '';
        this.prefixMatches = this.getMatches(this._prefix);
    }

// گذشته
    getListForCalendar(dto: { startDate: any, endDate: any }) {
        const suffixPath = 'work-order/get-list/for-calendar';
        return super.postService(dto, {
            needToken: true,
            objectSuffix: this.replaceParams(suffixPath, {}),
            objectPrefix: this.getPrefix({}),

        });
    }

//آینده
    getListForCalendarSchedule(dto: { startDate: any, endDate: any }) {
        const suffixPath = 'workOrderSchedule/get-list/for-calendar';
        return super.postService(dto, {
            needToken: true,
            objectSuffix: this.replaceParams(suffixPath, {}),
            objectPrefix: this.getPrefix({}),

        });
    }

}
