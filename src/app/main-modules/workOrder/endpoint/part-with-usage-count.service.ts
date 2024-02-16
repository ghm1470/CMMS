import {Injectable} from '@angular/core';
import {ResponseContentType, ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient} from '@angular/common/http';
import {Paging} from '@angular-boot/util';

@Injectable({
    providedIn: 'root'
})
export class PartWithUsageCountService extends ServiceBase2 {

    constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig) {
        super();
        this._objectName = 'part-with-usage-count';
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

    update(item, query: { partWithUsageCountId: string }) {
        const suffixPath = 'update';
        return super.putService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query,
            responseContentType: ResponseContentType.Text
        });
    }

    getPartWithUsageCountListByReferenceId(query: { referenceId: string }) {
        const suffixPath = 'get-part-with-usage-count-list-by-reference-id';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }
    getPartWithUsageCountOfWorkOrder(query: { workOrderId: string }) {
        const suffixPath =
            'get-part-with-usage-count-of-work-order';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    checkExistInventoryCodeInWorkOrder(query: { partId: string }) {
        const suffixPath =
            'check-if-inventory-exist-in-work-order';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getAllByPagination(query: { paging: Paging, totalElements: any, term: string }) {
        const suffixPath = 'get-all-by-pagination';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    delete(query: { partWithUsageCountId: string, scheduleMaintenanceId: string }) {
        // @DeleteMapping("part-with-usage-count/delete-schedule-used-part")
        // public ResponseEntity<?> deleteScheduleUsedPart(@PathParam("partWithUsageCountId")
        //   String partWithUsageCountId, @PathParam("scheduleMaintenanceId") String scheduleMaintenanceId) {
        //
        //   }
        const suffixPath = 'delete-schedule-used-part';

        return super.deleteService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query,
        });
    }

    getOne(query: { referenceId: string }) {
        const suffixPath =
            'get-one';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }
}
