import {Injectable} from '@angular/core';
import {ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient} from '@angular/common/http';
import {WorkTableSchedule} from '../model/workTableSchedule';
import {Paging} from '@angular-boot/util';
import {WorkOrderSchedule} from '../../work-order-schedule/model/workOrderSchedule';

@Injectable({
    providedIn: 'root'
})

export class WorkOrderScheduleService extends ServiceBase2 {

    constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig
    ) {
        super();
        this._objectName = 'work-order';
        this.prefixMatches = this.getMatches(this._prefix);
    }


    getOneScheduleWorkOrder(query: { workOrderId: string }) {
        const suffixPath = 'get-one-work-order-schedule';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getOne(query: { id: string }) {
        const suffixPath = 'get-one';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    updateScheduleWorkOrder(workOrderScheduleDTO: WorkTableSchedule.WorkOrderScheduleDTO) {
        const suffixPath = 'update-schedule-work-order';
        return super.putService(workOrderScheduleDTO, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }

    getPage(item: WorkOrderSchedule.GetPageDto, query: { paging: Paging, totalElements: any }) {
        const suffixPath = 'get-all-by-filter-and-pagination/by-schedule';
        return super.postService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }
    getAll(item: WorkOrderSchedule.GetPageDto) {
        const suffixPath = 'get-all/by-schedule';
        return super.postService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }
    update(item: WorkOrderSchedule.Update) {
        const suffixPath = 'schedule-update';
        return super.putService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }

}
