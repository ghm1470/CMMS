import {Injectable} from '@angular/core';
import {ResponseContentType, ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient} from '@angular/common/http';
import {Paging} from '@angular-boot/util';

@Injectable({
    providedIn: 'root'
})
export class UnitOfMeasurementService extends ServiceBase2 {

    constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig
    ) {
        super();
        this._objectName = 'unit-of-measurement';
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

    update(item, query: { unitOfMeasurementId: string }) {
        const suffixPath = 'update';
        return super.putService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    checkIfUnitAndTitleExist(dto) {
        const suffixPath = 'check-if-unit-and-title-exist';
        return super.postService(dto, {
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

    getAllByPagination(query: { paging: Paging, totalElements: any }, dto) {
        const suffixPath = 'get-all-by-pagination';
        return super.postService(dto, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    delete(query: { unitOfMeasurementId: string }) {
        return super.deleteService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(null, {}),
            urlQueryObject: query,
            responseContentType: ResponseContentType.Text
        });
    }

    getOne(query: { unitOfMeasurementId: string }) {
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
