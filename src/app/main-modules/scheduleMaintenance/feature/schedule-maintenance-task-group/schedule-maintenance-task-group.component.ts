import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {TaskGroupDto} from '../../../taskGroup/model/dto/taskGroupDto';
import {TaskGroupService} from '../../../taskGroup/endpoint/task-group.service';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {ActionMode, DefaultNotify, ModalSize} from '@angular-boot/util';
import {ScheduleMaintenanceService} from '../../endpoint/schedule-maintenance.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Auth} from '../../../../shared/constants/cacheKeys';
import {TokenRoleList} from '../../../../shared/shared/constants/tokenRoleList';
import {ModalUtil} from "@angular-boot/widgets";
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

@Component({
    selector: 'app-schedule-maintenance-task-group',
    templateUrl: './schedule-maintenance-task-group.component.html',
    styleUrls: ['./schedule-maintenance-task-group.component.scss']
})
export class ScheduleMaintenanceTaskGroupComponent implements OnInit, OnDestroy {

    @Input() scheduleMaintenanceId: string;
    @Input() mode;
    taskGroupList: TaskGroupDto.Create[] = [];
    scheduleMaintenanceTaskGroupList: TaskGroupDto.Create[] = [];
    scheduleMaintenanceTaskGroupListCopy: TaskGroupDto.Create[] = [];
    selectedTaskGroup: TaskGroupDto.Create = new TaskGroupDto.Create();
    actionMode = ActionMode;
    roleList = new TokenRoleList();
    MyModalSize = ModalSize;

    constructor(public taskGroupService: TaskGroupService,
                public activatedRoute: ActivatedRoute,
                private cacheService: CacheService,
                public router: Router,
                public scheduleMaintenanceService: ScheduleMaintenanceService) {
    }

    ngOnInit() {
        this.getAllTaskGroup();
        this.getTaskGroupListWithScheduleMaintenanceId();
        // this.getTaskGroupOfWorkOrder();
        this.getRoleListKey();

    }

    getRoleListKey() {
        this.cacheService.getItem(Auth.RoleListKey, CacheType.LOCAL_STORAGE).pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            if (res) {
                this.roleList = res;
            }
        });
    }

    getTaskGroupListWithScheduleMaintenanceId() {
        this.scheduleMaintenanceService.getTaskGroupListByScheduleMaintenanceId(
            {scheduleMaintenanceId: this.scheduleMaintenanceId}).pipe(takeUntilDestroyed(this))
            .subscribe((res: any) => {
                if (res) {
                    this.scheduleMaintenanceTaskGroupList = res;
                    this.scheduleMaintenanceTaskGroupListCopy = JSON.parse(JSON.stringify(this.scheduleMaintenanceTaskGroupList));
                    this.filterTaskGroupList();
                }
            });
    }


    getAllTaskGroup() {
        // this.taskGroupService.getAll().pipe(takeUntilDestroyed(this))
        //     .subscribe((res: TaskGroupDto.Create[]) => {
        //         if (res && res.length) {
        //             this.taskGroupList = res;
        //             this.filterTaskGroupList();
        //         }
        //     });

        this.taskGroupService.getAllForWorkTable().pipe(takeUntilDestroyed(this))
            .subscribe((res: TaskGroupDto.Create[]) => {
                if (res && res.length) {
                    this.taskGroupList = res;
                    // this.taskGroupListCopy = JSON.parse(JSON.stringify(this.taskGroupList))
                    this.filterTaskGroupList();
                    // this.getTaskGroupListWithWorkOrderId();
                    // this.getTGService = true;
                }
            });
    }

    filterTaskGroupList() {
        if (this.taskGroupList.length > 0 && this.scheduleMaintenanceTaskGroupList.length > 0) {
            for (const item of this.scheduleMaintenanceTaskGroupList) {
                this.taskGroupList = this.taskGroupList.filter(part => part.id !== item.id);
            }
        }
    }

    updateTaskGroupListByScheduleMaintenanceId() {
        const taskGroupIdList = [];
        for (const item of this.scheduleMaintenanceTaskGroupList) {
            taskGroupIdList.push(item.id);
        }
        if (JSON.stringify(this.scheduleMaintenanceTaskGroupList) === JSON.stringify(this.scheduleMaintenanceTaskGroupListCopy)) {
            DefaultNotify.notifyDanger('شما تغییری ایجاد نکرده اید', '', NotiConfig.notifyConfig);
            return;
        }
        this.scheduleMaintenanceService.updateTaskGroupListByScheduleMaintenanceId(taskGroupIdList,
            {scheduleMaintenanceId: this.scheduleMaintenanceId}).pipe(takeUntilDestroyed(this))
            .subscribe((res: any) => {
                if (res) {
                    this.scheduleMaintenanceTaskGroupListCopy = JSON.parse(JSON.stringify(this.scheduleMaintenanceTaskGroupList));
                    DefaultNotify.notifySuccess('عملیات با موفقیت انجام شد.', '', NotiConfig.notifyConfig);
                    this.getTaskGroupListWithScheduleMaintenanceId();

                } else {
                    DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.', '', NotiConfig.notifyConfig);
                }
            });
    }

    ngOnDestroy(): void {
    }

    selectedTaskGroupId: string;
    showSelectChangTaskGroup = true;

    changeTaskGroup() {
        if (this.selectedTaskGroupId) {
            this.scheduleMaintenanceTaskGroupList.push(this.taskGroupList.find(part => part.id === this.selectedTaskGroupId));
            this.taskGroupList = this.taskGroupList.filter(part => part.id !== this.selectedTaskGroupId);
        }
        this.selectedTaskGroup = new TaskGroupDto.Create();
        this.selectedTaskGroupId = null;
        this.showSelectChangTaskGroup = false;
        setTimeout(e => {
            this.showSelectChangTaskGroup = true;
        }, 0.000000000000000000000001);
    }

    deleteTaskGroup(id: string) {
        this.taskGroupList.push(this.scheduleMaintenanceTaskGroupList.find(part => part.id === id));
        this.scheduleMaintenanceTaskGroupList = this.scheduleMaintenanceTaskGroupList.filter(part => part.id !== id);
    }

    chooseSelectedItemForViewPage(item: TaskGroupDto.Create) {
        this.router.navigate(['/panel/taskGroup/main/action'], {
            queryParams: {mode: ActionMode.VIEW, entityId: item.id},
            relativeTo: this.activatedRoute
        });
    }

    selectedEntity = new TaskGroupDto.Create();

    showTaskList(entity) {
        this.selectedEntity = entity;
        ModalUtil.showModal('selectedEntityTaskLisModal');

    }
}
