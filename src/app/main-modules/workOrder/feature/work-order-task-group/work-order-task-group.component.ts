import {Component, Input, OnDestroy, OnInit} from '@angular/core';

import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {DefaultNotify, isNullOrUndefined, ModalSize} from '@angular-boot/util';
import {TaskGroupService} from '../../../taskGroup/endpoint/task-group.service';
import {WorkOrderService} from '../../endpoint/work-order.service';
import {TaskGroupDto} from '../../../taskGroup/model/dto/taskGroupDto';
import {ActionMode} from '../../../formBuilder/fb-model/enumeration/enum/ActionMode';
import {DataService} from '../../../../shared/service/data.service';
import {WorkTableDto} from '../../../worktable/model/workTable';
import {WorkOrderRepositoryService} from '../../endpoint/work-order-repository.service';
import {ModalUtil} from "@angular-boot/widgets";
import {TokenRoleList} from "../../../../shared/shared/constants/tokenRoleList";
import {Auth} from "../../../../shared/constants/cacheKeys";
import {ActivatedRoute, Router} from "@angular/router";
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

declare var $: any;

@Component({
  selector: 'app-work-order-task-group',
  templateUrl: './work-order-task-group.component.html',
  styleUrls: ['./work-order-task-group.component.scss']
})
export class WorkOrderTaskGroupComponent implements OnInit, OnDestroy {

  @Input() workOrderId: string;
  @Input() modeW;
  @Input() formStatus: string;
  actionMode = ActionMode;
  taskGroupList: TaskGroupDto.Create[] = [];
  workOrderTaskGroupList: any[] = [];
  selectedTaskGroup: TaskGroupDto.Create = new TaskGroupDto.Create();
  workOrderAndFormRepository: WorkTableDto.ActivitySampleWorkOrderAndFormRepository;
  roleList = new TokenRoleList();
  MyModalSize = ModalSize;

  constructor(public taskGroupService: TaskGroupService,
              public workOrderRepositoryService: WorkOrderRepositoryService,
              public router: Router,
              public activatedRoute: ActivatedRoute,
              private cacheService: CacheService,
              public workOrderService: WorkOrderService) {
  }

  ngOnInit() {
    this.getAllTaskGroup();
    // this.getTaskGroupListWithWorkOrderId();
    this.getTaskGroupOfWorkOrder();
    this.getRoleListKey();

  }
  getRoleListKey() {
    this.cacheService.getItem(Auth.RoleListKey, CacheType.LOCAL_STORAGE).pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
      if (res) {
        this.roleList = res;
      }
    });
  }
  getTaskGroupListWithWorkOrderId() {
    this.workOrderService.getTaskGroupListByWorkOrderId({workOrderId: this.workOrderId}).pipe(takeUntilDestroyed(this))
      .subscribe((res: GetWOTG) => {
        if (res && res.taskGroups) {
          setTimeout( () => {
            this.workOrderTaskGroupList = res.taskGroups;
            for (let i = 0 ; i < this.workOrderTaskGroupList.length; i++) {
              this.workOrderTaskGroupList[i] = this.taskGroupList.find( e => e.id === this.workOrderTaskGroupList[i]);
            }
            this.filterTaskGroupList();
          }, 50);
        }
      });
  }
  getTaskGroupOfWorkOrder() {
    this.workOrderService.getTaskGroupOfWorkOrder(
        {workOrderId: this.workOrderId}).pipe(takeUntilDestroyed(this))
        .subscribe((res: any) => {
          if (res) {
            this.workOrderTaskGroupList = res;
            this.filterTaskGroupList();
          }
        });
  }
  getAllTaskGroup() {
    // this.taskGroupService.getAll().pipe(takeUntilDestroyed(this))
    this.taskGroupService.getAllForWorkTable().pipe(takeUntilDestroyed(this))
      .subscribe((res: TaskGroupDto.Create[]) => {
        if (res && res.length) {
          this.taskGroupList = res;
          this.filterTaskGroupList();
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
    const taskGroupIdList = [];
    for (const item of this.workOrderTaskGroupList) {
      taskGroupIdList.push(item.id);
    }
    this.workOrderService.updateTaskGroupListByWorkOrderId(taskGroupIdList,
      {workOrderId: this.workOrderId}).pipe(takeUntilDestroyed(this))
      .subscribe((res: any) => {
        if (res) {
          // =================================================================
          if (this.formStatus === 'pending') {
            this.workOrderAndFormRepository.taskGroupList = taskGroupIdList;
            DataService.setWAFRepository(this.workOrderAndFormRepository);
            if (!isNullOrUndefined(this.workOrderAndFormRepository.id)) {
              this.workOrderRepositoryService.update(this.workOrderAndFormRepository).pipe(takeUntilDestroyed(this)).subscribe(resTree => {
                if (resTree) {
                  DataService.setWAFRepository(this.workOrderAndFormRepository);
                }
              });
            } else if (isNullOrUndefined(this.workOrderAndFormRepository.id)) {
              this.workOrderRepositoryService.create(this.workOrderAndFormRepository).pipe(takeUntilDestroyed(this)).subscribe(resTow => {
                if (resTow) {
                  this.workOrderAndFormRepository.id = resTow;
                  DataService.setWAFRepository(this.workOrderAndFormRepository);
                }
              });
            }
          }
          // =================================================================
          DefaultNotify.notifySuccess('عملیات با موفقیت انجام شد.', '', NotiConfig.notifyConfig);
        } else {
          DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.', '', NotiConfig.notifyConfig);
        }
      });
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
  }

  selectedEntity = new TaskGroupDto.Create();
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
 }
