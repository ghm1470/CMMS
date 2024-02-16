import {Component, OnDestroy, OnInit} from '@angular/core';
import {DateViewMode} from '../../../../shared/tools/date-view-mode.enum';
import {UserDto} from '../../../user/model/dto/user-dto';
import { WorkTableDto} from '../../../worktable/model/workTable';
import {WorkRequestDto} from '../../../submitWorkRequest/model/work-request-dto';
import {ModalSize, Toolkit2} from '@angular-boot/util';
import {ModalUtil} from '@angular-boot/widgets';
import {Toolkit} from '../../../formBuilder/shared/utility/toolkit';
import {ActivityService} from '../../../activity/service/activity.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {WorkOrderRepositoryService} from '../../../workOrder/endpoint/work-order-repository.service';
import {WorkRequestService} from '../../../submitWorkRequest/endpoint/work-request.service';
import {takeUntilDestroyed} from '@angular-boot/core';
import {isNullOrUndefined} from 'util';
import ActionLevel = WorkTableDto.ActionLevel;
import GetAllActivityLevel = WorkTableDto.GetAllActivityLevel;
import NextActivityLevel = WorkTableDto.NextActivityLevel;

@Component({
  selector: 'app-work-table-history-action',
  templateUrl: './work-table-history-action.component.html',
  styleUrls: ['./work-table-history-action.component.scss']
})
export class WorkTableHistoryActionComponent implements OnInit, OnDestroy {
  dateViewMode = DateViewMode;
  user: UserDto.Create = new UserDto.Create();
  selectedActivity = new WorkTableDto.GetAllActivityLevel();
  ActivityLevelListSortSequenceList: WorkTableDto.Sequence[] = [];
  workRequestForm = new WorkRequestDto.ShowForm();
  activityInstanceId: string;
  sequenceList: WorkTableDto.Sequence[] = [];
  sequenceListCopy: WorkTableDto.Sequence[] = [];
  formId: string;
  formTitle: any;
  formIdList: string[] = [];
  activityLevelId: string;
  formStatus: string;
  MyModalSize = ModalSize;
  modalId = ModalUtil.generateModalId();
  workOrderId: string;
  MyToolkit = Toolkit;
  MyToolkit2 = Toolkit2;
  sendUser = new SendUser();
  state: string;

  showWorkRequestModal = false;
  ShowTheFormOfPreviousStepsModal = false;
  activityLevelList: GetAllActivityLevel[] = [];
  activityLevelListCopy: GetAllActivityLevel[] = [];
  numberOfParticipation = 1;
  workOrderAndFormRepository = new WorkTableDto.ActivitySampleWorkOrderAndFormRepository();
  workOrderAndFormRepositoryId: string;
  fromSchedule = false;
  showProcessStepsModal = false;
  workRequestTitle: string;
  doSave = false;
  workOrderAccessId: string;
  middleLevel = new GetAllActivityLevel();
  nextActivityLevel = new NextActivityLevel();


  userId: string;
  userByUserTypeIdAndOrganizationId: any[] = [];
  loading = false;

  constructor(private  activityService: ActivityService,
              public activatedRoute: ActivatedRoute,
              public location: Location,
              public workOrderRepositoryService: WorkOrderRepositoryService,
              private workRequestService: WorkRequestService,
              private router: Router) {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.activityInstanceId = this.activatedRoute.snapshot.queryParams.activityInstanceId;
    this.state = this.activatedRoute.snapshot.queryParams.state;
  }

  ngOnInit() {
    this.loading = true;
    this.getAllPendingAndActiveActivityLevel();
      }

  ngOnDestroy(): void {
  }

  /// دریافت مراحل فرآیند/////
  getAllPendingAndActiveActivityLevel() {
    this.activityService.getPendingAndActiveActivityLevelByInstanceId(
      {activityInstanceId: this.activityInstanceId}).pipe(takeUntilDestroyed(this))
      .subscribe((res: any) => {
        if (res) {
          this.workRequestTitle = res.workRequestTitle;
          this.workOrderId = res.workOrderId;
          this.fromSchedule = res.fromSchedule;
          if (!res.fromSchedule) {
            this.getFormWorkRequest();
          }
          this.activityLevelList = res.activityLevelDTOList;
          this.activityLevelListCopy = JSON.parse(JSON.stringify(res.activityLevelDTOList || null ));

          const startLevel = new WorkTableDto.Sequence();
          const endLevel = new WorkTableDto.Sequence();
          const pendingLevel = new WorkTableDto.Sequence();
          //////// لیست ترتیب قرار گیری نمایش تاریخچه مراحل//
          this.sequenceList = res.activityLevelSequenceHistory;
          this.sequenceListCopy = JSON.parse(JSON.stringify(res.activityLevelSequenceHistory));
          // ////// پیدا کردن start و pending و end
          for (const item of this.activityLevelListCopy) {
            if (item.id === 'start') {
              startLevel.ActivityLevel = item;
              startLevel.status = 'start';
            }
            if (item.id === 'end') {
              endLevel.ActivityLevel = item;
              endLevel.status = 'end';
            }
            if (item.actionLevel.toString() === 'pending') {
              pendingLevel.ActivityLevel = JSON.parse(JSON.stringify(item));
              pendingLevel.status = JSON.parse(JSON.stringify('pending'));
            }
          }

          /////// پیدا کردن مراحل میانی که قبلا تایید یا رد شده اند
          for (const sequence of this.sequenceList) {
            const middleLevel = JSON.parse(JSON.stringify(this.activityLevelList.filter(e => e.id === sequence.levelId)));
            let selectedSequence: WorkTableDto.Sequence;
            selectedSequence = JSON.parse(JSON.stringify(sequence));
            selectedSequence.ActivityLevel = middleLevel;
            selectedSequence.ActivityLevel.actionLevel = selectedSequence.status.toString() as unknown as ActionLevel;
            this.ActivityLevelListSortSequenceList.push(selectedSequence);
          }

          ///// قرار گیری مراحل برای نمایش /
          if (!isNullOrUndefined(pendingLevel)) {
            this.ActivityLevelListSortSequenceList.push(pendingLevel);
            this.numberOfParticipation = this.ActivityLevelListSortSequenceList.findIndex(e => e.status === 'pending') + 1;
          }
          if (isNullOrUndefined(pendingLevel)) {
            this.ActivityLevelListSortSequenceList.push(endLevel);
          }
          this.loading = false;
        }
      });
  }

  setFormId(activity, index, status) {
    if (status !== 'pending') {
      this.numberOfParticipation = index + 1;
      this.selectedActivity = activity;
      this.sendUser.username = this.selectedActivity.username;
      this.sendUser.userFamilyName = this.selectedActivity.userFamilyName;
      this.activityLevelId = this.selectedActivity.id;
      this.formStatus = activity.actionLevel;
      this.workOrderAccessId = this.selectedActivity.workOrderAccessId;
      this.formIdList = this.selectedActivity.staticFormsIdList;
      this.ShowTheFormOfPreviousSteps();
    }
  }


  getFormWorkRequest() {
    this.workRequestService.getWorkRequestForm(
      {instanceId: this.activityInstanceId}).pipe(takeUntilDestroyed(this))
      .subscribe((res: WorkRequestDto.ShowForm) => {
        if (res) {
          this.workRequestForm = res;
        }
      });
  }

  cancel() {
    this.location.back();
  }

  showFormWorkRequest(item: WorkRequestDto.ShowForm) {
    this.showWorkRequestModal = true;
    setTimeout(() => {
      ModalUtil.showModal('showWorkRequestModal');
    }, 50);
  }
  ShowTheFormOfPreviousSteps() {
    this.ShowTheFormOfPreviousStepsModal = true;
    setTimeout(() => {
      ModalUtil.showModal('ShowTheFormOfPreviousStepsModal');
    }, 50);
  }

  goToMessageForCurrentStepModal(item , i) {
    ModalUtil.showModal('goToMessageForCurrentStepModal');
  }
}

export class SendUser {
  userTypeTitle: string;
  username: string;
  userFamilyName: string;
}


export class ThisSequence {
  levelId: string;
  status: string;
  ActivityLevel: GetAllActivityLevel;
  dateViewMode: any;
  levelEndDate: any;
  workOrderId: string;
  ActivityLevelTitle: string;
  ActivityLevelUserTypeTitle: string;
  ActivityLevelUsername: string;
  ActivityLevelUserFamilyName: string;
  ActivityLevelNextActivityLevel: string;
  ActivityLevelPendingDate: any;
}
