import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ActivityService} from '../../../activity/service/activity.service';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {WorkTableDto} from '../../model/workTable';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalUtil} from '@angular-boot/widgets';
import {DefaultNotify, ModalSize} from '@angular-boot/util';
import {isNullOrUndefined} from 'util';
import {Location} from '@angular/common';
import {WorkOrderRepositoryService} from '../../../workOrder/endpoint/work-order-repository.service';
import {WorkOrderService} from '../../../workOrder/endpoint/work-order.service';
import {DataService} from '../../../../shared/service/data.service';
import {SendInformationNumberOfTabs} from '../show-the-trend-here/show-the-form-of-previous-steps/show-the-form-of-previous-steps.component';
import {WorkOrderDto} from '../../../workOrder/model/dto/workOrderDto';
import {CompanyDto} from '../../../company/model/dto/companyDto';
import {CandidateMode} from '../../../activity/model/activityLevel';
import {NotiConfig} from "../../../../shared/tools/notifyConfig";
import {RequestType} from "../list/worktable-list.component";

declare var $: any;

@Component({
    selector: 'app-worktable-action',
    templateUrl: './worktable-action.component.html',
    styleUrls: ['./worktable-action.component.scss']
})
export class WorktableActionComponent implements OnInit, OnDestroy, AfterViewInit {
    formIdList: string[] = [];
    workOrderDTO = new WorkOrderDto.Create();
    taskGroupDTO: string [] = [];
    // reportsDTO = false;
    fileDTO: CompanyDto.DocumentFile[] = [];
    // ==============
    workOrder = false;
    basicInformation = false;
    completionDetails = false;
    tasks = false;
    taskGroup = false;
    parts = false;
    miscCost = false;
    notification = false;
    reports = false;
    file = false;
    formComplete = false;
    numberOfFormIdList = 0;
    numberOfParticipation: number;
    staticFormAndDynamicForm = new PendingUserDetailsDTO();
    formTitle: string;
    workOrderAndFormRepository = new WorkTableDto.ActivitySampleWorkOrderAndFormRepository();
    showProcessStepsModal = false;
    MyModalSize = ModalSize;
    loadingModalReject = false;
    setUserModalId = ModalUtil.generateModalId();
    userId: string[];
    userByUserTypeIdAndOrganizationId: UserForNextLevel[] = [];
    sendInformationNumberOfTabs = new SendInformationNumberOfTabs();
    orgNameAndUserTypeNameForNextLevel = new UserIdAndUserTypeIdDTO();
    selectAllUserBoolean = true;
    chooseNextActivityLevelUserClass = new ChooseNextActivityLevelUserClass();


    @Input() workOrderId: string;
    @Input() activityLevelId: string;
    @Input() activityInstanceId: string;
    @Input() selectedRequestType: RequestType;
    @Input() workRequestAcceptor: boolean;
    @Input() isView: boolean;
    @Output() back = new EventEmitter<any>();
    @Output() edit = new EventEmitter<any>();

    constructor(public location: Location,
                public activatedRoute: ActivatedRoute,
                public workOrderService: WorkOrderService,
                private  activityService: ActivityService,
                private  workOrderRepositoryService: WorkOrderRepositoryService,
                private cacheService: CacheService,
                public router: Router) {
        this.activityInstanceId = this.activatedRoute.snapshot.queryParams.entityId;
        if (this.activatedRoute.snapshot.queryParams.isView === 'false') {
            this.isView = false;
        }
        if (this.activatedRoute.snapshot.queryParams.isView === 'true') {
            this.isView = true;
        }
        this.cacheService.set('nnnn', this.isView, CacheType.LOCAL_STORAGE);

    }

    ngOnInit() {
        // this.getStaticFormAndDynamicForm();
        // this.getActivitySampleFormAndFormData();
    }

    ///// خواندن تب فعال

    setActiveTab() {
        ///// خواندن تب فعال
        const tabTitle = this.activatedRoute.snapshot.queryParams.tabTitle;
        const tabIndex = +this.activatedRoute.snapshot.queryParams.tabIndex;
        if (tabTitle && tabIndex) {
            this.workOrder = false;
            switch (tabIndex) {
                case 0: {
                    this.workOrder = true;
                    // this.setCarousel(1, 'completionDetailsB');
                    break;
                }
                case 1: {
                    this.completionDetails = true;
                    // this.setCarousel(tabIndex, 'completionDetailsB');
                    break;
                }
                case 2: {
                    this.basicInformation = true;
                    // this.setCarousel(tabIndex, 'basicInformationB');
                    break;
                }
                case 3: {
                    this.tasks = true;
                    // this.setCarousel(tabIndex, 'tasksB');
                    break;
                }
                case 4: {
                    this.taskGroup = true;
                    // this.setCarousel(tabIndex, 'taskGroupB');
                    break;
                }
                case 5: {
                    this.parts = true;
                    // this.setCarousel(tabIndex, 'partsB');
                    break;
                }
                case 6: {
                    this.miscCost = true;
                    // this.setCarousel(tabIndex, 'miscCostB');
                    break;
                }
                case 7: {
                    this.file = true;
                    // this.setCarousel(tabIndex, 'fileB');
                    break;
                }
                case 8: {
                    this.formComplete = true;
                    break;
                }
            }

            $('.carousel-item').removeClass('active');
            setTimeout(e => {
                $('#' + tabTitle).click();
            }, 1500);
        }
        ///// خواندن تب فعال!!!!!!!!!!!!
    }

    activitySampleFormList = [];

    getActivitySampleFormAndFormData() {
        this.activityService.getActivitySampleFormAndFormData(
            {activitySampleId: this.activityInstanceId}).subscribe((res: any) => {
            if (res) {
                this.activitySampleFormList = res;
                this.formComplete = true;
            }

        });
    }


    cancelNewForm() {
        this.back.emit(true);
        this.edit.emit(true);
    }

    cancel() {
        this.back.emit(true);
        // this.router.navigateByUrl('/panel/worktable?page=0&size=10');

    }

    backOut(event) {
        this.router.navigateByUrl('/panel/worktable?page=0&size=10');

    }

    setCarousel(index, id) {
        $('#carouselExampleControls').carousel(index);
        setTimeout(e => {
            $('#' + id).click();
        }, 1000);
        this.navigate(index, id);
    }

    navigate(index, id) {
        this.router.navigate([window.location.hash.split('#/')[1].split('?')[0]], {
            queryParams: {
                entityId: this.activityInstanceId,
                isView: this.isView,
                tabTitle: id,
                tabIndex: index
            }
        });

    }


    loadingGetOne = false;

    getStaticFormAndDynamicForm() {
        this.loadingGetOne = true;
        this.activityService.getStaticFormAndDynamicForm(
            {activityInstanceId: this.activityInstanceId}).pipe(takeUntilDestroyed(this))
            .subscribe((res: PendingUserDetailsDTO) => {
                this.loadingGetOne = false;

                if (res) {
                    this.staticFormAndDynamicForm = res;
                    this.activityLevelId = res.activityLevelId;
                    this.numberOfParticipation = res.numberOfParticipation;
                    this.workOrderAccepted = res.workOrderAccepted;
                    this.loadingGetOne = true;
                    // 'is-there-repository';
                    this.workOrderRepositoryService.existedAlreadySave(
                        {
                            activityInstanceId: this.activityInstanceId,
                            workOrderId: res.workOrderId,
                            formId: res.formId,
                            formDataId: res.formDataId,
                            activityLevelId: res.activityLevelId,
                            numberOfParticipation: res.numberOfParticipation
                        }).pipe(takeUntilDestroyed(this)).subscribe((resT: boolean) => {
                        this.loadingGetOne = false;
                        resT = true;
                        // if (resT) {
                        DataService.setExistedAlreadySaveForWAR(true);
                        //     // =======================================================
                        //     this.loadingGetOne = true;
                        //     this.workOrderRepositoryService.getOne(
                        //         {
                        //             activityInstanceId: this.activityInstanceId,
                        //             activityLevelId: this.activityLevelId,
                        //             numberOfParticipation: this.numberOfParticipation
                        //         }).pipe(takeUntilDestroyed(this))
                        //         .subscribe((resTow: WorkTableDto.ActivitySampleWorkOrderAndFormRepository) => {
                        //             this.workOrderAndFormRepository = resTow;
                        //             if (!isNullOrUndefined(resTow.workOrderCreateDTO)) {
                        //                 this.workOrderDTO = resTow.workOrderCreateDTO;
                        //             }
                        //             if (!isNullOrUndefined(resTow.workOrderBasicInformation)) {
                        //                 this.basicInformationDTO = resTow.workOrderBasicInformation;
                        //             }
                        //             if (!isNullOrUndefined(resTow.completionDetail)) {
                        //                 this.completionDetailsDTO = resTow.completionDetail;
                        //             }
                        //             if (!isNullOrUndefined(resTow.taskList)) {
                        //                 this.tasksDTO = resTow.taskList;
                        //             }
                        //             if (!isNullOrUndefined(resTow.taskGroupList)) {
                        //                 this.taskGroupDTO = resTow.taskGroupList;
                        //             }
                        //             if (!isNullOrUndefined(resTow.partWithUsageCountList)) {
                        //                 this.partsDTO = resTow.partWithUsageCountList;
                        //             }
                        //             if (!isNullOrUndefined(resTow.miscCostList)) {
                        //                 this.miscCostDTO = resTow.miscCostList;
                        //             }
                        //             if (!isNullOrUndefined(resTow.notifyList)) {
                        //                 this.notificationDTO = resTow.notifyList;
                        //             }
                        //             if (!isNullOrUndefined(resTow.documentList)) {
                        //                 this.fileDTO = resTow.documentList;
                        //             }
                        //             if (!isNullOrUndefined(resTow.formData)) {
                        //                 this.formCompleteDTO = resTow.formData;
                        //             }
                        //             if (!isNullOrUndefined(resTow.formData)) {
                        //                 this.formCompleteDTO = resTow.formData;
                        //             }
                        //             if (!isNullOrUndefined(resTow.form)) {
                        //                 this.formDTO = resTow.form;
                        //             }
                        //             this.loadingGetOne = false;
                        //         }, error => {
                        //             this.loadingGetOne = false;
                        //         });
                        //
                        //     // =======================================================
                        // } else {
                        //     DataService.setExistedAlreadySaveForWAR(false);
                        // }
                        this.basicInformation = true;
                    }, error => {
                        this.loadingGetOne = false;
                    });

                    if ((!isNullOrUndefined(this.staticFormAndDynamicForm.staticFormsIdList))) {
                        this.formIdList = this.staticFormAndDynamicForm.staticFormsIdList;
                        // ========================فعلا از ماژول گزارشات استفاده نمیشود
                        if (!isNullOrUndefined(this.formIdList.find(e => e === 'reports'))) {
                            this.formIdList.splice(this.formIdList.findIndex(e => e === 'reports'), 1);
                        }
                        this.sendInformationNumberOfTabs.lengthFormIdList = this.formIdList.length;
                        // ===========================================================
                    }
                    if (this.formIdList.length > 0) {
                        this.workOrder = true;
                    } else {
                        this.formComplete = true;
                    }
                    this.setActiveTab();
                }
            }, error => {
                this.loadingGetOne = false;
            });

    }


    ngOnDestroy(): void {
    }

    ngAfterViewInit(): void {
    }


    showTheTrendHere() {
        this.router.navigate(['TrendHere'], {
            queryParams: {entityId: this.activityInstanceId},
            relativeTo: this.activatedRoute
        });
    }


    cancelCreateForm(item) {
        if (item === true) {
            this.loadingModalReject = true;
            this.RejectButtonInConstantForm();
        }
        if (item === false) {
            ModalUtil.hideModal('rejectStage');
        }
    }


    RejectButton() {
        ModalUtil.showModal('rejectStage');
    }

    loadingAcceptButtonInConstantForm = false;

    AcceptButtonInConstantForm() {
        if (this.loadingAcceptButtonInConstantForm) {
            return;
        }
        if (!this.workOrderAccepted && this.staticFormAndDynamicForm.workRequestAcceptor) {
            DefaultNotify.notifyDanger('لطفا قبل از تایید مرحله , ثبت در گزارشات تایید گردد.', '', NotiConfig.notifyConfig);
        } else if (this.workOrderAccepted || (!this.workOrderAccepted && !this.staticFormAndDynamicForm.workRequestAcceptor)) {
            this.setUserTypeDetails();
        }
    }

    ///// تایید این مرحله///
    action() {
        this.loadingAcceptButtonInConstantForm = true;

        this.activityService.whenUserPushesTheAcceptButtonInConstantForm(
            {
                activityLevelId: this.staticFormAndDynamicForm.activityLevelId,
                instanceId: this.activityInstanceId
            }).pipe(takeUntilDestroyed(this))
            .subscribe((res: any) => {
                this.loadingAcceptButtonInConstantForm = false;

                if (res) {
                    ModalUtil.hideModal(this.setUserModalId);
                    this.cancel();
                    // this.router.navigateByUrl('/panel/worktable');
                }
            }, error => {
                this.loadingAcceptButtonInConstantForm = false;
            });
    }

    ///// دریافت کاربران برای تعیین کاربر مرحله بعد///
    setUserTypeDetails() {
        this.loadingAcceptButtonInConstantForm = true;
        if (this.staticFormAndDynamicForm.nextActivityLevelId === 'end') {
            this.action();
        } else {
            this.activityService.getNextLevelUserIdAndUserTypeId({
                activityInstanceId: this.activityInstanceId,
                nextActivityLevelId: this.staticFormAndDynamicForm.nextActivityLevelId
            }).subscribe((res: UserIdAndUserTypeIdDTO) => {
                this.loadingAcceptButtonInConstantForm = false;

                if (res) {
                    this.orgNameAndUserTypeNameForNextLevel = new UserIdAndUserTypeIdDTO();
                    this.orgNameAndUserTypeNameForNextLevel = res;
                    this.userByUserTypeIdAndOrganizationId = [];
                    this.userByUserTypeIdAndOrganizationId = res.userIdAndUserNameDTOList;
                    this.userId = [];
                    if (res.userIdAndUserNameDTOList.length > 1) {
                        for (const item of res.userIdAndUserNameDTOList) {
                            this.userId.push(item.id);
                            ModalUtil.showModal(this.setUserModalId);
                        }
                    } else if (res.userIdAndUserNameDTOList.length === 1) {
                        // alert(10);
                        this.action();

                    }
                }
            }, error => {
                this.loadingAcceptButtonInConstantForm = false;
            });
        }
    }


    nextLevelUserTypeId: string;
    nextLevelUserIdList: string[];

    // ///////تایید کاربر انتخاب شده مرحله بعد/////
    loadingSetUserIdInActivityLevel = false;

    setUserIdInActivityLevel() {

        if (this.loadingSetUserIdInActivityLevel) {
            return;
        }
        if (!this.userId) {
            DefaultNotify.notifyDanger('ابتدا کاربر را مشخص کنید!', '', NotiConfig.notifyConfig);
            return;
        }

        this.nextLevelUserTypeId = null;
        if (this.orgNameAndUserTypeNameForNextLevel.candidateMode === CandidateMode.userType_mode &&
            this.userId.length === this.userByUserTypeIdAndOrganizationId.length) {
            this.nextLevelUserTypeId = this.orgNameAndUserTypeNameForNextLevel.userTypeId;
            this.nextLevelUserIdList = null;
        } else if (this.orgNameAndUserTypeNameForNextLevel.candidateMode === CandidateMode.userType_mode &&
            this.userId.length !== this.userByUserTypeIdAndOrganizationId.length) {
            this.nextLevelUserTypeId = null;
            this.nextLevelUserIdList = this.userId;
        } else if (this.orgNameAndUserTypeNameForNextLevel.candidateMode === CandidateMode.user_mode) {
            this.nextLevelUserTypeId = null;
            this.nextLevelUserIdList = this.userId;
        }
        this.chooseNextActivityLevelUserClass.activityInstanceId = this.activityInstanceId;
        this.chooseNextActivityLevelUserClass.activityLevelId = this.staticFormAndDynamicForm.nextActivityLevelId;
        this.chooseNextActivityLevelUserClass.isChosenMechanic = this.orgNameAndUserTypeNameForNextLevel.existRecipientOrderUser;
        this.chooseNextActivityLevelUserClass.userIdList = this.nextLevelUserIdList;
        this.chooseNextActivityLevelUserClass.userTypeId = this.nextLevelUserTypeId;
        this.chooseNextActivityLevelUserClass.workOrderId = this.staticFormAndDynamicForm.workOrderId;
        this.loadingSetUserIdInActivityLevel = true;
        this.activityService.chooseNextActivityLevelUser(this.chooseNextActivityLevelUserClass
        ).subscribe(res => {
            this.loadingSetUserIdInActivityLevel = false;
            if (!isNullOrUndefined(res)) {
                this.action();
            }
        }, error => {
            this.loadingSetUserIdInActivityLevel = false;

        });

    }


    // // رد مرحله بدون ذخیره فرم
    RejectButtonInConstantForm() {
        // this.activityService.whenUserPushesTheRejectButtonInConstantForm(
        //     {
        //         activityLevelId: this.staticFormAndDynamicForm.activityLevelId,
        //         instanceId: this.activityInstanceId
        //     }).pipe(takeUntilDestroyed(this))
        //     .subscribe((res: any) => {
        //         if (res) {
        //             ModalUtil.hideModal('rejectStage');
        //             this.router.navigateByUrl('/panel/worktable');
        //         }
        //     });
    }

    selectAllUser(event) {
        if (event.target.checked) {
            this.selectAllUserBoolean = true;
            for (const user of this.userByUserTypeIdAndOrganizationId) {
                this.userId.push(user.id);
            }
        } else if (!event.target.checked) {
            this.selectAllUserBoolean = false;
            for (const user of this.userByUserTypeIdAndOrganizationId) {
                this.userId = this.userId.filter(e => e !== user.id);
            }
        }
    }


    selectUser(event, i) {
        if (event.target.checked) {
            this.userId.push(this.userByUserTypeIdAndOrganizationId[i].id);
            if (this.userId.length === this.userByUserTypeIdAndOrganizationId.length) {
                this.selectAllUserBoolean = true;
            }
        } else if (!event.target.checked) {
            this.userId = this.userId.filter(e => e !== this.userByUserTypeIdAndOrganizationId[i].id);
            if (this.userId.length !== this.userByUserTypeIdAndOrganizationId.length) {
                this.selectAllUserBoolean = false;
            }
        }
    }


    pleaseAssignedMe() {

        const user = JSON.parse(sessionStorage.getItem('user'));
        this.activityService.acceptGroupRequest({activityInstanceId: this.activityInstanceId, userId: user.id})
            .pipe(takeUntilDestroyed(this))
            .subscribe((res: boolean) => {
                if (res) {
                    this.isView = false;
                    this.router.navigate([], {
                        queryParams: {
                            activityInstanceId:
                            this.activityInstanceId, isView: false
                        },
                        relativeTo: this.activatedRoute
                    });

                } else if (!res) {
                    DefaultNotify.notifyDanger('این فرایند توسط شخص دیگری در حال انجام است', '', NotiConfig.notifyConfig);
                }
            });
    }

    userByUserTypeIdAndOrganizationChecked(id) {
        return this.userId.find(e => e === id);
    }

    workOrderAccepted = false;

    // changeWorkOrderAcceptorBoolean(event) {
    //     this.workOrderAccepted = event.checked;
    //     this.activityService.workOrderAcceptedByManager(
    //         {
    //             activityInstanceId: this.activityInstanceId,
    //             workOrderId: this.staticFormAndDynamicForm.workOrderId,
    //             workOrderAccepted: this.workOrderAccepted
    //         }).pipe(takeUntilDestroyed(this))
    //         .subscribe((res: boolean) => {
    //             if (res) {
    //             }
    //         });
    // }
}

export class PendingUserDetailsDTO {
    formId: string;
    formDataId: string;
    staticFormsIdList: string[] = [];
    workOrderId: string;
    userTypeId: string;
    userId: string;
    workOrderAccessId: string;
    activityLevelId: string;
    numberOfParticipation: number;
    rightToChoose: boolean;
    existRecipientOrderUser: boolean;
    nextActivityLevelId: string;
    organizationId: string;
    workRequestAcceptor: boolean;
    workOrderAccepted: boolean;
}

export class UserIdAndUserTypeIdDTO {
    userIdAndUserNameDTOList: UserForNextLevel[] = [];
    organizationId: string;
    organizationName: string;
    userTypeId: string;
    userTypeName: string;
    candidateMode: CandidateMode;
    existRecipientOrderUser: boolean;
}


export class UserForNextLevel {
    id: string;
    family: string;
    name: string;
}

export class ChooseNextActivityLevelUserClass {
    isChosenMechanic: boolean;
    activityInstanceId: string;
    activityLevelId: string;
    userIdList: string[] = [];
    userTypeId: string;
    workOrderId: string;
}
