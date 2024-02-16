import {Injectable} from '@angular/core';
import {ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient} from '@angular/common/http';
import {Paging} from '@angular-boot/util';
import {WorkTableSchedule} from '../model/workTableSchedule';

@Injectable({
    providedIn: 'root'
})

export class WorkTableScheduleService extends ServiceBase2 {

    constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig
    ) {
        super();
        this._objectName = 'activity';
        this.prefixMatches = this.getMatches(this._prefix);
    }


    getPage(item: WorkTableSchedule.GetPageDto, query: { paging: Paging, totalElements: any, userId: string }) {
        const suffixPath = 'activity-schedule-get-page';
        return super.postService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    activityGetPageForExcel(item: WorkTableSchedule.GetPageDto, query: { userId: string }) {
        const suffixPath = 'activity-get-page-for-excel';
        return super.postService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    checkIfActivityLevelIsPending(query: { activityInstanceId: string, activityLevelId: number }) {
        const suffixPath = 'check-if-activity-level-is-pending';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    workOrderAcceptedByManager(query: {
        activityInstanceId: string,
        workRequestId: string,
        workOrderId: string,
        workOrderAccepted: boolean
    }) {
        const suffixPath = 'work-order-accepted-by-manager';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

// تایید
    whenUserPushesTheAcceptButtonInConstantForm(query: {
        activityLevelId: number, instanceId: string
    }) {
        const suffixPath = 'when-user-pushes-the-accept-button-in-constant-form';
        return super.postService(null, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

//رد
    whenUserPushesTheRejectButtonInConstantForm(query: {
        activityLevelId: number, instanceId: string
    }) {
        const suffixPath = 'when-user-pushes-the-reject-button-in-constant-form';
        return super.postService(null, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    // چک کردن اینکه زمانبندی در کارتابل قرار دارد یا نه برای ویرایش یا حذف
    checkIfScheduleIsInActivityProcess(query: { scheduleId: string }) {
        const suffixPath = 'check-if-schedule-is-in-activity-process';
        return super.getService( {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }


}
