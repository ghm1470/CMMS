import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {ActionMode, DefaultNotify, isNullOrUndefined} from '@angular-boot/util';
import {EnumObject} from '../../../../../../_base/utility/enum/enum-object';
import {TaskService} from '../../endpoint/task.service';
import {ActivatedRoute, Router} from '@angular/router';
import {EnumHandle} from '../../../../../../_base/utility/enum/enum-handle';
import {takeUntilDestroyed} from '@angular-boot/core';
import {ModalUtil} from '@angular-boot/widgets';
import {TaskGroupDto} from '../../../../model/dto/taskGroupDto';
import Task = TaskGroupDto.Task;
import TaskType = TaskGroupDto.TaskType;
import {DataService} from '../../../../../../shared/service/data.service';
import {WorkTableDto} from '../../../../../worktable/model/workTable';
import {WorkOrderRepositoryService} from '../../../../../workOrder/endpoint/work-order-repository.service';
import {SendInformationNumberOfTabs} from '../../../../../worktable/feature/show-the-trend-here/show-the-form-of-previous-steps/show-the-form-of-previous-steps.component';
import {WorkOrderService} from "../../../../../workOrder/endpoint/work-order.service";
import {NotiConfig} from "../../../../../../shared/tools/notifyConfig";

@Component({
    selector: 'app-list-work-table',
    templateUrl: './list-work-table.component.html',
    styleUrls: ['./list-work-table.component.scss']
})
export class ListWorkTableComponent implements OnInit, OnDestroy, OnChanges {

    @Input() taskList: Task[] = [];
    @Input() staticFormsIdList: string[] = [];
    // @Input() tasksDTO: TaskGroupDto.Task[] = [];
    @Input() isView: boolean;
    @Input() workOrderId: string;
    @Input() activityInstanceId: string;
    @Input() activityLevelId: string;
    @Input() sendInformationNumberOfTabs = new SendInformationNumberOfTabs();
    @Input() numberOfParticipation: number;
    @Output() nextCarousel = new EventEmitter<boolean>();
    existedAlreadySaveForWAR: boolean;
    task = new Task();
    totalElements = 0;
    actionMode = ActionMode;
    @Input() mode: ActionMode;
    taskId: string;
    taskIdForWOR: string;
    metringIndex: number;
    modeView: ActionMode = ActionMode.ADD;
    sendTaskForEdit = new Task();
    showAddTask = false;
    taskTypeList = [] as EnumObject[];

    // workOrderAndFormRepository: WorkTableDto.ActivitySampleWorkOrderAndFormRepository;

    constructor(public taskService: TaskService,
                public workOrderRepositoryService: WorkOrderRepositoryService,
                public activatedRoute: ActivatedRoute,
                public workOrderService: WorkOrderService,
                public router: Router) {
        this.taskTypeList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<TaskType>(TaskType));
    }

    enableItems = false;

    ngOnInit() {
        if (this.staticFormsIdList) {
            if (this.staticFormsIdList.some(id => id === 'tasks')) {
                this.enableItems = true;
            }
        }
        DataService.getExistedAlreadySaveForWAR.subscribe((res: boolean) => {
            if (res) {
                this.existedAlreadySaveForWAR = res;
            }
        });
        if (this.workOrderId !== 'null') {
            // this.getTaskListByReferenceId();
            this.getTaskListByWorkOrderId();
        }
    }

    loading = false;

    getTaskListByReferenceId() {
        this.loading = true;
        this.taskService.getTaskListByReferenceId({referenceId: this.workOrderId}).pipe(takeUntilDestroyed(this))
            .subscribe((res: Task[]) => {
                this.loading = false;
                this.taskList = res;

            }, error => {
                this.loading = false;

            });
    }

    getTaskListByWorkOrderId() {
        this.workOrderService.getTasksByWorkOrderId({workOrderId: this.workOrderId}).pipe(takeUntilDestroyed(this))
            .subscribe((res: Task[]) => {
                this.taskList = res;

            });
    }

    receiveMessage(event: Task) {
        console.log('event', event)
        // event.id = new Task().id;
        if (this.mode === ActionMode.EDIT) {
            this.taskList[this.metringIndex] = event;
            if ((!this.existedAlreadySaveForWAR)) {
                this.workOrderRepositoryService.createTaskListInFirstTime(event,
                    {
                        activityInstanceId: this.activityInstanceId,
                        workOrderId: this.workOrderId,
                        activityLevelId: this.activityLevelId, numberOfParticipation: this.numberOfParticipation
                    }).pipe(takeUntilDestroyed(this)).subscribe(resOne => {
                    if (resOne === true) {
                        DefaultNotify.notifySuccess('تغییرات با موفقیت انجام شد.', '', NotiConfig.notifyConfig);
                        console.log('resOne', resOne);

                        // this.workOrderAndFormRepository.id = resOne;
                    }
                });
            } else if ((this.existedAlreadySaveForWAR)) {
                this.workOrderRepositoryService.updateTask(event,
                    {
                        workOrderId: this.workOrderId,
                        activityInstanceId: this.activityInstanceId,
                        activityLevelId: this.activityLevelId, numberOfParticipation: this.numberOfParticipation
                    })
                    .pipe(takeUntilDestroyed(this)).subscribe((resOne: boolean) => {
                    if (resOne === true) {
                        DefaultNotify.notifySuccess('تغییرات با موفقیت انجام شد.', '', NotiConfig.notifyConfig);
                        console.log('resOne', resOne);
                        // this.workOrderAndFormRepository.id = resOne;
                    }
                });
            }

        } else {

            console.log('resOne***********************');

            // this.workOrderAndFormRepository.taskList = this.taskList;
            // DataService.setWAFRepository(this.workOrderAndFormRepository);
            // =================================================================
            if ((!this.existedAlreadySaveForWAR)) {
                this.workOrderRepositoryService.createTaskListInFirstTime(event,
                    {
                        workOrderId: this.workOrderId,
                        activityInstanceId: this.activityInstanceId,
                        activityLevelId: this.activityLevelId, numberOfParticipation: this.numberOfParticipation
                    }).pipe(takeUntilDestroyed(this)).subscribe(resOne => {
                    if (resOne) {
                        console.log('resOne', resOne);
                        DataService.setExistedAlreadySaveForWAR(true);
                        DefaultNotify.notifySuccess('تغییرات با موفقیت ثبت شد.', '', NotiConfig.notifyConfig);
                        event.id = resOne;
                        if (isNullOrUndefined(this.taskList)) {
                            this.taskList = [];
                        }
                        this.taskList.push(event);
                        // this.workOrderAndFormRepository.id = resOne;
                    }
                });
            } else if (this.existedAlreadySaveForWAR) {
                this.workOrderRepositoryService.createTaskAfterFirstTime(event,
                    {
                        workOrderId: this.workOrderId,
                        activityInstanceId: this.activityInstanceId,
                        activityLevelId: this.activityLevelId, numberOfParticipation: this.numberOfParticipation
                    }).pipe(takeUntilDestroyed(this)).subscribe(resTow => {
                    if (resTow) {
                        event.id = resTow;
                        if (isNullOrUndefined(this.taskList)) {
                            this.taskList = [];
                        }
                        this.taskList.push(event);
                        DefaultNotify.notifySuccess('تغییرات با موفقیت ویرایش شد.', '', NotiConfig.notifyConfig);
                        console.log('res==>', resTow);
                    }
                });
            }


        }
        // =================================================================
        this.showAddTask = false;
    }

    // activityInstanceId: b12848ec-a867-4e92-ba53-8b45910436d4
    // activityLevelId: 1
    // workOrderId: 602caedf4ac21c665fe2174b
    // numberOfParticipation: 1
    // taskId: 60fd43ee98a1fa3531df896c
    chooseSelectedItemForEdit(item: Task, i) {
        if (item.forSchedule) {
            DefaultNotify.notifyDanger('این کار از سمت زمانبندی ایجاد گردیده و  قابل ویرایش نمی باشد.', '', NotiConfig.notifyConfig);
            return;
        }
        this.metringIndex = i;
        this.taskId = item.id;
        this.taskIdForWOR = item.id;
        this.mode = this.actionMode.EDIT;
        this.sendTaskForEdit = JSON.parse(JSON.stringify(item));
        console.log('sendTask----------====----->', this.sendTaskForEdit);
        this.showAddTask = true;
        setTimeout(() => {
            ModalUtil.showModal('taskModal2');
        }, 200);
    }

    deleteItem(item: Task) {
        // console.log(' item.id for Delete', item.id);
        // //TODO scheduleMaintenanceId؟؟؟
        // this.taskService.delete({taskId: item.id, scheduleMaintenanceId: item.referenceId})
        //     .pipe(takeUntilDestroyed(this)).subscribe((res: boolean) => {
        //     if (res) {
        //         this.taskList = this.taskList.filter((e) => {
        //                 return e.id !== item.id;
        //             });
        //         setTimeout(() => {
        // this.workOrderAndFormRepository.notifyList = this.notifyList;
        console.log(item);
        this.workOrderRepositoryService.deleteTask({
            activityInstanceId: this.activityInstanceId,
            activityLevelId: this.activityLevelId,
            workOrderId: this.workOrderId,
            numberOfParticipation: this.numberOfParticipation,
            taskId: item.id,
            forSchedule: item.forSchedule
        }).pipe(takeUntilDestroyed(this)).subscribe(resTow => {
            if (resTow) {
                this.taskList = this.taskList.filter((e) => {
                    return e.id !== item.id;
                });
                DefaultNotify.notifySuccess('باموفقیت حذف شد', '', NotiConfig.notifyConfig);

                console.log('res==>', resTow);
            }
        });
        //         }, 100);
        //         DefaultNotify.notifySuccess('باموفقیت حذف شد');
        //     }
        // });
    }

    ngOnDestroy(): void {
    }

    setService() {
        this.mode = ActionMode.ADD;
        this.showAddTask = true;
        setTimeout(() => {
            ModalUtil.showModal('taskModal2');
        }, 500);
    }

    cancelModal() {
        ModalUtil.hideModal('budgetAllocatedModal');
    }

    chooseSelectedItemForView(item: Task, i) {
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
            console.log('sendTask----------====----->', this.sendTaskForEdit);
            this.showAddTask = true;
            setTimeout(() => {
                ModalUtil.showModal('taskModal2');
            }, 200);
        }, 200);
    }

    // chooseSelectedItemForView(item: Task) {
    //     this.taskId = item.id;
    //     this.sendTaskForEdit = JSON.parse(JSON.stringify(item));
    //
    //     this.modeView = null;
    //     setTimeout(e => {
    //         this.modeView = ActionMode.VIEW;
    //         this.showAddTask = true;
    //         setTimeout(() => {
    //             ModalUtil.showModal('taskModal2');
    //         }, 200);
    //     }, 100);
    // }

    nextOrPrev(item) {
        if (item === 'next') {
            this.nextCarousel.emit(true);
        }
        if (item === 'prev') {
            this.nextCarousel.emit(false);
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        // if (!isNullOrUndefined(changes.tasksDTO)) {
        //   this.taskList = this.tasksDTO;
        // }
    }
}

