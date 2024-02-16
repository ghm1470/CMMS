import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {ActionMode} from '../../../formBuilder/fb-model/enumeration/enum/ActionMode';
import {TaskGroupDto} from '../../../taskGroup/model/dto/taskGroupDto';
import {TaskGroupService} from '../../../taskGroup/endpoint/task-group.service';
import {WorkOrderRepositoryService} from '../../endpoint/work-order-repository.service';
import {WorkOrderService} from '../../endpoint/work-order.service';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {ModalUtil} from '@angular-boot/widgets';
import {isNullOrUndefined, ModalSize} from '@angular-boot/util';
import {WorkOrderDto} from '../../model/dto/workOrderDto';
import {SendInformationNumberOfTabs} from '../../../worktable/feature/show-the-trend-here/show-the-form-of-previous-steps/show-the-form-of-previous-steps.component';
import {TokenRoleList} from "../../../../shared/shared/constants/tokenRoleList";
import {Auth} from "../../../../shared/constants/cacheKeys";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-work-order-task-group-work-tview',
    templateUrl: './work-order-task-group-work-tview.component.html',
    styleUrls: ['./work-order-task-group-work-tview.component.scss']
})
export class WorkOrderTaskGroupWorkTViewComponent implements OnInit, OnDestroy, OnChanges {

    @Input() taskGroupStringList: string[];
    @Output() nextCarousel = new EventEmitter<boolean>();
    @Input() sendInformationNumberOfTabs = new SendInformationNumberOfTabs();
    @Input() workOrderId: string;

    actionMode = ActionMode;
    workOrderTaskGroupList: TaskGroupDto.Create[] = [];
    workOrderTaskGroup = new TaskGroupDto.Create();
    taskGroupList: TaskGroupDto.Create[] = [];
    MyModalSize = ModalSize;
    modalTasksTitle: string;
    taskS: TaskGroupDto.TaskS [] = [];
    roleList = new TokenRoleList();

    constructor(public taskGroupService: TaskGroupService,
                public workOrderRepositoryService: WorkOrderRepositoryService,
                public activatedRoute: ActivatedRoute,
                private cacheService: CacheService,
                public router: Router,
                public workOrderService: WorkOrderService) {
    }

    ngOnInit() {
        // this.getAllTaskGroup();
        this.getRoleListKey();
        this.getAllTaskGroup();

    }

    getRoleListKey() {
        this.cacheService.getItem(Auth.RoleListKey, CacheType.LOCAL_STORAGE).pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            if (res) {
                this.roleList = res;
            }
        });
    }

    ngOnDestroy(): void {
    }


    nextOrPrev(item) {
        if (item === 'next') {
            this.nextCarousel.emit(true);
        }
        if (item === 'prev') {
            this.nextCarousel.emit(false);
        }
    }

    getTaskGroupListWithWorkOrderId() {
        this.workOrderService.getTaskGroupListByWorkOrderId({workOrderId: this.workOrderId}).pipe(takeUntilDestroyed(this))
            .subscribe((res: GetWOTG) => {
                if (res && res.taskGroups) {
                    setTimeout(() => {
                        this.workOrderTaskGroupList = [];
                        for (let i = 0; i < res.taskGroups.length; i++) {
                            this.workOrderTaskGroupList.push(this.taskGroupList.find(e => e.id === res.taskGroups[i]));
                        }

                    }, 50);
                }
            });
    }

    getAllTaskGroup() {
        this.taskGroupService.getAllForWorkTable().pipe(takeUntilDestroyed(this))
            .subscribe((res: TaskGroupDto.Create[]) => {
                if (res && res.length) {
                    this.taskGroupList = res;
                    this.workOrderTaskGroupList = [];
                    if (this.taskGroupStringList) {
                        if (this.taskGroupStringList.length) {
                            for (let i = 0; i < this.taskGroupStringList.length; i++) {
                                this.workOrderTaskGroupList.push(this.taskGroupList.find(e => e.id === this.taskGroupStringList[i]));
                            }
                        }
                    }
                    // this.getTaskGroupListWithWorkOrderId();

                }
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        // if (changes.sendInformationNumberOfTabs) {
        // }
        // if (changes.taskGroupStringList) {
        //     if (!isNullOrUndefined(this.taskGroupStringList)) {
        //         this.getAllTaskGroup();
        //     } else {
        //         this.taskGroupStringList = [];
        //     }
        // }

        if (!isNullOrUndefined(changes.taskGroupDTO)) {
            // this.getTaskGroupListWithWorkOrderId();
        }
    }

    selectedEntity = new TaskGroupDto.Create();

    showTaskList(entity) {
        this.selectedEntity = entity;
        ModalUtil.showModal('selectedEntityTaskLisModal');

    }

    chooseSelectedItemForViewPage(item: TaskGroupDto.Create) {
        this.selectedEntity = item;
        setTimeout(e => {

            ModalUtil.showModal('selectedEntityShowModal');
        }, 100);
        // const baseUrl = window.location.hash.split('#/')[0] + '#/';
        // const url = this.router.createUrlTree(['/panel/taskGroup/main/action'], {
        //     queryParams: {mode: ActionMode.VIEW, entityId: item.id},
        //     relativeTo: this.activatedRoute,
        //
        // });
        // window.open(baseUrl + url, '_blank');


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
