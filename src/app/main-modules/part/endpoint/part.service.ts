import {Injectable} from '@angular/core';
import {ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient} from '@angular/common/http';
import {Paging} from '@angular-boot/util';
import {PartDtoForSearch} from '../feature/list/part-list.component';

@Injectable({
    providedIn: 'root'
})

export class PartService extends ServiceBase2 {

    constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig
    ) {
        super();
        this._objectName = 'part';
        this.prefixMatches = this.getMatches(this._prefix);
    }

    create(item) {
        const suffixPath = 'save';
        return super.postService(item, {
            needToken: true,
            // responseContentType: ResponseContentType.Json,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }

    createInventory(item, query: { partId: string }) {
        const suffixPath = 'save-inventory';
        return super.postService(item, {
            needToken: true,
            // responseContentType: ResponseContentType.Json,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getAllByPaginationInventory(query: { paging: Paging, totalElements: any, term: string }) {
        const suffixPath = 'get-all-by-pagination';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getAllPaginationWithUserIdForAssignedPart(filter, query: { paging: Paging, totalElements: any }) {
        const suffixPath = 'get-all-assigned-parts-of-user-by-user-id';
        return super.postService(filter, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    // @PostMapping("get-all-assigned-parts-of-group")
    // public ResponseEntity<?> getAllAssignedPartsOfGroup(@RequestBody PartDtoForSearch partDtoForSearch, Pageable pageable, Integer totalElement) {

// }
    getAllAssignedPartsOfGroup(filter, query: { paging: Paging, totalElements: any }) {
        const suffixPath = 'get-all-assigned-parts-of-group';
        return super.postService(filter, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }


    checkPartCode(query: { partCode: string }) {
        const suffixPath =
            'check-part-code';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
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

    delete(query: { partId: string }) {
        const suffixPath = 'delete-part';
        return super.deleteService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query,
        });
    }


    deleteInvevtory(query: { inventoryId: string }) {
        const suffixPath = 'delete-inventory';
        return super.deleteService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query,
        });
    }

    update(item, query: { partId: string }) {
        const suffixPath = 'update-up-side';
        return super.putService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    updateInventory(item, query: { partId: string }) {
        const suffixPath = 'update-down-side';
        return super.putService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    updateDocumentList(item, query: { partId: string }) {
        const suffixPath = 'update-document-list-by-part-id';
        return super.putService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    updateAssetUserList(item, query: { partId: string }) {
        const suffixPath = 'update-user-list-by-part-id';
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

    getAllPartByPagination(query: { paging: Paging, totalElements: any, term?: string }) {
        const suffixPath = 'get-all-by-pagination';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getAllPSB() {
        const suffixPath = 'get-all-parts';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }


    getAllPartsWithOutInventoryAndLoadedInventories(item: PartDtoForSearch, query: { paging: Paging, totalElements: any }) {
        const suffixPath =
            'get-all-parts-with-out-inventory-and-loaded-storage';
        return super.postService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getAllForExcel(item: PartDtoForSearch) {
        const suffixPath =
            'get-all-for-excel';
        return super.postService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }


    // getUserListWithRelevantUserType(query: {partId: string}) {
    //   const suffixPath = 'get-all-users-with-relevant-user-type';
    //   return super.getService( {
    //     needToken: true,
    //     objectPrefix: this.getPrefix({}),
    //     objectSuffix: this.replaceParams(suffixPath, {}),
    //     urlQueryObject: query
    //   });
    // }

    // getUserListByPartId(query: { partId: string }) {
    //   const suffixPath = 'get-user-list-by-part-id';
    //   return super.getService({
    //     needToken: true,
    //     objectPrefix: this.getPrefix({}),
    //     objectSuffix: this.replaceParams(suffixPath, {}),
    //     urlQueryObject: query
    //   });
    // }

    // =============================================================================
    getPersonPersonnelOfPart(query: { partId: string }) {
        const suffixPath = 'get-person-personnel-of-part';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getGroupPersonnelOfPart(query: { partId: string }) {
        const suffixPath =
            'get-group-personnel-of-part';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    updateGroupTypePersonnel(AssignedToGroupList: any, query: { partId: string }) {
        const suffixPath = 'add-group-type-personnel';
        return super.putService(AssignedToGroupList, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    updatePersonTypePersonnel(AssignedToPersonList: any, query: { partId: string }) {
        const suffixPath = 'add-person-type-personnel';
        return super.putService(AssignedToPersonList, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    // ===============================================================================

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


    getOne(query: { partId: string }) {
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
    getOneManufacturer(query: { partId: string }) {
        const suffixPath = 'get-one-manufacturer';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    // فروشنده و سازنده
    updateManufacturer(dto, query: { partId: string }) {
        const suffixPath = 'update-manufacturer';
        return super.putService(dto, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });


    }

}
