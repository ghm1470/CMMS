import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {ActionMode, DefaultNotify, isNullOrUndefined} from '@angular-boot/util';
import {EnumObject} from '../../../../../../_base/utility/enum/enum-object';
import {WorkTableDto} from '../../../../../worktable/model/workTable';
import {TaskService} from '../../endpoint/task.service';
import {WorkOrderRepositoryService} from '../../../../../workOrder/endpoint/work-order-repository.service';
import {ActivatedRoute, Router} from '@angular/router';
import {EnumHandle} from '../../../../../../_base/utility/enum/enum-handle';
import {DataService} from '../../../../../../shared/service/data.service';
import {takeUntilDestroyed} from '@angular-boot/core';
import {ModalUtil} from '@angular-boot/widgets';
import {TaskGroupDto} from '../../../../model/dto/taskGroupDto';
import Task = TaskGroupDto.Task;
import TaskType = TaskGroupDto.TaskType;
import {WorkOrderDto} from '../../../../../workOrder/model/dto/workOrderDto';
import {SendInformationNumberOfTabs} from '../../../../../worktable/feature/show-the-trend-here/show-the-form-of-previous-steps/show-the-form-of-previous-steps.component';

@Component({
  selector: 'app-list-work-table-view',
  templateUrl: './list-work-table-view.component.html',
  styleUrls: ['./list-work-table-view.component.scss']
})
export class ListWorkTableViewComponent implements OnInit, OnDestroy, OnChanges {

  @Input() taskList: Task[] = [];
  @Input() workOrderId: string;
  @Input() sendInformationNumberOfTabs = new SendInformationNumberOfTabs();
  @Output() nextCarousel = new EventEmitter<boolean>();
  task = new Task();
  totalElements = 0;
  actionMode = ActionMode;
  taskId: string;
  metringIndex: number;
  modeView: ActionMode = ActionMode.ADD;
  sendTaskForEdit = new Task();
  showAddTask = false;
  taskTypeList = [] as EnumObject[];
  workOrderAndFormRepository: WorkTableDto.ActivitySampleWorkOrderAndFormRepository;

  constructor(public workOrderRepositoryService: WorkOrderRepositoryService,
              public activatedRoute: ActivatedRoute,
              public router: Router) {
    this.taskTypeList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<TaskType>(TaskType));
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }


  cancelModal() {
    ModalUtil.hideModal('budgetAllocatedModal');
  }

  chooseSelectedItemForView(item: Task) {
    this.taskId = item.id;
    this.sendTaskForEdit = JSON.parse(JSON.stringify(item));
    this.modeView = ActionMode.VIEW;
    this.showAddTask = true;
    setTimeout(() => {
      ModalUtil.showModal('taskModal');
    }, 200);
  }

  nextOrPrev(item) {
    if (item === 'next') {
      this.nextCarousel.emit(true);
    }
    if (item === 'prev') {
      this.nextCarousel.emit(false);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.sendInformationNumberOfTabs) {
      console.log('sendInformationNumberOfTabs===>', this.sendInformationNumberOfTabs);
    }
    if (changes.taskList) {
      if (isNullOrUndefined(this.taskList)) {
       this.taskList = [];
      }
    }
  }
}

