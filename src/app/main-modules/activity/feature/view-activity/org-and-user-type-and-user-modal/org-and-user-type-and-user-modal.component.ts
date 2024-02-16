import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DefaultNotify, ModalSize} from '@angular-boot/util';
import {ActivityLevel} from '../../../model/activityLevel';
import {isNullOrUndefined} from 'util';
import {ModalUtil} from '@angular-boot/widgets';
import {UserTypeService} from '../../../../securityManagement/endpoint/user-type.service';
import {ActivityService} from '../../../service/activity.service';
import {Activity} from '../../../model/activity';
import {OrganizationDto} from '../../../../basicInformation/organization/model/organizationDto';
import {OrganizationService} from '../../../../basicInformation/organization/endpoint/organization.service';
import {concat, Observable, of, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap, tap} from 'rxjs/operators';
import {NotiConfig} from "../../../../../shared/tools/notifyConfig";

@Component({
  selector: 'app-org-and-user-type-and-user-modal',
  templateUrl: './org-and-user-type-and-user-modal.component.html',
  styleUrls: ['./org-and-user-type-and-user-modal.component.scss']
})
export class OrgAndUserTypeAndUserModalComponent implements OnInit, OnChanges {
  @Input() modalId: string;
  @Input() activityLevel = new ActivityLevel();
  @Input() activity = new Activity();
  @Input() allOrganization: OrganizationDto.Create[];
  MyModalSize = ModalSize;
  userTypeListByOrg: any[] = [];
  userByUserTypeIdAndOrganizationId: any [] = [];
  organizationId: string;
  organizationList: OrganizationDto.Create[] = [];
  organizationList$: Observable<any[]>;
  organizationInput = new Subject<string>();
  organizationLoading = false;
  userTypeId: string;
  userId: string[];
  t = 0;

  constructor(public activityService: ActivityService,
              public organizationService: OrganizationService,
              public userTypeService: UserTypeService) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.allOrganization) {
      if (this.t !== 0) {
        if (this.allOrganization.length > 0) {
          this.loadingOrganization();
        } else {
          DefaultNotify.notifyDanger('ابتدا سازمان ثبت کنید.', '', NotiConfig.notifyConfig);
        }
      }
      this.t = this.t + 1;
    }

    if (changes.activityLevel) {
      this.getPostByOrganizationId();
    }
  }


  getPostByOrganizationId() {
    if (this.t > 1) {
      this.organizationId = this.activityLevel.organizationId;
      this.userTypeListByOrg = [];
      this.userByUserTypeIdAndOrganizationId = [];
      if (this.activityLevel.organizationId) {
        this.userTypeService.getAllUserTypesOfThOrganization({organizationId: this.activityLevel.organizationId})
          .subscribe(res => {
            if (!isNullOrUndefined(res)) {
              ModalUtil.showModal('UserTypeModal');
              this.userTypeListByOrg = res;
              this.setUserTypeDetails(this.activityLevel.userTypeId, this.organizationId);

            }
          });
      }
    } else {
      setTimeout(() => {
      this.getPostByOrganizationId();
      }, 50);
    }
  }

  setUserTypeDetails(userTypeId, orgId) {
    // =============در این جا فرض براین است  کاربر ثابت فقط یک نفر میتواند باشد
    if (this.activityLevel.candidateUserIdList) {
      if (this.activityLevel.candidateUserIdList.length > 0) {
        this.userId = this.activityLevel.candidateUserIdList;
      }
    } else if (this.activityLevel.assignedUserId ) {
      this.userId.push(this.activityLevel.assignedUserId);
    }

    // ========================================================================
    this.userTypeId = userTypeId;
    this.activityService.getUserByUserTypeIdAndOrganizationId({userTypeId, organizationId: orgId})
      .subscribe(res => {
        if (!isNullOrUndefined(res)) {
          this.userByUserTypeIdAndOrganizationId = res;
        }
      });
  }

  checkNextLevels() {
    for (const level of this.activity.activityLevelList) {
      if (!level.nextActivityLevel) {
        level.nextActivityLevel = new ActivityLevel();
      }
      if (this.activityLevel.id === level.nextActivityLevel.id && (level.rightToChoose || level.existRecipientOrderUser)) {
        return true;
      }
    }
    return false;
  }

  loadingOrganization() {
    this.organizationList$ = concat(
      of(this.organizationList), // default items
      this.organizationInput.pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap(() => this.organizationLoading = true),
        switchMap(term =>
          this.organizationService.getAll().pipe(
            tap(() => this.organizationLoading = false),
          )
        )
      )
    );
  }
}
