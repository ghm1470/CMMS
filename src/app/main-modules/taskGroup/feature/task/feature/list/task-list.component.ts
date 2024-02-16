import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ActionMode, DefaultNotify} from '@angular-boot/util';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalUtil} from '@angular-boot/widgets';
import {takeUntilDestroyed} from '@angular-boot/core';
import {TaskGroupDto} from '../../../../model/dto/taskGroupDto';
import {TaskService} from '../../endpoint/task.service';
import Task = TaskGroupDto.Task;
import {EnumHandle} from '../../../../../../_base/utility/enum/enum-handle';
import {EnumObject} from '../../../../../../_base/utility/enum/enum-object';
import TaskType = TaskGroupDto.TaskType;
import {TokenRoleList} from '../../../../../../shared/shared/constants/tokenRoleList';
import {DeleteModel} from '../../../../../../shared/conferm-delete/model/delete-model';
import {WorkOrderService} from "../../../../../workOrder/endpoint/work-order.service";
import {NotiConfig} from "../../../../../../shared/tools/notifyConfig";

@Component({
    selector: 'app-task-list',
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnDestroy {

    @Output() messageEvent = new EventEmitter<Task>();
    @Input() taskList: Task[] = [];
    @Input() referenceId = 'null';
    @Input() taskGroupId: string;
    @Input() formStatus: string;
    @Input() modeW: ActionMode;
    @Input() modeS: ActionMode = ActionMode.ADD;

    task = new Task();
    totalElements = 0;
    actionMode = ActionMode;
    @Input() mode: ActionMode;
    taskId: string;
    metringIndex: number;
    modeView: ActionMode = ActionMode.ADD;
    sendTaskForEdit = new Task();
    showAddTask = false;
    taskTypeList = [] as EnumObject[];
    roleList = new TokenRoleList();
    selectedItemForDelete = new DeleteModel();
    readService;

    constructor(public taskService: TaskService,
                public activatedRoute: ActivatedRoute,
                public workOrderService: WorkOrderService,
                public router: Router) {
        this.taskTypeList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<TaskType>(TaskType));
    }

    ngOnInit() {
        if (this.referenceId !== 'null') {
            if (this.formStatus === 'workOrder') {
                this.getTasksByWorkOrderId();
            } else {
                this.getTaskListByReferenceId();
            }
        }
    }

    getTaskListByReferenceId() {
        this.taskService.getTaskListByReferenceId({referenceId: this.referenceId}).pipe(takeUntilDestroyed(this))
            .subscribe((res: Task[]) => {
                this.taskList = res;

            });
    }

    getTasksByWorkOrderId() {
        this.workOrderService.getTasksByWorkOrderId({workOrderId: this.referenceId}).pipe(takeUntilDestroyed(this))
            .subscribe((res: Task[]) => {
                if(res){

                this.taskList = res;
                }

            });
    }

    receiveMessage(event: Task) {
        if (this.mode === ActionMode.EDIT) {
            this.taskList[this.metringIndex] = event;
        } else {
            this.taskList.push(event);
        }
        this.showAddTask = false;
        if (this.referenceId === 'null') {
            this.messageEvent.emit(JSON.parse(JSON.stringify(this.taskList)));
        }
    }

    chooseSelectedItemForEdit(item: Task, i) {
        this.metringIndex = i;
        this.taskId = item.id;
        this.mode = this.actionMode.EDIT;
        this.sendTaskForEdit = JSON.parse(JSON.stringify(item));
        this.showAddTask = true;
        setTimeout(() => {
            ModalUtil.showModal('taskModal');
        }, 200);
    }

    chooseSelectedItemForView(item: Task, i) {
        this.metringIndex = i;
        this.taskId = item.id;
        this.mode = this.actionMode.VIEW;
        this.modeView = this.actionMode.VIEW;
        this.sendTaskForEdit = JSON.parse(JSON.stringify(item));
        this.showAddTask = true;
        setTimeout(() => {
            ModalUtil.showModal('taskModal');
        }, 200);
    }


    deleteItem(event) {
        if (event) {
            this.selectedItemForDelete.loading = true;
            this.taskService.delete({taskId: this.selectedItemForDelete.id, scheduleMaintenanceId: this.referenceId})
                .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
                if (res !== 'true') {
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
                    DefaultNotify.notifyDanger(res, '', NotiConfig.notifyConfig);
                } else if (res === 'true') {
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
                    this.taskList = this.taskList

                        .filter((e) => {
                            return e.id !== this.selectedItemForDelete.id;
                        });

                    DefaultNotify.notifySuccess('با موفقیت حذف شد.', '', NotiConfig.notifyConfig);

                }
            });

        } else {
            ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
        }
    }


    showModalDelete(item, i) {
        this.selectedItemForDelete.loading = false;
        this.selectedItemForDelete.id = item.id;
        this.selectedItemForDelete.title = ' آیا    ' + item.title + ' حذف  شود؟ ';
        this.selectedItemForDelete.index = i;
        setTimeout(e => {
            ModalUtil.showModal('modalId' + this.selectedItemForDelete.id);
        }, 10);
    }


    ngOnDestroy(): void {
    }

    setService() {
        this.mode = ActionMode.ADD;
        this.showAddTask = true;
        this.readService = true;
        setTimeout(() => {
            ModalUtil.showModal('taskModal');
        }, 500);
    }

    cancelModal() {
        ModalUtil.hideModal('budgetAllocatedModal');
    }
    taskIdForWOR: string;

    chooseSelectedItemForView2(item: Task, i) {
        // if (item.forSchedule) {
        //     DefaultNotify.notifyDanger('این کار از سمت زمانبندی ایجاد گردیده و  قابل ویرایش نمی باشد.');
        //     return;
        // }
        this.metringIndex = i;
        this.taskId = item.id;
        this.taskIdForWOR = item.id;
        this.mode = null;
        setTimeout(() => {
            this.mode = this.actionMode.VIEW;
            this.sendTaskForEdit = JSON.parse(JSON.stringify(item));
            this.showAddTask = true;
            setTimeout(() => {
                ModalUtil.showModal('taskModal');
            }, 200);
        }, 200);
    }

}

