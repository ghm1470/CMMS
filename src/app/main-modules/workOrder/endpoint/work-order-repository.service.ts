import {Injectable} from '@angular/core';
import {ResponseContentType, ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {TaskGroupDto} from '../../taskGroup/model/dto/taskGroupDto';
import Task = TaskGroupDto.Task;
import {WorkOrderDto} from '../model/dto/workOrderDto';
import MiscCost = WorkOrderDto.MiscCost;
import {PartWithUsageCount} from '../feature/part-with-usage-count/model/PartWithUsageCount';
import {Notify} from '../feature/notify/model/notify';
import {FormAndFormData} from '../../formBuilder/fb-model/form/form';

@Injectable({
    providedIn: 'root'
})
export class WorkOrderRepositoryService extends ServiceBase2 {

    constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig
    ) {
        super();
        this._objectName = 'work-order-repository';
        this.prefixMatches = this.getMatches(this._prefix);
    }

    create(item) {
        const suffixPath = 'save';
        return super.postService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            responseContentType: ResponseContentType.Text,
        });
    }

    update(item) {
        const suffixPath = 'update';
        return super.putService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
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

    getOne(query: { activityInstanceId: string, activityLevelId: string, numberOfParticipation: number }) {
        const suffixPath =
            'get-work-order-and-form';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query,
        });
    }

    createWorkOrderDto(item, query: { activityInstanceId: string, activityLevelId: string, numberOfParticipation: number, workOrderId: string }) {
        const suffixPath = 'save-createDto';
        return super.postService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            responseContentType: ResponseContentType.Text,
            urlQueryObject: query,
        });
    }

    updateWorkOrderDto(item, query: {
        activityLevelId: string, activityInstanceId: string,
        numberOfParticipation: number, workOrderId: string
    }) {
        const suffixPath = 'update-createDTO';
        return super.putService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            responseContentType: ResponseContentType.Text,
            urlQueryObject: query,
        });
    }


    createBasicInformation(item, query: {
        activityInstanceId: string, activityLevelId: string,
        numberOfParticipation: number, workOrderId: string
    }) {
        const suffixPath = 'save-basic-information';
        return super.postService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            responseContentType: ResponseContentType.Text,
            urlQueryObject: query,
        });
    }

    updateBasicInformation(item, query: {
        activityInstanceId: string, activityLevelId: string,
        numberOfParticipation: number, workOrderId: string
    }) {
        const suffixPath = 'update-basic-information';
        return super.putService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            responseContentType: ResponseContentType.Text,
            urlQueryObject: query,
        });
    }

    existedAlreadySave(query: {
        activityInstanceId: string,
        activityLevelId: string,
        workOrderId: string,
        formId: string,
        formDataId: string,
        numberOfParticipation: number
    }) {
        const suffixPath =
            'is-there-repository';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query,
        });
    }

    createCompletionDetail(item, query: {
        activityInstanceId: string,
        activityLevelId: string,
        workOrderId: string,
        numberOfParticipation: number
    }) {
        const suffixPath = 'save-completion-detail';
        return super.postService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            responseContentType: ResponseContentType.Text,
            urlQueryObject: query,
        });
    }

    updateCompletionDetail(item, query: {
        activityInstanceId: string,
        activityLevelId: string,
        numberOfParticipation: number,
        workOrderId: string
    }) {
        const suffixPath = 'update-completion-detail';
        return super.putService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            // responseContentType: ResponseContentType.Text,
            urlQueryObject: query,
        });
    }

    createFormAndFormData(formAndFormData: FormAndFormData, query: { activityInstanceId: string, activityLevelId: string, numberOfParticipation: number }) {
        const suffixPath = 'save-form-and-form-data';
        return super.postService(formAndFormData, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            responseContentType: ResponseContentType.Text,
            urlQueryObject: query,
        });
    }

    updateFormAndFormData(formAndFormData: FormAndFormData, query: {
        activityInstanceId: string,
        activityLevelId: string, numberOfParticipation: number

    }) {
        const suffixPath = 'update-form-and-form-data';
        return super.putService(formAndFormData, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            responseContentType: ResponseContentType.Text,
            urlQueryObject: query,
        });
    }

    createTaskGroupList(taskGroupList: string[], query: { activityInstanceId: string, activityLevelId: string, numberOfParticipation: number, workOrderId: string }) {
        const suffixPath = 'save-task-group-list';
        return super.postService(taskGroupList, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            responseContentType: ResponseContentType.Text,
            urlQueryObject: query,
        });
    }

    updateTaskGroupList(taskGroupList: string[], query: {
        activityInstanceId: string,
        activityLevelId: string,
        numberOfParticipation: number,
        workOrderId: string
    }) {
        const suffixPath = 'update-task-group-list';
        return super.putService(taskGroupList, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            responseContentType: ResponseContentType.Text,
            urlQueryObject: query,
        });
    }

    createTaskListInFirstTime(task: Task, query: {
        activityInstanceId: string,
        activityLevelId: string,
        numberOfParticipation: number,
        workOrderId: string
    }) {
        const suffixPath = 'save-task-list-in-first-time';
        return super.postService(task, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            // responseContentType: ResponseContentType.Text,
            urlQueryObject: query,
        });
    }

    createTaskAfterFirstTime(task: Task, query: {
        activityInstanceId: string,
        activityLevelId: string,
        numberOfParticipation: number
        workOrderId: string
    }) {
        const suffixPath = 'save-task-after-first-time';
        return super.putService(task, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            responseContentType: ResponseContentType.Text,
            urlQueryObject: query,
        });
    }

    updateTask(task: Task, query: {
        activityInstanceId: string,
        activityLevelId: string, numberOfParticipation: number
        workOrderId: string
    }) {
        const suffixPath = 'update-task';
        return super.putService(task, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            // responseContentType: ResponseContentType.Text,
            urlQueryObject: query,
        });
    }


    createMiscCostInFirstTime(miscCost: MiscCost, query: {
        activityInstanceId: string, activityLevelId: string,
        workOrderId: string, numberOfParticipation: number
    }) {
        const suffixPath = 'save-misc-cost-in-first-time';
        return super.postService(miscCost, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            responseContentType: ResponseContentType.Text,
            urlQueryObject: query,
        });
    }

    createMiscCostAfterFirstTime(miscCost: MiscCost, query: {
        activityInstanceId: string,
        activityLevelId: string, numberOfParticipation: number
        workOrderId: string
    }) {
        const suffixPath = 'save-misc-cost-after-first-time';
        return super.putService(miscCost, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            responseContentType: ResponseContentType.Text,
            urlQueryObject: query,
        });
    }

    updateMiscCost(miscCost: MiscCost, query: {
        activityInstanceId: string,
        activityLevelId: string, numberOfParticipation: number
        workOrderId: string
    }) {
        const suffixPath = 'update-misc-cost';
        return super.putService(miscCost, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            responseContentType: ResponseContentType.Text,
            urlQueryObject: query,
        });
    }

    createPartWithUsageCountInFirstTime(partWithUsageCount: PartWithUsageCount, query: { activityInstanceId: string, activityLevelId: string, numberOfParticipation: number, workOrderId: string }) {
        const suffixPath = 'save-part-with-usage-count-in-first-time';
        return super.postService(partWithUsageCount, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            responseContentType: ResponseContentType.Text,
            urlQueryObject: query,
        });
    }

    createPartWithUsageCountAfterFirstTime(partWithUsageCount: PartWithUsageCount, query: {
        activityInstanceId: string,
        activityLevelId: string, numberOfParticipation: number
        workOrderId: string
    }) {
        const suffixPath = 'save-part-with-usage-count-after-first-time';
        return super.putService(partWithUsageCount, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            responseContentType: ResponseContentType.Text,
            urlQueryObject: query,
        });
    }

    updatePartWithUsageCount(partWithUsageCount: PartWithUsageCount, query: {
        activityInstanceId: string,
        activityLevelId: string, numberOfParticipation: number
        workOrderId: string
    }) {
        const suffixPath = 'update-part-with-usage-count';
        return super.putService(partWithUsageCount, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            responseContentType: ResponseContentType.Text,
            urlQueryObject: query,
        });
    }

    createNotifyInFirstTime(notify: Notify, query: { activityInstanceId: string, activityLevelId: string, numberOfParticipation: number, workOrderId: string }) {
        const suffixPath = 'save-notify-in-first-time';
        return super.postService(notify, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            responseContentType: ResponseContentType.Text,
            urlQueryObject: query,
        });
    }

    createNotifyAfterFirstTime(notify: Notify, query: {
        activityInstanceId: string,
        activityLevelId: string, numberOfParticipation: number, workOrderId: string
    }) {
        const suffixPath = 'save-notify-after-first-time';
        return super.putService(notify, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            responseContentType: ResponseContentType.Text,
            urlQueryObject: query,
        });
    }

    updateNotify(notify: Notify, query: {
        activityInstanceId: string,
        activityLevelId: string, numberOfParticipation: number, workOrderId: string
    }) {
        const suffixPath = 'update-notify';
        return super.putService(notify, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            responseContentType: ResponseContentType.Text,
            urlQueryObject: query,
        });
    }


    uploadDocumentFileInFirstTime(formData, workOrderId: string, showName: string, activityInstanceId: string, activityLevelId: string, numberOfParticipation: number) {
        let headers = new HttpHeaders();
        headers = headers.set('Authorization', sessionStorage.getItem('token'));
        return this._HttpClient.post(this._ServiceConfig.getUrl() + '/work-order-repository/upload-document-file-in-first-time?workOrderId=' + workOrderId + '&showName=' + showName + '&activityInstanceId=' + activityInstanceId + '&activityLevelId=' + activityLevelId + '&numberOfParticipation=' + numberOfParticipation
            /*Config.getLocalStorageToken()*/, formData, {headers: headers});
    }

    uploadDocumentFileAfterFirstTime(formData, workOrderId: string, showName: string, activityInstanceId: string, activityLevelId: string, numberOfParticipation: number) {
        let headers = new HttpHeaders();
        headers = headers.set('Authorization', sessionStorage.getItem('token'));
        return this._HttpClient.post(this._ServiceConfig.getUrl() + '/work-order-repository/upload-document-file-after-first-time?workOrderId=' + workOrderId + '&showName=' + showName + '&activityInstanceId=' + activityInstanceId + '&activityLevelId=' + activityLevelId + '&numberOfParticipation=' + numberOfParticipation
            /*Config.getLocalStorageToken()*/, formData, {headers: headers});
    }

//     @DeleteMapping("work-order-repository/delete-task")
//     public ResponseEntity<?> deleteTask(@PathParam("activityLevelId") String activityLevelId,
//     @PathParam("activityInstanceId") String activityInstanceId,
//     @PathParam("numberOfParticipation") int numberOfParticipation,
//     @PathParam("taskId") String taskId,
//     @PathParam("workOrderId") String workOrderId) {
// {
    deleteTask(query: {
        activityInstanceId: string,
        activityLevelId: string,
        workOrderId: string,
        numberOfParticipation: number,
        taskId: string,
        forSchedule: boolean,
    }) {
        const suffixPath = 'delete-task';
        return super.deleteService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query,
        });
    }

    deletePartWithUsageCount(query: {
        activityInstanceId: string,
        activityLevelId: string,
        workOrderId: string,
        numberOfParticipation: number,
        partWithUsageCountId: string,
        forSchedule: boolean
    }) {
        const suffixPath =
            'delete-part-with-usage-count';
        return super.deleteService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query,
        });
    }

    deleteMiscCost(query: {
        activityInstanceId: string, activityLevelId: string, numberOfParticipation: number, miscCostId: string
    }) {
        const suffixPath =
            'delete-misc-cost';
        return super.deleteService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query,
        });
    }

    deleteNotify(query: { activityInstanceId: string, activityLevelId: string, numberOfParticipation: number, notifyId: string }) {
        const suffixPath =
            'delete-notify';
        return super.deleteService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query,
        });
    }

    deleteDocumentFileId(query: {
        activityInstanceId: string,
        activityLevelId: string,
        workOrderId: string,
        numberOfParticipation: number,
        documentFileId: string,
        forSchedule: boolean
    }) {
        const suffixPath =
            'delete-document-file';
        return super.deleteService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query,
        });
    }

}
