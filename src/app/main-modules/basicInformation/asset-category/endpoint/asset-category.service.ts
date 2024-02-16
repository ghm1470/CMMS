import {Injectable} from '@angular/core';
import {ServiceBase2, ServiceConfig} from '@angular-boot/core';

import {Paging} from '@angular-boot/util';
import {HttpClient} from '@angular/common/http';
import {CategoryDto} from '../../../category/model/dto/categoryDto';
import CategoryType = CategoryDto.CategoryType;
import {AssetCategoryDto} from '../model/asset-category-dto';


@Injectable({
    providedIn: 'root'
})
export class AssetCategoryService extends ServiceBase2 {

    constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig
    ) {
        super();
        this._objectName = 'category';
        this.prefixMatches = this.getMatches(this._prefix);
    }

    create(item: AssetCategoryDto.Create) {
        const suffixPath = 'new-save';
        return super.postService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }

    getOne(query: { categoryId: string }) {
        const suffixPath =
            'new-get-one';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getAllByPagination(query: { paging: Paging, totalElements: any }, dto: AssetCategoryDto.NewCategoryForGetAllByPagination) {
        const suffixPath = 'get-all-new-category-with-pagination';
        return super.postService(dto, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    update(item: AssetCategoryDto.Update) {
        const suffixPath = 'new-update';
        return super.putService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }

    delete(query: { categoryId: string }) {
        const suffixPath = 'new-delete';

        return super.deleteService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query,
        });
    }


    checkIfCategoryUsedInAsset(query: { categoryId: string }) {
        const suffixPath = 'check-if-category-used-in-asset';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getAll() {
        const suffixPath = 'new-category-get-all';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }
}







