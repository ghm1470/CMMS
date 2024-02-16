import {Injectable} from '@angular/core';
import {ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient} from '@angular/common/http';
import {Paging} from '@angular-boot/util';
import {GetAllByFilterAndPagination} from '../../worktable/feature/list/worktable-list.component';
import {GetAllByFilterAndPaginationHistory} from '../../workTableHistory/feature/list/work-table-history-list.component';

@Injectable({
    providedIn: 'root'
})
export class ActivityService extends ServiceBase2 {

    constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig) {
        super();
        this._objectName = 'activity';
        this.prefixMatches = this.getMatches(this._prefix);
    }

    countPendingActivityOfTheUser(pId) {
        const suffixPath = 'count-pending-activity-of-the-user';
        return super.getService({
            needToken: true,
            objectSuffix: this.replaceParams(suffixPath, {}),
            objectPrefix: this.getPrefix({}),
            urlQueryObject: {userId: pId}
        });
    }

    getRequestListByPostId(pId) {
        const suffixPath = 'get-request-list-by-post-id';
        return super.getService({
            needToken: true,
            objectSuffix: this.replaceParams(suffixPath, {}),
            objectPrefix: this.getPrefix({}),
            urlQueryObject: {postId: pId}
        });
    }

    getActivitySampleFormAndFormData(query: { activitySampleId: string }) {
        const suffixPath = 'get-activity-sample-form-and-form-data';
        return super.getService({
            needToken: true,
            objectSuffix: this.replaceParams(suffixPath, {}),
            objectPrefix: this.getPrefix({}),
            urlQueryObject: query

        });
    }

    getAllActivity() {
        const suffixPath = 'get-all-activity';
        return super.getService({
            needToken: true,
            objectSuffix: this.replaceParams(suffixPath, {}),
            objectPrefix: this.getPrefix({}),
        });
    }

    checkIfActivityIsInProcess(query: { activityId: string }) {

        const suffixPath = 'check-if-activity-is-in-process';
        return super.getService({
            needToken: true,
            objectSuffix: this.replaceParams(suffixPath, {}),
            objectPrefix: this.getPrefix({}),
            urlQueryObject: query
        });
    }

    checkIfActivityExistsInAssetOrActivity(query: { activityId: string }) {
        const suffixPath = 'check-if-activity-exists-in-asset-or-activity';
        return super.getService({
            needToken: true,
            objectSuffix: this.replaceParams(suffixPath, {}),
            objectPrefix: this.getPrefix({}),
            urlQueryObject: query
        });
    }

    getStaticFormAndDynamicForm(query: { activityInstanceId: string }) {
        const suffixPath = 'get-pending-user-activity-details';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getAllLimit() {
        const suffixPath = 'get-all-limit';
        return super.getService({
            needToken: true,
            objectSuffix: this.replaceParams(suffixPath, {}),
            objectPrefix: this.getPrefix({}),
        });
    }

    create(activity: any) {
        return super.postService(activity, {needToken: true});
    }

    update(activity) {
        return super.putService(activity, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(null, {})
        });
    }

    delete(query: { activityId }) {
        const suffixPath = 'delete';
        return super.deleteService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query,
        });
    }

    // چک کردن اینکه کاربر دیگری این درخواست را انجام داده یا نه؟

    checkIfActivityLevelIsPending(query: { activityInstanceId: string, activityLevelId: string }) {
        const suffixPath = 'check-if-activity-level-is-pending';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query,
        });
    }

    // تعیین اینکه این درخواست مشاهده شد
    activitySampleSeen(query: { activityInstanceId: string, activityLevelId: string }) {
        const suffixPath = 'activity-sample-seen';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query,
        });
    }

    checkIfActivitySampleAssigned(query: { activityInstanceId: string }) {
        const suffixPath = 'check-if-activity-sample-assigned';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query,
        });
    }

    workOrderAcceptedByManager(
        query: {
            workOrderId: string,
            workRequestId: string,
            activityInstanceId: string,
            workOrderAccepted: boolean
        }) {
        const suffixPath = 'work-order-accepted-by-manager';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query,
        });
    }

    acceptGroupRequest(query: { activityInstanceId: string, userId: string }) {
        const suffixPath = 'accept-group-request';
        return super.getService({
            needToken: true,
            objectSuffix: this.replaceParams(suffixPath, {}),
            objectPrefix: this.getPrefix({}),
            urlQueryObject: query,
        });
    }

    editable(aId: string) {
        const suffixPath = 'editable';
        return super.getService({
            needToken: true,
            objectSuffix: this.replaceParams(suffixPath, {}),
            objectPrefix: this.getPrefix({}),
            urlQueryObject: {activityId: aId}
        });
    }

    establishment(establishmentProcessDto) {
        const suffixPath = 'establishment';
        return super.postService(establishmentProcessDto, {
            needToken: true,
            objectSuffix: this.replaceParams(suffixPath, {}),
            objectPrefix: this.getPrefix({})
        });
    }


    getOneActivity(query: { activityId: string }) {
        const suffixPath = 'get-one';
        return super.getService({
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

    getUserByUserTypeIdAndOrganizationId(query: { userTypeId: string, organizationId: string, }) {
        const suffixPath = 'get-user-by-user-type-id-and-organization-id';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getNextLevelUserIdAndUserTypeId(query: { activityInstanceId: string, nextActivityLevelId: string, }) {
        const suffixPath = 'get-next-level-user-and-userTypeId';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getUserNameOrganisationNameAndUserTypeName(query: { organisationId: string, userTypeId: string, userId: string[] }) {
        const suffixPath = 'get-user-name-organisation-name-and-user-type-name';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }


    getPendingAndActiveActivityLevelByInstanceId(query: { activityInstanceId: string }) {
        const suffixPath = 'get-pending-accepted-and-rejected-levels';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }


    getFormByActivityLevelIdAndInstanceId(query: { instanceId: string, activityLevelId: string }) {
        const suffixPath = 'get-form-by-activity-level-id-and-instance-id';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }


    getFormAndFormDataByActivityLevelIdAndInstanceId(query: { formDataId: string, formId: string }) {
        const suffixPath = 'get-form-and-form-data-of-the-activity-level';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

/////////////// کارتابل لیست  ///////////
    getActivityOfPendingUserPagination(body: GetAllByFilterAndPagination, query: { userId: string, paging: Paging, totalElements: any }) {
        const suffixPath = 'get-activity-of-pending-user-with-pagination';
        return super.postService(body, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

/////////////// کارتابل لیست  برای اکسل و پی دی اف  ///////////

    EmActivityGetPageForExcel(body: GetAllByFilterAndPagination, query: { userId: string }) {
        const suffixPath = 'em-activity-get-page-for-excel';
        return super.postService(body, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    ////////////// روند فرایند در مشاهده وضعیت درخواست/////////////
    getActivitySampleByInstanceId(query: { workRequestId: string }) {
        const suffixPath = 'get-activity-sample-by-instance-id';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    checkIfFormUsedInActivity(query: { formId: string }) {
        const suffixPath = 'check-if-form-used-in-activity';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

/////////////// تاریخچه///////////

    getAllAcceptedAndRejectedActivitiesOfUserWithPagination(body: GetAllByFilterAndPaginationHistory, query: {
        state: boolean,
        userId: string, paging: Paging, totalElements: any
    }) {
        const suffixPath = 'get-all-accepted-and-rejected-activities-of-user-with-pagination';
        return super.postService(body, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }


///// رد مرحله و دخیره فرم ////
    rejectForm(query: { instanceId: string, activityLevelId: string }, formData) {
        const suffixPath = 'when-user-pushes-the-reject-button';
        return super.postService(formData, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            // urlQueryObject: {companyId: cId}
            urlQueryObject: query
        });
    }

///// تایید مرحله بدون ثبت فرم ////
    whenUserPushesTheAcceptButtonInConstantForm(query: { activityLevelId: string, instanceId: string }) {
        const suffixPath = 'when-user-pushes-the-accept-button-in-constant-form';
        return super.postService(null, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            // urlQueryObject: {companyId: cId}
            urlQueryObject: query
        });
    }


///// رد مرحله بدون ثبت فرم ////
    whenUserPushesTheRejectButtonInConstantForm(query: { activityLevelId: string, instanceId: string, rejectionReason: string }) {
        const suffixPath = 'when-user-pushes-the-reject-button-in-constant-form';
        return super.postService(null, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            // urlQueryObject: {companyId: cId}
            urlQueryObject: query
        });
    }


///// تخصیص کاربر به مرحله بعد ////
    chooseNextActivityLevelUser(item) {
        const suffixPath = 'choose-next-activity-level-user';
        return super.postService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }


///// ذخیره فرم متغییر در مرحله ////
    saveFormDataAndPutInAssociatedActivityLevel(query: { activityInstanceId: string, activityLevelId: string }, formData) {
        const suffixPath = 'save-form-data-and-put-in-associated-activity-level';
        return super.postService(formData, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            // urlQueryObject: {companyId: cId}
            urlQueryObject: query
        });
    }

}
