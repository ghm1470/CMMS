import {Injectable} from '@angular/core';
import {ResponseContentType, ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient} from '@angular/common/http';
import {Paging} from '@angular-boot/util';
import {WorkOrderDto} from '../model/dto/workOrderDto';

@Injectable({
    providedIn: 'root'
})

export class WorkOrderService extends ServiceBase2 {

    constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig
    ) {
        super();
        this._objectName = 'work-order';
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

    update(item, query: { workOrderId: string }) {
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

    checkIfWorkOrderIsInProcess(query: { workOrderId: string }) {
        const suffixPath = 'check-if-work-order-is-in-process';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getAllByFilterAndPagination(item: WorkOrderDto.GetAllByFilterAndPagination,
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

    getTaskGroupOfWorkOrder(query: { workOrderId: string }) {
        const suffixPath =
            'get-task-group-of-workOrder';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getTasksByWorkOrderId(query: { workOrderId: string }) {
        const suffixPath = 'get-tasks-by-work-order-id';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getAllByFilterAndPaginationWithUserId(item: WorkOrderDto.GetAllByFilterAndPagination,
                                          query: { paging: Paging, totalElements: any, userId: string }) {
        const suffixPath =
            'get-all-by-filter-and-pagination-by-user-id';
        return super.postService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    delete(query: { workOrderId: string }) {
        const suffixPath =
            'delete-create-work-order';
        return super.deleteService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query,
        });
    }

    getOne(query: { workOrderId: string }) {
        const suffixPath =
            'get-one-create';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getListByProjectId(query: { projectId: string }) {
        const suffixPath =
            'get-work-order-list-by-project-id';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    ///////////////////////// 1///////////////////////////////
    getRealHighestPriorityWorkOrdersBySpecifiedMonth(query: { userAssignedId: string, month: any }) {
        const suffixPath =
            'get-real-highest-priority-work-orders';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    countRealHighestPriorityWorkOrders(query: { userAssignedId: string, month: any }) {
        const suffixPath =
            'count-real-highest-priority-work-orders';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    /////////////////////////// 1 /////////////////////////////
    getListByProjectIdTow(query: { projectId: string }) {
        const suffixPath =
            'get-all-work-order-by-project-id';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getNotifyListByWorkOrderId(query: { workOrderId: string }) {
        const suffixPath =
            'get-notify-list-by-work-order-id';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getTaskGroupListByWorkOrderId(query: { workOrderId: string }) {
        const suffixPath =
            'get-task-group-list-by-work-order-id';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getWorkOrderPartListByWorkOrderId(query: { workOrderId: string }) {
        const suffixPath =
            'get-part-list-by-work-order-id';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    checkWorkOrderCode(query: { workOrderCode: string }) {
        const suffixPath =
            'check-work-order-code';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getBasicInformationByWorkOrderId(query: { workOrderId: string }) {
        const suffixPath =
            'get-basic-information-by-work-order-id';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getCompletionDetailByWorkOrderId(query: { workOrderId: string }) {
        const suffixPath =
            'get-completion-detail-by-work-order-id';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    updateWorkOrderBasicInformation(item, query: { workOrderId: string }) {
        const suffixPath = 'update-basic-information-by-work-order-id';
        return super.putService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    updateWorkOrderCompletionDetail(item, query: { workOrderId: string }) {
        const suffixPath = 'update-completion-detail-by-work-order-id';
        return super.putService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    updateWorkOrderMiscCost(miscCostList: any, query: { workOrderId: string }) {
        const suffixPath = 'update-misc-cost-list-by-work-order-id';
        return super.putService(miscCostList, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    updateWorkOrderNotify(notifyList: any, query: { workOrderId: string }) {
        const suffixPath = 'update-notify-list-by-work-order-id';
        return super.putService(notifyList, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    updateWorkOrderPartListByWorkOrderId(workOrderParts: any, query: { workOrderId: string }) {
        const suffixPath = 'update-part-list-by-work-order-id';
        return super.putService(workOrderParts, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    updateTaskGroupListByWorkOrderId(taskGroupList: any, query: { workOrderId: string }) {
        const suffixPath = 'update-task-group-list-by-work-order-id';
        return super.putService(taskGroupList, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    /// countWorkOrderInDashboard //////////
    getOneCountWorkOrder(suffixPathh, query: { userAssignedId: string, month: string }) {
        // tslint:disable-next-line:prefer-const
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPathh, {}),
            urlQueryObject: query
        });
    }


    /// getOneWorkOrderForShowInDashboard //////////
    getOneWorkOrderForShowInDashboard(suffixPath, query: { userAssignedId: string, month: number }) {
        // tslint:disable-next-line:prefer-const
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    saveSearchBox(item) {
        const suffixPath = 'search-box-selected';
        return super.postService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }

    updateSearchBox(item) {
        const suffixPath = 'update-search-box-selected';
        return super.putService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }

//     @PostMapping("new-save")
//     public ResponseEntity<?> newSave(@RequestBody NewSaveDTO newSaveDTO) {
// }
    newSave(newSaveDTO: WorkOrderDto.NewSaveDTO) {
        const suffixPath = 'new-save';
        return super.postService(newSaveDTO, {
            needToken: true,
            objectSuffix: this.replaceParams(suffixPath, {}),
            objectPrefix: this.getPrefix({})
        });
    }

    // @PutMapping("new-update")
    // public ResponseEntity<?> newUpdate(@RequestBody NewSaveDTO newSaveDTO) {
// }
    newUpdate(newSaveDTO: WorkOrderDto.NewSaveDTO) {
        const suffixPath = 'new-update';
        return super.putService(newSaveDTO, {
            needToken: true,
            objectSuffix: this.replaceParams(suffixPath, {}),
            objectPrefix: this.getPrefix({})
        });
    }

    newGetOne(query: { workOrderId: string }) {
        const suffixPath =
            'new-get-one';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    /// برای ایجاد فایل pdf-excel
    getAllWorkOrderForExcel(dto) {
        const suffixPath = 'get-all-for-excel';
        return super.postService(dto, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }

// چک کردن تکراری بودن برگه EM


    checkWorkOrderPmCode(query: { pmCode: number }) {
        const suffixPath =
            'check-work-order-pm-code';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }
}
