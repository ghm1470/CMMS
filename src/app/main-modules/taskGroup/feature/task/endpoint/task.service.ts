import {Injectable} from '@angular/core';
import {ResponseContentType, ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient} from '@angular/common/http';
import {Paging} from '@angular-boot/util';

@Injectable({
    providedIn: 'root'
})
export class TaskService extends ServiceBase2 {

    constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig
    ) {
        super();
        this._objectName = 'task';
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

    update(item, query: { taskId: string }) {
        const suffixPath = 'update';
        return super.putService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getTaskListByReferenceId(query: { referenceId: string }) {
        const suffixPath = 'get-task-list-by-reference-id';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }


    getTaskListByTaskId(query: { taskId: string }) {
        const suffixPath = 'get-task-by-task-id';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getTaskListByTaskGroupId(query: { taskGroupId: string }) {
        const suffixPath = 'get-tasks-of-task-group';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getTaskByTaskId(query: { taskId: string }) {
        const suffixPath = 'get-task-with-associated-user';
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

    delete(query: { taskId: string, scheduleMaintenanceId?: string }) {

        // @DeleteMapping("task/delete-schedule-maintenance")
        // public ResponseEntity<?> deleteScheduleTask(@PathParam("taskId")
        // String taskId, @PathParam("scheduleMaintenanceId") String scheduleMaintenanceId) {

        const suffixPath = 'delete-schedule-maintenance';
        return super.deleteService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query,
            responseContentType: ResponseContentType.Text
        });
    }

    getOne(query: { taskId: string }) {
        const suffixPath =
            'get-one';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    checkTaskCode(query: { taskCode: string }) {
        const suffixPath =
            'check-task-code';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }
}
