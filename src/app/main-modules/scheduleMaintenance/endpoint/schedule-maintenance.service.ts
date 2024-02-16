import {Injectable} from '@angular/core';
import {ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient} from '@angular/common/http';
import {Paging} from '@angular-boot/util';
import {ScheduleMaintenanceDto} from '../model/dto/scheduleMaintenanceDto';
import TimeType = ScheduleMaintenanceDto.TimeType;
import {query} from '@angular/animations';

@Injectable({
    providedIn: 'root'
})
export class ScheduleMaintenanceService extends ServiceBase2 {

    constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig
    ) {
        super();
        this._objectName = 'schedule-maintenance';
        this.prefixMatches = this.getMatches(this._prefix);
    }

    create(item) {
        const suffixPath = 'save';
        return super.postService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }

    getActivityIdListForThisAsset(query: { assetId: string }) {
        const suffixPath = 'get-activity-of-schedule-maintenance-by-relevant-asset';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    update(item, query: { scheduleMaintenanceId: string }) {
        const suffixPath = 'update';
        return super.putService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getAll() {
        const suffixPath = 'get-all';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }

    getAllByFilterAndPagination(item: ScheduleMaintenanceDto.GetAllByFilterAndPagination,
                                query: { paging: Paging, totalElements: any }) {
        const suffixPath =
            'get-all-by-filter-and-pagination';
        return super.postService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    delete(query: { scheduleMaintenanceId: string }) {
        const suffixPath =
            'delete-create-schedule-maintenance';
        return super.deleteService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query,
        });
    }

    deleteScheduleMaintenanceMeteringScheduling(item, query: { scheduleMaintenanceId: string }) {
        const suffixPath =
            'delete-schedule-maintenance-metering-scheduling';
        return super.putService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    deleteScheduleMaintenanceTimeScheduling(item, query: { scheduleMaintenanceId: string }) {
        const suffixPath =
            'delete-schedule-maintenance-time-scheduling';
        return super.putService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getOne(query: { scheduleMaintenanceId: string }) {
        const suffixPath =
            'get-one';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    checkCodeExist(query: { code: string }) {
        const suffixPath =
            'check-if-code-is-unique';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getCompletionDetailByScheduleMaintenanceId(query: { scheduleMaintenanceId: string }) {
        const suffixPath =
            'get-completion-detail-by-schedule-maintenance-id';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getAllFutureDatesOfScheduleMaintenance(query: { scheduleMaintenanceId: string }) {
        const suffixPath =
            'get-all-future-dates-of-schedule-maintenance';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getAllFutureMeteringOfScheduleMaintenance(query: { per: number, startDistance: number, endDistance: number }) {
        const suffixPath =
            'get-all-future-metering-of-schedule-maintenance';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getListByProjectId(query: { projectId: string }) {
        const suffixPath =
            'get-schedule-maintenance-list-by-project-id';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getScheduleMeteringByScheduleMaintenanceId(query: { scheduleMaintenanceId: string }) {
        const suffixPath =
            'get-schedule-distance';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getScheduleWithTimeByScheduleMaintenanceId(query: { scheduleMaintenanceId: string }) {
        const suffixPath =
            'get-schedule-time';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getTaskGroupListByScheduleMaintenanceId(query: { scheduleMaintenanceId: string }) {
        const suffixPath =
            'get-task-group-list-by-schedule-maintenance-id';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }



    updateTaskGroupListByScheduleMaintenanceId(taskGroupList: any, query: { scheduleMaintenanceId: string }) {
        const suffixPath = 'update-task-group-list-by-schedule-maintenance-id';
        return super.putService(taskGroupList, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getBasicInformationByScheduleMaintenanceId(query: { scheduleMaintenanceId: string }) {
        const suffixPath =
            'get-basic-information-by-schedule-maintenance-id';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    updateScheduleMaintenanceBasicInformation(item, query: { scheduleMaintenanceId: string }) {
        const suffixPath = 'update-basic-information-by-schedule-maintenance-id';
        return super.putService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    updateScheduleTime(item, query: { scheduleMaintenanceId: string }) {
        const suffixPath = 'update-schedule-time';
        return super.putService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    updateScheduleMetering(item, query: { scheduleMaintenanceId: string }) {
        const suffixPath = 'update-schedule-distance';
        return super.putService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    updateScheduleMaintenanceCompletionDetail(item, query: { scheduleMaintenanceId: string }) {
        const suffixPath = 'update-completion-detail-by-schedule-maintenance-id';
        return super.putService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    updateScheduleMaintenanceNotify(notifyList: any, query: { scheduleMaintenanceId: string }) {
        const suffixPath = 'update-notify-list-by-schedule-maintenance-id';
        return super.putService(notifyList, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getAllForThisAsset(query: { assetId: string }) {
        const suffixPath = 'get-all-unit-of-measurement-of-the-asset';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }
}
