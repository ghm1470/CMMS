import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {MyPattern} from '../../../../shared/shared/tools/myPattern';
import {WorkOrderDto} from '../../model/dto/workOrderDto';
import {ActionMode, isNullOrUndefined} from '@angular-boot/util';
import {UserDto} from '../../../user/model/dto/user-dto';
import {WorkTableDto} from '../../../worktable/model/workTable';
import {WorkOrderService} from '../../endpoint/work-order.service';
import {WorkOrderRepositoryService} from '../../endpoint/work-order-repository.service';
import {UserService} from '../../../user/endpoint/user.service';
import {takeUntilDestroyed} from '@angular-boot/core';
import {
  SendInformationNumberOfTabs,
  SendUser
} from '../../../worktable/feature/show-the-trend-here/show-the-form-of-previous-steps/show-the-form-of-previous-steps.component';
import {Moment} from "../../../../shared/shared/tools/date/moment";

@Component({
  selector: 'app-work-order-basic-info-work-tview',
  templateUrl: './work-order-basic-info-work-tview.component.html',
  styleUrls: ['./work-order-basic-info-work-tview.component.scss']
})
export class WorkOrderBasicInfoWorkTViewComponent implements OnInit, OnDestroy, OnChanges {
  @Input() workOrderBasicInformation = new WorkOrderDto.WorkOrderBasicInformationDTO();
  @Output() nextCarousel = new EventEmitter<boolean>();
  @Input() sendInformationNumberOfTabs = new SendInformationNumberOfTabs();
  @Input() sendUser: SendUser;

  myPattern = MyPattern;
  myMoment = Moment;
  actionMode = ActionMode;

  userList: UserDto.Create[] = [];
  user = new UserDto.Create();
  readUserService = false;


  constructor(public workOrderService: WorkOrderService,
              public workOrderRepositoryService: WorkOrderRepositoryService,
              public userService: UserService) {
  }

  ngOnInit() {
    // this.getAllUser();
  }


  getAllUser() {
    this.userService.getAll().pipe(takeUntilDestroyed(this))
      .subscribe((res: UserDto.Create[]) => {
        if (res && res.length > 0) {
          this.userList = res;
        }
        this.readUserService = true;
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.sendInformationNumberOfTabs) {
    }
    if (changes.workOrderBasicInformation) {
      if (!isNullOrUndefined(this.workOrderBasicInformation)) {
        this.getUser();
      } else {
        this.workOrderBasicInformation = new WorkOrderDto.WorkOrderBasicInformationDTO();
      }
    }
  }
  getUser() {
    if (this.readUserService) {
      if (!isNullOrUndefined(this.workOrderBasicInformation.completedUserId)) {
        this.user = this.userList.find(e => e.id === this.workOrderBasicInformation.completedUserId);
        this.user.userType.name = '/' + this.user.userType.name ;
      } else {
        this.user = new UserDto.Create();
      }
    } else {
      setTimeout(() => {
        this.getUser();
      }, 50);
    }
  }
}
