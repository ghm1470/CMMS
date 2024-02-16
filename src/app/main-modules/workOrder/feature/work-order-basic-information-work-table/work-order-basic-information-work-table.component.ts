import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {MyPattern} from '../../../../shared/shared/tools/myPattern';
import {WorkOrderDto} from '../../model/dto/workOrderDto';
import {ActionMode, DefaultNotify, isNullOrUndefined, PageContainer, Paging} from '@angular-boot/util';
import {UserDto} from '../../../user/model/dto/user-dto';
import {WorkOrderService} from '../../endpoint/work-order.service';
import {WorkOrderRepositoryService} from '../../endpoint/work-order-repository.service';
import {UserService} from '../../../user/endpoint/user.service';
import {DataService} from '../../../../shared/service/data.service';
import {takeUntilDestroyed} from '@angular-boot/core';
import {SendInformationNumberOfTabs} from
        '../../../worktable/feature/show-the-trend-here/show-the-form-of-previous-steps/show-the-form-of-previous-steps.component';
import WorkOrderBasicInformation = WorkOrderDto.WorkOrderBasicInformation;
import {Moment} from "../../../../shared/shared/tools/date/moment";
import {AssetTemplatePersonnelDTO, AssignedToGroup} from "../../../assetTemplate/endpoint/asset-template.service";
import {UserType} from "../../../securityManagement/model/userType";
import {UserTypeService} from "../../../securityManagement/endpoint/user-type.service";
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

@Component({
    selector: 'app-work-order-basic-information-work-table',
    templateUrl: './work-order-basic-information-work-table.component.html',
    styleUrls: ['./work-order-basic-information-work-table.component.scss']
})
export class WorkOrderBasicInformationWorkTableComponent implements OnInit, OnDestroy, OnChanges {
    @Input() staticFormsIdList: string[] = [];
    @Input() workOrderId: string;
    @Input() activityInstanceId: string;
    @Input() activityLevelId: string;
    @Input() isView: boolean;
    @Input() sendInformationNumberOfTabs = new SendInformationNumberOfTabs();
    @Input() numberOfParticipation: number;
    @Output() nextCarousel = new EventEmitter<boolean>();

    existedAlreadySaveForWAR: boolean;
    myPattern = MyPattern;
    myMoment = Moment;
    workOrderBasicInformation = new WorkOrderBasicInformation();
    workOrderBasicInformationCopy = new WorkOrderBasicInformation();
    actionMode = ActionMode;

    userList: UserDto.Create[] = [];
    user = new UserDto.Create();
    doSave = false;
    disabledButton = false;

    constructor(public workOrderService: WorkOrderService,
                public workOrderRepositoryService: WorkOrderRepositoryService,
                public userTypeService: UserTypeService,
                public userService: UserService) {
    }

    enableItems = false;

    ngOnInit() {
        if (this.staticFormsIdList) {
            if (this.staticFormsIdList.some(id => id === 'basicInformation')) {
                this.enableItems = true;
            }
        }
        DataService.getExistedAlreadySaveForWAR.subscribe((res: boolean) => {
            if (res) {
                this.existedAlreadySaveForWAR = res;
            }
        });
        // this.getAllUser();
        this.getAllUserType();
        if (this.workOrderId) {
            this.getBasicInformationByAssetId();
        }
    }


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

    loading = false;

    getBasicInformationByAssetId() {
        this.workOrderService.getBasicInformationByWorkOrderId({workOrderId: this.workOrderId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: WorkOrderBasicInformation) => {
            
            this.loading = false;
            if (!isNullOrUndefined(res)) {
                setTimeout(() => {
                    this.workOrderBasicInformation = res;
                    if (this.workOrderBasicInformation.userAssignedUserTypeId) {
                        this.getAllUsersOfUserType();
                    }
                    if (res.completedUserId) {
                        this.user = this.userList2.find(e => e.id === res.completedUserId);
                    }
                    this.workOrderBasicInformationCopy = JSON.parse(JSON.stringify(res));
                }, 50);
            }
        }, error => {
            this.loading = false;
        });
    }

    ngOnDestroy(): void {
    }

    action(workOrderBasicInformationForm) {
        this.doSave = true;

        // if (workOrderBasicInformationForm.invalid) {
        //     DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.');
        //     return;
        // }
        if (!this.workOrderBasicInformation.userAssignedId) {
            DefaultNotify.notifyDanger('کاربر برای تخصیص  را انتخاب کنید.', '', NotiConfig.notifyConfig);
            return;
        }
        // this.workOrderService.updateWorkOrderBasicInformation(this.workOrderBasicInformation, {workOrderId: this.workOrderId})
        //   .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
        //   if (res) {
        // =================================================================
        // this.workOrderAndFormRepository.workOrderBasicInformation = this.workOrderBasicInformation;
        // DataService.setWAFRepository(this.workOrderAndFormRepository);
        // =================ثبت کردن در ریپاسیتوری
        if ((!this.existedAlreadySaveForWAR)) {
            this.workOrderRepositoryService.createBasicInformation(this.workOrderBasicInformation,
                {
                    activityInstanceId: this.activityInstanceId,
                    workOrderId: this.workOrderId,
                    activityLevelId: this.activityLevelId, numberOfParticipation: this.numberOfParticipation
                })
                .pipe(takeUntilDestroyed(this)).subscribe(resOne => {
                if (resOne) {
                    DefaultNotify.notifySuccess('تغییرات با موفقیت ثبت شد.', '', NotiConfig.notifyConfig);
                    DataService.setExistedAlreadySaveForWAR(true);
                    this.workOrderBasicInformationCopy = JSON.parse(JSON.stringify(this.workOrderBasicInformation));
                }
            });
        } else if (this.existedAlreadySaveForWAR) {
            if (JSON.stringify(this.workOrderBasicInformationCopy) === JSON.stringify(this.workOrderBasicInformation)) {
                DefaultNotify.notifyDanger('تغییراتی اعمال نشده است.', '', NotiConfig.notifyConfig);
                return;
            }
            this.workOrderRepositoryService.updateBasicInformation(this.workOrderBasicInformation,
                {
                    activityInstanceId: this.activityInstanceId,
                    workOrderId: this.workOrderId,
                    activityLevelId: this.activityLevelId,
                    numberOfParticipation: this.numberOfParticipation
                })
                .pipe(takeUntilDestroyed(this)).subscribe(resTow => {
                if (resTow) {
                    this.workOrderBasicInformationCopy = JSON.parse(JSON.stringify(this.workOrderBasicInformation));
                    DefaultNotify.notifySuccess('تغییرات با موفقیت ویرایش شد.', '', NotiConfig.notifyConfig);
                }
            });
        }
        // =================================================================
        // } else {
        //   DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.');
        // }
        // });
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
        if (changes.basicInformationDTO) {
            this.getBasicInformationByAssetId();
        }
    }
}
