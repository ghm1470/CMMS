import {Injectable} from '@angular/core';
import {ResponseContentType, ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class DocumentService extends ServiceBase2 {

    constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig) {
        super();
        this._objectName = 'document';
        this.prefixMatches = this.getMatches(this._prefix);
    }

    getAll(query: { extraId: string }) {
        const suffixPath = 'get-all-by-extra-id';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }


    getAllDocumentsOfWorkOrderByExtraId(query: { extraId: string }) {
        const suffixPath = 'get-all-documents-of-work-order-by-extra-id';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    deleteDocument(query: { documentId: string }) {
        return super.deleteService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(null, {}),
            urlQueryObject: query,
        });
    }

    deleteSchedule(query: { documentId: string, scheduleMaintenanceId: string }) {
        const suffixPath = 'delete-schedule';

        return super.deleteService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query,
        });
    }


}
