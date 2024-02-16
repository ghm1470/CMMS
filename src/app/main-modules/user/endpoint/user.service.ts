import {Injectable} from '@angular/core';
import {ResponseContentType, ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient} from '@angular/common/http';
import {Paging} from '@angular-boot/util';
import {UserDto} from '../model/dto/user-dto';

@Injectable({
    providedIn: 'root'
})

export class UserService extends ServiceBase2 {

    constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig
    ) {
        super();
        this._objectName = 'user';
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

    createMainInformation(item) {
        const suffixPath = 'save-main-information';
        return super.postService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            responseContentType: ResponseContentType.Text
        });
    }

    delete(query: { userId: string }) {
        const suffixPath = 'delete';
        return super.deleteService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query,
        });
    }

    update(item, query: { userId: string }) {
        const suffixPath = 'update';
        return super.putService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }


    updateMainInformation(item, query: { userId: string }) {
        const suffixPath = 'update-main-information';
        return super.putService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    updateSecondaryInformationOfUser(item, query: { id: string }) {
        const suffixPath = 'update-secondary-information-of-user';
        return super.putService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    //////////  آپدیت childUser با id کاربر
    updateChildUsersForReportTo(item) {
        const suffixPath = 'update-child-users-for-report-to';
        return super.putService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            // requestContentType: RequestContentType.TEXT,
            // urlQueryObject: query
        });
    }

    // @GetMapping("get-user-report-to")
    // public ResponseEntity<?> getUserReportTo(@PathParam("userId") String userId) {
// }
    getUserReportTo(query: { userId: string }) {
        const suffixPath =
            'get-user-report-to';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query,
            responseContentType: ResponseContentType.Text
        });
    }

    getUserWithUserType() {
        const suffixPath = 'get-user-with-userType';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
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

    getPageByTermByPaging(query: { paging: Paging, totalElements: any, term?: any }) {
        const suffixPath =
            'get-all-users-by-term-and-pagination';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }


    getAllUsersExceptOne(query: { userId: string }) {
        const suffixPath =
            'get-all-users-except-one';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getAllByFilterAndPagination(item: UserDto.GetAllByFilter,
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

    //////////// دریافت childUser با id کاربر
    getUsersByUserIdList(item) {
        const suffixPath =
            'get-users-by-user-id-list';
        return super.postService(item, {
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

    getAllTow() {
        const suffixPath = 'get-all-users-with-relevant-user-type';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }

    getAllUserWithRelevantUserTypePagination(query: { page: number, size: number, term?: string }) {
        const suffixPath = 'get-all-users-with-relevant-user-type-Pagination';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    // @GetMapping("get-all-users-of-user-type")
    // public ResponseEntity<?> getAllUsersOfAUserType(@PathParam("userTypeId") String userTypeId, Pageable pageable, Integer totalElement ){
// }

    getAllUsersOfUserType(query: { paging: Paging, totalElements: any, userTypeId: any }) {
        const suffixPath =
            'get-all-users-of-user-type';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }


    //// خواندن کاربران بر اساس لیست پست ها
    getAllUsersOfUserTypeList(userTypeIdListDTO: string[]) {
        const suffixPath = 'get-all-users-of-user-type-list';
        return super.postService(userTypeIdListDTO, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }


    getAllUserForAssignedWorkOrder(query: { userId: string }) {
        const suffixPath = 'get-user-children-by-user-id';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getAllSubUsersOfUserByUserId(query: { userId: string }) {
        const suffixPath = 'get-all-sub-users-of-user-by-user-id';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getOne(query: { userId: string }) {
        const suffixPath =
            'get-one';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getOneMainInformation(query: { userId: string }) {
        const suffixPath =
            'get-main-information';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getOneSecondaryInformationOfUser(query: { userId: string }) {
        const suffixPath =
            'get-secondary-information-of-user';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    ////// دریافت اطلاعات قسمت گزارش به..
    getAllChildUsersIdOfUserByUserId(query: { userId: string }) {
        const suffixPath =
            'get-all-children-users-id-by-user-id';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    checkNationalCode(nationalCode) {
        const suffixPath =
            'check-national-code';
        return super.postService(nationalCode, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            // urlQueryObject: query
        });
    }

    checkNationalCodeForUpdate(query: { code: string, userId: string }) {
        const suffixPath =
            'check-if-national-code-exist-for-update';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    checkIfUsernameIsRepetitive(query: { username: string }) {
        const suffixPath =
            'check-if-user-name-is-repetitive';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query,
            responseContentType: ResponseContentType.Text
        });
    }

// =================================دریافت userTypeList و org بااستفاده از userId=========================
    getAllUserTypeAndOrgForUser(query: { userId: string }) {
        const suffixPath =
            'get-org-and-user-type-list-by-user-id';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getOrganizationsByAUserId(query: { userId: string }) {
        const suffixPath =
            'get-organizations-by-user-id';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }
}
