import {AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {MyPattern} from '../../../../shared/shared/tools/myPattern';
import {takeUntilDestroyed} from '@angular-boot/core';
import {ActionMode, DefaultNotify, isNullOrUndefined, PageContainer, Paging, Toolkit2} from '@angular-boot/util';
import {WorkOrderDto} from '../../model/dto/workOrderDto';
import {UserDto} from '../../../user/model/dto/user-dto';
import {WorkOrderService} from '../../endpoint/work-order.service';
import {UserService} from '../../../user/endpoint/user.service';
import WorkOrderBasicInformation = WorkOrderDto.WorkOrderBasicInformation;
import {DataService} from '../../../../shared/service/data.service';
import {WorkTableDto} from '../../../worktable/model/workTable';
import {WorkOrderRepositoryService} from '../../endpoint/work-order-repository.service';
import {GetOrg, GetUser, UserType} from '../../../asset/feature/user-list-for-asset/user-list-for-asset.component';
import {OrganizationService} from '../../../basicInformation/organization/endpoint/organization.service';
import {UserTypeService} from '../../../securityManagement/endpoint/user-type.service';
import {ActivityService} from '../../../activity/service/activity.service';
import {Moment} from "../../../../shared/shared/tools/date/moment";
import {AssetTemplatePersonnelDTO, AssignedToGroup} from "../../../assetTemplate/endpoint/asset-template.service";
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

declare var $: any;

@Component({
    selector: 'app-work-order-basic-information',
    templateUrl: './work-order-basic-information.component.html',
    styleUrls: ['./work-order-basic-information.component.scss']
})
export class WorkOrderBasicInformationComponent implements OnInit, OnChanges, OnDestroy {

    @Input() workOrderId: string;
    @Input() modeW;
    @Input() formStatus: string;

    myPattern = MyPattern;
    myMoment = Moment;
    workOrderBasicInformation = new WorkOrderDto.WorkOrderBasicInformation();
    workOrderBasicInformationCopy = new WorkOrderDto.WorkOrderBasicInformation();
    actionMode = ActionMode;

    userList: GetUser[] = [];
    userListCopy: GetUser[] = [];
    doSave = false;
    disabledButton = false;
    organizationList: GetOrg[] = [];
    userTypeList: UserType[] = [];
    userTypeListCopy: UserType[] = [];
    withoutUserType = false;
    withoutUser = false;
    receiveGetAllUserTypeRes = false;

    constructor(public workOrderService: WorkOrderService,
                public workOrderRepositoryService: WorkOrderRepositoryService,
                public organizationService: OrganizationService,
                public userTypeService: UserTypeService,
                public activityService: ActivityService,
                public userService: UserService) {
        // this.workOrderBasicInformation.userAssignedId = '-1';
    }

    ngOnInit() {
        // this.getOrganization();
        this.getAllUserType();
        if (this.workOrderId) {
            this.getBasicInformationByAssetId();
        }
    }

    ngOnChanges() {
    }

    getOrganization() {
        this.organizationService.getAllOrganizationName().pipe(takeUntilDestroyed(this))
            .subscribe(res => {
                if (res) {
                    this.organizationList = res;
                }
            });

    }

    //
    // getAllUserType() {
    //   this.workOrderBasicInformation.completedUserUserTypeId = new WorkOrderDto.WorkOrderBasicInformation().completedUserUserTypeId;
    //   this.userTypeListCopy = [];
    //   this.userTypeList = [];
    //   this.workOrderBasicInformation.completedUserId = new WorkOrderDto.WorkOrderBasicInformation().completedUserId;
    //   this.userList = [];
    //   this.userListCopy = [];
    //     // if (!isNullOrUndefined(this.workOrderBasicInformation.completedUserOrgId)) {
    //       this.userTypeService.getAllRole()
    //         .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
    //         
    //         if (!isNullOrUndefined(res)) {
    //           this.userTypeListCopy = JSON.parse(JSON.stringify(res));
    //           this.userTypeList = res;
    //           this.withoutUserType = false;
    //           this.receiveGetAllUserTypeRes = true;
    //         } else {
    //           this.withoutUserType = true;
    //         }
    //       });
    //     // }
    // }
    //
    // getAllUser(event?) {
    //   this.userList = [];
    //   this.userListCopy = [];
    //   this.workOrderBasicInformation.completedUserId = new WorkOrderDto.WorkOrderBasicInformation().completedUserId;
    //     if (!isNullOrUndefined(this.workOrderBasicInformation.completedUserUserTypeId)) {
    //       this.activityService.getUserByUserTypeIdAndOrganizationId({
    //         organizationId: this.workOrderBasicInformation.completedUserOrgId, userTypeId:
    //         this.workOrderBasicInformation.completedUserUserTypeId
    //       }).pipe(takeUntilDestroyed(this))
    //         .subscribe((res) => {
    //           if (res && res.length) {
    //             this.userList = res;
    //             this.withoutUser = false;
    //             this.userListCopy = JSON.parse(JSON.stringify(res));
    //           } else {
    //             this.withoutUser = true;
    //           }
    //         });
    //     }
    // }
    //
    //


    ///// کاربر
    userTypeList2: UserType[] = [];
    loadingUserTypeList2 = true;
    selectedUserTypeId2: string;
    userList2: UserDto.Create[] = [];
    loadingUserList2 = false;

    allowGetAllUserType = true;
    assetTemplateUsers: AssetTemplatePersonnelDTO[] = [];
    assignedToGroupList: AssignedToGroup[] = [];

    getAllUserType() {
        if (this.allowGetAllUserType) {
            this.loadingUserTypeList2 = true;
            this.allowGetAllUserType = false;
            this.userTypeService.getAllRole()
                .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
                this.loadingUserTypeList2 = false;
                if (!isNullOrUndefined(res)) {
                    this.userTypeList2 = res;
                }
            });
        }
    }

    changeUserType(event: UserType) {
        this.workOrderBasicInformation.userAssignedId = null;
        this.userList2 = [];
        if (event) {
            // this.selectedUserTypeId2 = event.id;
            this.getAllUsersOfUserType();
        }

    }

    getAllUsersOfUserType() {
        const paging = new Paging();
        paging.size = 15;
        this.loadingUserList2 = true;
        this.userService.getAllUsersOfUserType({
            paging, totalElements: 0,
            userTypeId: this.workOrderBasicInformation.userAssignedUserTypeId
        })
            .pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<UserDto.Create>) => {
            this.loadingUserList2 = false;
            if (this.userList2.length === 0) {
                this.userList2 = res.content;
            } else {
                this.userList2 = this.userList2.concat(res.content);
            }
            // this.userList2 = this.userList2.filter(u => u.id !== this.userId);

        }, error => {
            this.loadingUserList2 = false;
        });
    }

///// !!!کاربر


    getBasicInformationByAssetId() {
        this.workOrderService.getBasicInformationByWorkOrderId({workOrderId: this.workOrderId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: WorkOrderBasicInformation) => {
            
            if (!isNullOrUndefined(res)) {
                setTimeout(() => {
                    this.workOrderBasicInformation = res;
                    this.workOrderBasicInformationCopy = JSON.parse(JSON.stringify(res));
                    if (this.workOrderBasicInformation.completedUserUserTypeId) {
                        this.getAllUsersOfUserType();
                    }
                }, 50);
            }
        });
    }

    ngOnDestroy(): void {
    }

    action(workOrderBasicInformationForm) {
        this.doSave = true;
        if (workOrderBasicInformationForm.invalid) {
            DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            return;
        }
        this.workOrderService.updateWorkOrderBasicInformation(this.workOrderBasicInformation, {workOrderId: this.workOrderId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            
            if (res) {
                // =================================================================
                // =================================================================
                DefaultNotify.notifySuccess('تغییرات با موفقیت ثبت شد.', '', NotiConfig.notifyConfig);
            } else {
                DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.', '', NotiConfig.notifyConfig);
            }
        });
    }
}
