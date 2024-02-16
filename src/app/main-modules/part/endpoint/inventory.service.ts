import {Injectable} from '@angular/core';
import {ResponseContentType, ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient} from '@angular/common/http';
import {Paging} from '@angular-boot/util';

@Injectable({
    providedIn: 'root'
})
export class InventoryService extends ServiceBase2 {

    constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig
    ) {
        super();
        this._objectName = 'inventory';
        this.prefixMatches = this.getMatches(this._prefix);
    }


    createInventory(item) {
        const suffixPath = 'save';
        return super.postService(item, {
            needToken: true,
            // responseContentType: ResponseContentType.Json,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),

        });
    }

//   اگر true
//   موقعیت مکانی با این مشخصات در انبار موجود میباشد
    checkInventoryLocation(locationDTO) {
        const suffixPath = 'check-inventory-location';
        return super.postService(locationDTO, {
            needToken: true,
            // responseContentType: ResponseContentType.Json,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),

        });
    }

    getAllPartByParentId(query: { storageId: string }) {
        const suffixPath = 'get-all-inventory-of-storage-by-storageId';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getAllStorageByParentId(query: { assetId: string }) {
        const suffixPath = 'get-all-storage-of-asset-by-assetId';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    createInventoryList(item) {
        const suffixPath = 'post-list-of-inventory';
        return super.postService(item, {
            needToken: true,
            responseContentType: ResponseContentType.Text,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),

        });
    }

    search(query: { paging: Paging, totalElements: any, partName?: string, partCode?: string }) {
        const suffixPath = 'get-inventory-by-part-name-and-part-code';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getAllByPaginationInventory(query: { paging: Paging, totalElements: any, term?: string, partId: string }) {
        const suffixPath = 'get-all-by-pagination';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    checkDeletePart(query: { partId: string }) {
        const suffixPath =
            'check-if-part-has-inventory';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getAllCurrentInventory(item, query: { paging: Paging, totalElements: any }) {
        const suffixPath = 'get-inventory-by-part-name-and-part-code';
        return super.postService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getInventoryByPartNameAndInventoryLocationTitle(item, query: {
        paging: Paging, totalElements: any, term?: string
    }) {
        const suffixPath =
            'get-inventory-by-part-name-and-part-code';
        return super.postService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }


    getAllInventoryForExcel(item) {
        const suffixPath =
            'get-all-inventory-for-excel';
        return super.postService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }

    checkInventoryCode(query: { inventoryCode: string }) {
        const suffixPath =
            'check-inventory-code';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    checkLocation(item) {
        const suffixPath =
            'check-inventory-location';
        return super.putService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),

        });
    }


    deleteInventory(query: { inventoryId: string }) {
        const suffixPath = 'delete-inventory';
        return super.deleteService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    delete(query: { inventoryId: string }) {
        const suffixPath =
            'delete-inventory';
        return super.deleteService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query,
        });
    }

    updateInventory(item, query: { inventoryId: string }) {
        const suffixPath = 'update-inventory';
        return super.putService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getPage(query: { paging: Paging, totalElements: any, term?: string }) {
        const suffixPath =
            'get-page';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getAllUsersWhoHaveChangedInventory(item: any, query: { paging: Paging, totalElements: any }) {
        const suffixPath = 'get-all-users-who-have-changed-inventory';
        return super.postService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getList(query: { term, limit }) {
        const suffixPath =
            'get-list';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getAllPrivate() {
        const suffixPath =
            'get-all-private';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }

    getOne(query: { inventoryId: string }) {
        const suffixPath =
            'get-one';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }


    getOnePrivate(query: { partId: string }) {
        const suffixPath =
            'get-one-private';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }


}
