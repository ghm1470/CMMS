import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {ActionMode} from '../../../formBuilder/fb-model/enumeration/enum/ActionMode';
import {TaskGroupDto} from '../../../taskGroup/model/dto/taskGroupDto';
import {WorkTableDto} from '../../../worktable/model/workTable';
import {TaskGroupService} from '../../../taskGroup/endpoint/task-group.service';
import {WorkOrderRepositoryService} from '../../endpoint/work-order-repository.service';
import {WorkOrderService} from '../../endpoint/work-order.service';
import {DataService} from '../../../../shared/service/data.service';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {DefaultNotify, isNullOrUndefined, ModalSize} from '@angular-boot/util';
import {ModalUtil} from '@angular-boot/widgets';
import {SendInformationNumberOfTabs} from '../../../worktable/feature/show-the-trend-here/show-the-form-of-previous-steps/show-the-form-of-previous-steps.component';
import {TokenRoleList} from "../../../../shared/shared/constants/tokenRoleList";
import {Auth} from "../../../../shared/constants/cacheKeys";
import {ActivatedRoute, Router} from "@angular/router";
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

@Component({
    selector: 'app-work-order-task-group-work-table',
    templateUrl: './work-order-task-group-work-table.component.html',
    styleUrls: ['./work-order-task-group-work-table.component.scss']
})
export class WorkOrderTaskGroupWorkTableComponent implements OnInit, OnDestroy, OnChanges {

    @Input() staticFormsIdList: string [] = [];
    @Input() workOrderId: string;
    @Input() activityInstanceId: string;
    @Input() activityLevelId: string;
    @Input() isView: boolean;
    @Input() taskGroupDTO: string [] = [];
    @Input() sendInformationNumberOfTabs = new SendInformationNumberOfTabs();
    @Input() numberOfParticipation: number;
    @Output() nextCarousel = new EventEmitter<boolean>();
    existedAlreadySaveForWAR: boolean;
    actionMode = ActionMode;
    taskGroupList: TaskGroupDto.Create[] = [];
    taskGroupListCopy: TaskGroupDto.Create[] = [];
    workOrderTaskGroupList: any[] = [];
    workOrderTaskGroupListCopy: any[] = [];
    selectedTaskGroup: TaskGroupDto.Create = new TaskGroupDto.Create();
    // workOrderAndFormRepository: WorkTableDto.ActivitySampleWorkOrderAndFormRepository;
    MyModalSize = ModalSize;
    // modalId = ModalUtil.generateModalId();
    modalTasksTitle: string;
    taskS: TaskGroupDto.TaskS [] = [];
    getTGService = false;
    roleList = new TokenRoleList();

    constructor(public taskGroupService: TaskGroupService,
                public workOrderRepositoryService: WorkOrderRepositoryService,
                public activatedRoute: ActivatedRoute,
                public router: Router,
                private cacheService: CacheService,
                public workOrderService: WorkOrderService) {
    }

    enableItems = false;

    ngOnInit() {
        if (this.staticFormsIdList) {
            if (this.staticFormsIdList.some(id => id === 'taskGroup')) {
                this.enableItems = true;
            }
        }
        DataService.getExistedAlreadySaveForWAR.subscribe((res: boolean) => {
            if (res) {
                this.existedAlreadySaveForWAR = res;
            }
        });
        this.getAllTaskGroup();
        this.getRoleListKey();
        this.getTaskGroupListWithWorkOrderId();
    }

    getRoleListKey() {
        this.cacheService.getItem(Auth.RoleListKey, CacheType.LOCAL_STORAGE).pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            if (res) {
                this.roleList = res;
            }
        });
    }

    loading = false;

    getTaskGroupListWithWorkOrderId() {
        if (this.getTGService) {
            this.loading = true;
            this.workOrderService.getTaskGroupListByWorkOrderId({workOrderId: this.workOrderId}).pipe(takeUntilDestroyed(this))
                .subscribe((res: GetWOTG) => {
                    this.loading = false;
                    if (res && res.taskGroups) {
                        setTimeout(() => {
                            this.workOrderTaskGroupList = [];
                            for (let i = 0; i < res.taskGroups.length; i++) {
                                this.workOrderTaskGroupList.push(this.taskGroupListCopy.find(e => e.id === res.taskGroups[i]));
                            }
                            this.workOrderTaskGroupListCopy = JSON.parse(JSON.stringify(this.workOrderTaskGroupList));
                            this.filterTaskGroupList();
                        }, 50);
                    }
                }, error => {
                    this.loading = false;
                });
        } else {
            setTimeout(() => {
                this.getTaskGroupListWithWorkOrderId();
            }, 50);
        }
    }

    getAllTaskGroup() {
        this.taskGroupService.getAllForWorkTable().pipe(takeUntilDestroyed(this))
            .subscribe((res: TaskGroupDto.Create[]) => {
                if (res && res.length) {
                    this.taskGroupList = res;
                    this.taskGroupListCopy = JSON.parse(JSON.stringify(this.taskGroupList))
                    this.filterTaskGroupList();
                    // this.getTaskGroupListWithWorkOrderId();
                    this.getTGService = true;
                }
            });
    }

    filterTaskGroupList() {
        if (this.taskGroupList.length > 0 && this.workOrderTaskGroupList.length > 0) {
            for (const item of this.workOrderTaskGroupList) {
                this.taskGroupList = this.taskGroupList.filter(part => part.id !== item.id);
            }
        }
    }

    updateTaskGroupListByWorkOrderId() {

        let taskGroupIdList = [];
        // for (const item of this.workOrderTaskGroupList) {
        //     taskGroupIdList.push(item.id);
        // }
        // this.workOrderService.updateTaskGroupListByWorkOrderId(taskGroupIdList,
        //   {workOrderId: this.workOrderId}).pipe(takeUntilDestroyed(this))
        //   .subscribe((res: any) => {
        //     if (res) {
        // =================================================================
        // this.workOrderAndFormRepository.taskGroupList = taskGroupIdList;
        // DataService.setWAFRepository(this.workOrderAndFormRepository);
        // =================ثبت کردن در ریپاسیتوری
        if ((!this.existedAlreadySaveForWAR)) {
            taskGroupIdList = this.workOrderTaskGroupList.map(w => w.id);

            this.workOrderRepositoryService.createTaskGroupList(taskGroupIdList,
                {
                    activityInstanceId: this.activityInstanceId,
                    workOrderId: this.workOrderId,
                    activityLevelId: this.activityLevelId, numberOfParticipation: this.numberOfParticipation
                })
                .pipe(takeUntilDestroyed(this)).subscribe(resOne => {
                if (resOne) {
                    this.workOrderTaskGroupListCopy = JSON.parse(JSON.stringify(this.workOrderTaskGroupList));
                    DefaultNotify.notifySuccess('تغییرات با موفقیت ثبت شد.', '', NotiConfig.notifyConfig);
                    DataService.setExistedAlreadySaveForWAR(true);
                    // this.workOrderAndFormRepository.id = resOne;
                }
            });
        } else if (this.existedAlreadySaveForWAR) {

            if (JSON.stringify(this.workOrderTaskGroupListCopy) === JSON.stringify(this.workOrderTaskGroupList)) {
                DefaultNotify.notifyDanger('تغییری اعمال نشده است.', '', NotiConfig.notifyConfig);
                return;
            }
            taskGroupIdList = this.workOrderTaskGroupList.map(w => w.id);

            this.workOrderRepositoryService.updateTaskGroupList(taskGroupIdList,
                {
                    activityInstanceId: this.activityInstanceId,
                    workOrderId: this.workOrderId,
                    activityLevelId: this.activityLevelId, numberOfParticipation: this.numberOfParticipation
                })
                .pipe(takeUntilDestroyed(this)).subscribe(resTow => {
                if (resTow) {
                    this.workOrderTaskGroupListCopy = JSON.parse(JSON.stringify(this.workOrderTaskGroupList));
                    DefaultNotify.notifySuccess('تغییرات با موفقیت ویرایش شد.', '', NotiConfig.notifyConfig);
                }
            });
        }
        // =================================================================
        //   } else {
        //     DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.');
        //   }
        // });
    }

    ngOnDestroy(): void {
    }

    changeTaskGroup() {
        if (this.selectedTaskGroup.id) {
            this.workOrderTaskGroupList.push(this.taskGroupList.find(part => part.id === this.selectedTaskGroup.id));
            const index = this.taskGroupList.findIndex(part => part.id === this.selectedTaskGroup.id);
            this.taskGroupList.splice(index, 1);
            this.selectedTaskGroup.id = null;
        }
    }

    deleteTaskGroup(id: string) {
        this.taskGroupList.push(this.workOrderTaskGroupList.find(part => part.id === id));
        const index = this.workOrderTaskGroupList.findIndex(part => part.id === id);
        this.workOrderTaskGroupList.splice(index, 1);
        this.selectedTaskGroup.id = null;
        const taskGroupIdList = [];
        for (const item of this.workOrderTaskGroupList) {
            taskGroupIdList.push(item.id);
        }
        // if ((!this.existedAlreadySaveForWAR)) {
        //   this.workOrderRepositoryService.createTaskGroupList(taskGroupIdList,
        //     {activityInstanceId: this.activityInstanceId,
        //       activityLevelId: this.activityLevelId, numberOfParticipation: this.numberOfParticipation})
        //     .pipe(takeUntilDestroyed(this)).subscribe(resOne => {
        //     if (resOne) {
        //       // this.workOrderAndFormRepository.id = resOne;
        //     }
        //   });
        // } else if (this.existedAlreadySaveForWAR) {
        //   this.workOrderRepositoryService.updateTaskGroupList(taskGroupIdList,
        //     {activityInstanceId: this.activityInstanceId,
        //       activityLevelId: this.activityLevelId, numberOfParticipation: this.numberOfParticipation})
        //     .pipe(takeUntilDestroyed(this)).subscribe(resTow => {
        //     if (resTow) {
        //     }
        //   });
        // }
    }

    nextOrPrev(item) {
        if (item === 'next') {
            this.nextCarousel.emit(true);
        }
        if (item === 'prev') {
            this.nextCarousel.emit(false);
        }
    }


    openTasksModal(item: any) {
        this.taskS = [];
        this.modalTasksTitle = item.name;
        this.taskS = item.taskList;
        ModalUtil.showModal('taskM');
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!isNullOrUndefined(changes.taskGroupDTO)) {
            this.getTaskGroupListWithWorkOrderId();
        }
    }

    chooseSelectedItemForViewPage(item: TaskGroupDto.Create) {
        this.router.navigate(['/panel/taskGroup/main/action'], {
            queryParams: {mode: ActionMode.VIEW, entityId: item.id},
            relativeTo: this.activatedRoute
        });
        // const baseUrl = window.location.hash.split('#/')[0] + '#/';
        // const url = this.router.createUrlTree(['/panel/taskGroup/main/action'], {
        //     queryParams: {mode: ActionMode.VIEW, entityId: item.id},
        //     relativeTo: this.activatedRoute,
        //
        // });
        // window.open(baseUrl + url);


    }

    selectedEntity = new TaskGroupDto.Create();

    showTaskList(entity) {
        this.selectedEntity = entity;
        ModalUtil.showModal('selectedEntityTaskLisModal');

    }
}

export class GetWOTG {
    delete: boolean;
    fromSchedule: boolean;
    id: string;
    notToBeShown: boolean;
    taskGroups: string[];
    assignedToTechnician = false;
    rejectedWorkOrder = false;
}

