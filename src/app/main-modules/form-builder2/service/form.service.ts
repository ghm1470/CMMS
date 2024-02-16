import {Injectable} from '@angular/core';
import {ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient} from '@angular/common/http';
import {Form} from '../model/form';
import {Paging} from '@angular-boot/util';

@Injectable({
    providedIn: 'root'
})
export class FormService extends ServiceBase2 {

    constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig) {
        super();
        this._objectName = 'newForm';
        this.prefixMatches = this.getMatches(this._prefix);
    }


    create(item: Form) {
        const suffixPath = 'save';
        return super.postService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }

    update(item: Form) {
        const suffixPath = 'update';
        return super.putService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
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

    getAllNewForm() {
        const suffixPath = 'get-all';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }

    getAllWithPagination(FormSearchInput, query: { paging: Paging, totalElements: any }) {
        const suffixPath = 'get-all-list-with-pagination';
        return super.postService(FormSearchInput, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    ifFormUsedInActivity(query: { formId: string }) {
        const suffixPath = 'if-form-used-in-activity';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    delete(query: { newFormId: string }) {
        const suffixPath = 'delete';
        return super.deleteService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }
}
