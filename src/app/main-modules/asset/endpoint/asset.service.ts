import {Injectable} from '@angular/core';
import {ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient} from '@angular/common/http';
import {Paging} from '@angular-boot/util';
import {AssetDto} from '../model/dto/assetDto';
import {PartDto} from '../../part/model/dto/part';
import {CategoryDto} from '../../category/model/dto/categoryDto';
import CategoryType = CategoryDto.CategoryType;
import {GetAllByFilterAndPagination} from '../feature/tree-list/tree-list.component';

@Injectable({
    providedIn: 'root'
})

export class AssetService extends ServiceBase2 {

    constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig) {
        super();
        this._objectName = 'asset';
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

    updateAssetBasicInformation(item, query: { assetId: string }) {
        const suffixPath = 'update/basic-information';
        return super.putService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    update(item, query: { assetId: string }) {
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
    /// خواندن داریی های که از نوع ساختمان هستند
    getAllRootBuildings() {
        const suffixPath = 'get-all-root-buildings';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }

    getListActivityByAssetId(query: { assetId: string }) {
        const suffixPath = 'get-list-activity-by-assetId';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query

        });
    }

    getAllRoots() {
        const suffixPath = 'get-all-roots';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }

    getAllFacility() {
        const suffixPath = 'getAll-facility';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }

    getOnlineAssets() {
        const suffixPath = 'get-online-assets';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }

    getOfflineAssets() {
        const suffixPath = 'get-offline-assets';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }

    getAssetListByCategoryType(query: { categoryType: CategoryType }) {
        const suffixPath = 'get-asset-list-by-category-type';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getAllAssetWithoutParentId(query: { paging: Paging, totalElements: any, categoryType: string }) {
        const suffixPath = 'get-all-independent-assets';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getAllAssetWithoutParentIdForTAndF() {
        const suffixPath = 'get-all-roots-of-building-and-facility';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }

    getAllAssetWithoutParentIdForB(query: { categoryType: string }) {
        const suffixPath = 'get-assets-by-category-type';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getAllAssetByParentId(query: { parentId: string }) {
        const suffixPath = 'get-all-children-of-asset';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getAllPaginationWithUserIdForAssignedAsset(
        item: GetAllByFilterAndPagination,
        query: { paging: Paging, totalElements: any, userId: string }) {
        const suffixPath = 'get-all-assigned-assets-of-user-by-user-id';
        return super.postService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getAllAssignedAssetsOfGroup(
        item: GetAllByFilterAndPagination,
        query: { paging: Paging, totalElements: any }) {
        const suffixPath = 'get-all-assigned-assets-of-group';
        return super.postService(item, {
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

    getAllAssetByTerm(query: { paging: Paging, totalElements: any, term: string }) {
        const suffixPath = 'get-all-asset-by-term';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }


    getAllByFilterAndPagination(item: GetAllByFilterAndPagination,
                                query: { paging: Paging, totalElements: any }) {
        const suffixPath =
            'get-all-by-filter-and-pagination';
        return super.postService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    delete(query: { assetId: string }) {
        const suffixPath =
            'delete-child-and-parent-assets';
        return super.deleteService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query,
        });
    }

    getUnitListOfAsset(query: { assetId }) {
        const suffixPath = 'get-unit-list-of-asset';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getOne(query: { assetId: string }) {

        const suffixPath =
            'get-one';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getOneTow(query: { assetId: string }) {
        const suffixPath =
            'get-one-asset-with-parent-info';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getAllParent(query: { assetId: string }) {
        const suffixPath =
            'get-parents-of-asset';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getBasicInformationByAssetId(query: { assetId: string }) {
        const suffixPath =
            'get-basic-information-by-asset-id';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getPartsByAssetId(query: { assetId: string }) {
        const suffixPath =
            'get-part-list-by-asset-id';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getCompanyListByAssetId(query: { assetId: string }) {
        const suffixPath =
            'get-company-list-by-asset-id';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getDocumentListByAssetId(query: { assetId: string }) {
        const suffixPath =
            'get-document-list-by-asset-id';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getPropertyListByAssetId(query: { assetId: string }) {
        const suffixPath =
            'get-property-list-by-asset-id';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

// ================================================================
    getPersonPersonnelOfAsset(query: { assetId: string }) {
        const suffixPath = 'get-person-personnel-of-asset';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getGroupPersonnelOfAsset(query: { assetId: string }) {
        const suffixPath =
            'get-group-personnel-of-asset';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }


    // =============================================================================

    getWarrantyListByAssetId(query: { assetId: string }) {
        const suffixPath =
            'get-warranty-list-by-asset-id';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getMeteringListByAssetId(query: { assetId: string }) {
        const suffixPath =
            'get-metering-list-by-asset-id';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getAssetTemplatePropertyListByAssetId(query: { assetId: string }) {
        const suffixPath =
            'get-asset-template-property-list-by-asset-id';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getAssetTemplateUserListByAssetId(query: { assetId: string }) {
        const suffixPath =
            'get-asset-template-User-list-by-asset-id';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    updateAssetParts(parts: PartDto.Create[], query: { assetId: string }) {
        const suffixPath = 'update-part-list-by-asset-id';
        return super.putService(parts, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    updateAssetCompanyList(parts: any, query: { assetId: string }) {
        const suffixPath = 'update-company-list-by-asset-id';
        return super.putService(parts, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    updateAssetDocumentList(parts: any, query: { assetId: string }) {
        const suffixPath = 'update-document-list-by-asset-id';
        return super.putService(parts, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    updateAssetPropertyList(propertyList: any, query: { assetId: string }) {
        const suffixPath = 'update-property-list-by-asset-id';
        return super.putService(propertyList, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    updateGroupTypePersonnel(AssignedToGroupList: any, query: { assetId: string }) {
        const suffixPath = 'add-group-type-personnel';
        return super.putService(AssignedToGroupList, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    updatePersonTypePersonnel(AssignedToPersonList: any, query: { assetId: string }) {
        const suffixPath = 'add-person-type-personnel';
        return super.putService(AssignedToPersonList, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    updateAssetWarrantyList(parts: any, query: { assetId: string }) {
        const suffixPath = 'update-warranty-list-by-asset-id';
        return super.putService(parts, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    updateAssetMeteringList(parts: any, query: { assetId: string }) {
        const suffixPath = 'update-metering-list-by-asset-id';
        return super.putService(parts, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    checkAssetCode(query: { assetCode: string }) {
        const suffixPath =
            'check-asset-code';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }


    /// countAssetsInDashboard //////////
    getOneCountAssets(suffixPath, query: { userAssignedId: string, month: string }) {
        // tslint:disable-next-line:prefer-const
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

/// منابع مصرفی
    updateConsumedResources(dto, query: { assetId: string }) {
        const suffixPath = 'update-consumed-resources';
        return super.putService(dto, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });


    }

    getOneConsumedResources(query: { assetId: string }) {
        const suffixPath = 'get-one-consumed-resources';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

/// اطلاعات فنی
    updateTechnicalInformation(dto) {
        const suffixPath = 'update-technical-Information';
        return super.putService(dto, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });


    }

    getOneTechnicalInformation(query: { assetId: string }) {
        const suffixPath = 'get-one-technical-information';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    // فروشنده و سازنده
    updateManufacturer(dto, query: { assetId: string }) {
        const suffixPath = 'update-manufacturer';
        return super.putService(dto, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });


    }

    getOneManufacturer(query: { assetId: string }) {
        const suffixPath = 'get-one-manufacturer';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }


    // قطعات یدکی

    updateSpareParts(dto, query: { assetId: string }) {
        const suffixPath = 'update-spare-parts';
        return super.putService(dto, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }


    getOneSpareParts(query: { assetId: string }) {
        const suffixPath = 'get-one-spare-parts';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

//// روانکار ها
    getOneLubricant(query: { assetId: string }) {
        const suffixPath = 'get-one-lubricant';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }


    updateLubricant(dto, query: { assetId: string }) {
        const suffixPath = 'update-lubricant';
        return super.putService(dto, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    // گارانتی
    // @PatchMapping("update-guaranty")
    // public ResponseEntity<?> updateGuaranty(@RequestBody Asset asset) {
// }
    updateGuaranty(dto) {
        const suffixPath = 'update-guaranty';
        return super.putService(dto, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });

    }

///// خواندن برای excel
    getAllForExcel(dto: GetAllByFilterAndPagination) {
        const suffixPath = 'get-all-for-excel';
        return super.postService(dto, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }
}
