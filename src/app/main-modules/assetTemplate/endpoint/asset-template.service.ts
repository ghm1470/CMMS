import {Injectable} from '@angular/core';
import {ResponseContentType, ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient} from '@angular/common/http';
import {Paging} from '@angular-boot/util';
import {CategoryDto} from '../../category/model/dto/categoryDto';
import CategoryType = CategoryDto.CategoryType;

@Injectable({
    providedIn: 'root'
})

export class AssetTemplateService extends ServiceBase2 {

    constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig
    ) {
        super();
        this._objectName = 'asset-template';
        this.prefixMatches = this.getMatches(this._prefix);
    }

    create(item) {
        const suffixPath = 'save';
        return super.postService(item, {
            needToken: true,
            responseContentType: ResponseContentType.Text,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }

    checkIfAssetTemplateNameIsUnique(query: { name: string }) {
        const suffixPath = 'check-if-asset-template-name-is-unique';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    update(item, query: { assetTemplateId: string }) {
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
    getAllAssetTemplate(query: { categoryTypeValue: CategoryType }) {
        const suffixPath = 'get-all-for-asset';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }
    getAllByPagination(query: { paging: Paging, totalElements: any, term: string, subCategoryId, parentCategoryId }) {
        const suffixPath = 'get-all-by-pagination';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getAllAssetByPagination(query: { paging: Paging, totalElements: any, term: string }) {
        const suffixPath = 'get-all-asset-templates-with-pagination';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    delete(query: { assetTemplateId: string }) {
        return super.deleteService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(null, {}),
            urlQueryObject: query,
        });
    }


    checkIfAssetTemplateUsedInAsset(query: { assetTemplateId: string }) {
        const suffixPath = 'check-if-asset-template-used-in-asset';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    } getOne(query: { assetTemplateId: string }) {
        const suffixPath =
            'get-one';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getCategoryTypeByAssetTemplateId(query: { assetTemplateId: string }) {
        const suffixPath =
            'get-category-type-by-asset-template-id';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    addPersonTypePersonnel(assignedToPersonList: AssignedToPerson[], query: { assetTemplateId: string }) {
        const suffixPath =
            'add-person-type-personnel-of-asset-template';
        return super.putService(assignedToPersonList, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getPersonnelOfAssetTemplate(query: { assetTemplateId: string }) {
        const suffixPath =
            'get-personnel-of-asset-template';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getGroupPersonnelOfAssetTemplate(query: { assetTemplateId: string }) {
        const suffixPath =
            'get-group-personnel-of-project';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    // واسه اد تخصیص به گروه
    // برگشتی بولین
    addGroupPersonnelToAssetTemplate(assignedToGroupList: AssignedToGroup[], query: { assetTemplateId: string }) {
        const suffixPath =
            'add-group-personnel-to-asset-template';
        return super.putService(assignedToGroupList, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getPropertyOfAssetTemplate(query: { assetTemplateId: string }) {
        const suffixPath = 'get-property-of-asset-template';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query

        });
    }

    updateAssetTemplateProperties(query: { assetTemplateId: string }, properties) {
        const suffixPath = 'update-asset-template-properties';
        return super.putService(properties, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query

        });
    }
}

export class AssetTemplatePersonnelDTO {
    userId: string;
    userName: string;
    userFamily: string;
    userTypeId: string;
    userTypeName: string;
}

export class AssignedToPerson {
    userId: string;
    userTypeId: string;
}

export class AssignedToGroup {
    userTypeId: string;
    userTypeName: string;
}
