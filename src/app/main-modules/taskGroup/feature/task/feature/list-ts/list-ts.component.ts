import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ActionMode, DefaultNotify} from '@angular-boot/util';
import {EnumObject} from '../../../../../../_base/utility/enum/enum-object';
import {TaskService} from '../../endpoint/task.service';
import {ActivatedRoute, Router} from '@angular/router';
import {EnumHandle} from '../../../../../../_base/utility/enum/enum-handle';
import {takeUntilDestroyed} from '@angular-boot/core';
import {ModalUtil} from '@angular-boot/widgets';
import {TaskGroupDto} from '../../../../model/dto/taskGroupDto';
import Task = TaskGroupDto.Task;
import TaskType = TaskGroupDto.TaskType;
import {TokenRoleList} from '../../../../../../shared/shared/constants/tokenRoleList';
import {DeleteModel} from '../../../../../../shared/conferm-delete/model/delete-model';
import {FormCategory} from '../../../../../basicInformation/formCategory/model/dto/formCategory';
import {NotiConfig} from "../../../../../../shared/tools/notifyConfig";

@Component({
    selector: 'app-list-ts',
    templateUrl: './list-ts.component.html',
    styleUrls: ['./list-ts.component.scss']
})
export class ListTsComponent implements OnInit, OnDestroy {

    @Output() messageEvent = new EventEmitter<Task>();
    @Output() nextCarousel = new EventEmitter<boolean>();
    @Input() taskList: Task[] = [];
    @Input() referenceId = 'null';
    @Input() taskGroupId: string;
    @Input() mode;
    task = new Task();
    totalElements = 0;
    actionMode = ActionMode;
    taskId: string;
    metringIndex: number;
    modeView: ActionMode = ActionMode.ADD;
    sendTaskForEdit = new Task();
    showAddTask = false;
    taskTypeList = [] as EnumObject[];
    roleList = new TokenRoleList();
    selectedItemForDelete = new DeleteModel();
    readService: boolean;


    constructor(public taskService: TaskService,
                public activatedRoute: ActivatedRoute,
                public router: Router) {
        this.taskTypeList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<TaskType>(TaskType));
    }

    ngOnInit() {
        console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', this.mode)
        if (this.referenceId !== 'null') {
            this.getTaskListByReferenceId();
        }
    }

    getTaskListByReferenceId() {
        this.taskService.getTaskListByReferenceId({referenceId: this.referenceId}).pipe(takeUntilDestroyed(this))
            .subscribe((res: Task[]) => {
                if (res) {
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
        console.log('sendTask----------====----->', this.sendTaskForEdit);
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

    setService1() {
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

    chooseSelectedItemForView(item: Task, i) {
        this.metringIndex = i;
        this.taskId = item.id;
        this.mode = this.actionMode.VIEW;
        this.modeView = ActionMode.VIEW;
        this.sendTaskForEdit = JSON.parse(JSON.stringify(item));
        this.showAddTask = true;
        setTimeout(() => {
            ModalUtil.showModal('taskModal');
        }, 200);
    }

    nextOrPrev() {
        this.nextCarousel.emit(true);
    }


}


