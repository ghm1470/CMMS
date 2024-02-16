import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {Notify} from '../notify/model/notify';
import {ActionMode, DefaultNotify, isNullOrUndefined} from '@angular-boot/util';
import {MyPattern} from '../../../../shared/shared/tools/myPattern';
import {EnumObject} from '../../../../_base/utility/enum/enum-object';
import {UserDto} from '../../../user/model/dto/user-dto';
import {WorkTableDto} from '../../../worktable/model/workTable';
import {NotifyService} from '../../endpoint/notify.service';
import {UserService} from '../../../user/endpoint/user.service';
import {WorkOrderRepositoryService} from '../../endpoint/work-order-repository.service';
import {ActivatedRoute, Router} from '@angular/router';
import {EnumHandle} from '../../../../_base/utility/enum/enum-handle';
import {NotifyEvent} from '../notify/model/notifyEvent';
import {DataService} from '../../../../shared/service/data.service';
import {takeUntilDestroyed} from '@angular-boot/core';
import {ModalUtil} from '@angular-boot/widgets';
import {SendInformationNumberOfTabs} from '../../../worktable/feature/show-the-trend-here/show-the-form-of-previous-steps/show-the-form-of-previous-steps.component';

@Component({
  selector: 'app-notify-work-tview',
  templateUrl: './notify-work-tview.component.html',
  styleUrls: ['./notify-work-tview.component.scss']
})
export class NotifyWorkTViewComponent implements OnInit, OnDestroy, OnChanges {
  @Input() workOrderId: string;
  @Input() notifyList: Notify[] = [];
  @Input() existedAlreadySaveForWAR: boolean;
  @Output() nextCarousel = new EventEmitter<boolean>();
  @Input() sendInformationNumberOfTabs = new SendInformationNumberOfTabs();
  notify: Notify;
  selectedIndex: number;
  actionMode = ActionMode;
  mode = ActionMode.ADD;
  myPattern = MyPattern;
  doSave = false;
  notifyEventList = [] as EnumObject[];
  userList: UserDto.Create[] = [];
  workOrderAndFormRepository: WorkTableDto.ActivitySampleWorkOrderAndFormRepository;
  loading = false;

  constructor(public userService: UserService,
              public workOrderRepositoryService: WorkOrderRepositoryService,
              public activatedRoute: ActivatedRoute,
              public router: Router) {
    this.notifyEventList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<NotifyEvent>(NotifyEvent));
    this.notify = new Notify(this.workOrderId);
  }

  ngOnInit() {
  }



  getUserList() {
    this.userService.getAll().pipe(takeUntilDestroyed(this))
      .subscribe((res: UserDto.Create[]) => {
        if (res && res.length) {
          this.userList = res;
        }
      });
  }

  ngOnDestroy(): void {
  }




  cancelModal() {
    ModalUtil.hideModal('notifyModal');
  }

  checkNotify(item) {
    if (this.notify.events.indexOf(item._value) === -1) {
      this.notify.events.push(item._value);
    } else {
      this.notify.events = this.notify.events.filter(event => event !== item._value);
    }
  }

  addUserToNotify() {
    if (!isNullOrUndefined(this.notify.user.id)) {
      this.notify.user.name = this.userList.find(user => user.id === this.notify.user.id).name;
      this.notify.user.family = this.userList.find(user => user.id === this.notify.user.id).family;
    }
  }

  checkNotifyChecked(value: any) {
    if (this.notify.events.indexOf(value) === -1) {
      return false;
    }
    return true;
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
    if (changes.notifyList) {
      if (isNullOrUndefined(this.notifyList)) {
        this.notifyList = [];
      } else  if (!isNullOrUndefined(this.notifyList)) {
        this.getUserList();
      }
    }
  }
}
