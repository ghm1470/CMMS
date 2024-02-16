import {Injectable} from '@angular/core';
import {ResponseContentType, ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient} from '@angular/common/http';
import {Paging} from '@angular-boot/util';
import {WorkRequestDto} from '../model/work-request-dto';

@Injectable({
    providedIn: 'root'
})
export class WorkRequestService extends ServiceBase2 {

    constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig
    ) {
        super();
        this._objectName = 'work-request';
        this.prefixMatches = this.getMatches(this._prefix);
    }

    createWorkRequest(item) {
        const suffixPath = 'save';
        return super.postService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }


    deleteWorkRequest(query: { workRequestId: string }) {
        const suffixPath = 'delete';
        return super.deleteService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query,
            responseContentType: ResponseContentType.Text
        });
    }

    getOneWorkRequest(query: { workRequestId: string }) {
        const suffixPath =
            'get-one';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getActivityIdListForThisAsset(query: { assetId: string }) {
        const suffixPath =
            'get-activities-of-asset';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getWorkRequestForm(query: { instanceId: string }) {
        const suffixPath =
            'get-work-requester-specification';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getRequesterUser(query: { requestId: string }) {
        const suffixPath =
            'get-requester-user';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getAllWorkRequest(item: WorkRequestDto.GetAllByFilter, query: { paging: Paging, totalElements: any, term?: string, userId: string }) {
        const suffixPath =
            'get-all';
        return super.postService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

// افرادی که در این درخواست تعمیر کار کردند
    getWorkRequestTechnician(query: { workRequestId: string }) {
        const suffixPath =
            'get-work-request-technician';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

// چک کردن تکراری بودن برگه PM
    checkPmSheetCode(query: { pmSheetCode: string }) {
        const suffixPath =
            'check-pm-sheet-code';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }


}
