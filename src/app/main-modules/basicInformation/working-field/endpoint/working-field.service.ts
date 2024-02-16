import {Injectable} from '@angular/core';
import {ResponseContentType, ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient} from '@angular/common/http';
import {Paging} from "@angular-boot/util";
import {workingField} from "../model/working-field-dto";

@Injectable({
    providedIn: 'root'
})
export class WorkingFieldService extends ServiceBase2 {

    constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig
    ) {
        super();
        this._objectName = 'workCategory';
        this.prefixMatches = this.getMatches(this._prefix);
    }

    create(item: workingField.Create) {
        const suffixPath = 'save';
        return super.postService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }

    getOne(query: { id: string }) {
        const suffixPath =
            'get-one';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    delete(query: { id: string }) {
        const suffixPath = 'delete';
        return super.deleteService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query,
            responseContentType: ResponseContentType.Text,
        });
    }


    update(item: workingField.Update) {
        const suffixPath = 'update';
        return super.putService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
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

    getPage(query: { term: string, paging: Paging, totalElements: any }) {
        const suffixPath = 'get-page';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query,

        });
    }
    checkUsed(query: { id: string }) {
        const suffixPath = 'check-used';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }
}
