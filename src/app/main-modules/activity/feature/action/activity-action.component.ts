import {AfterViewInit, Component, Injector, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivityBaseComponent} from '../shared/activity-base-component';
import {Activity} from '../../model/activity';
import {ActivityLevel, CandidateMode} from '../../model/activityLevel';
import {Form, FormId} from '../../../formBuilder/fb-model/form/form';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivityService} from '../../service/activity.service';
import {ActivatedRoute} from '@angular/router';
import {ActionMode, DefaultNotify, ModalSize, PageContainer, Paging, Toolkit2} from '@angular-boot/util';
import {untilDestroyed} from '../../../../shared/service/take-until-destroy';
import {UserType} from '../../../securityManagement/model/userType';
import {UserTypeService} from '../../../securityManagement/endpoint/user-type.service';
import {OrganizationService} from '../../../basicInformation/organization/endpoint/organization.service';
import {OrganizationDto} from '../../../basicInformation/organization/model/organizationDto';
import {takeUntilDestroyed} from '@angular-boot/core';
import {ModalUtil} from '@angular-boot/widgets';
import {concat, Observable, of, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap, tap} from 'rxjs/operators';
import {WorkOrderAccess} from '../../model/work-order-access';
import {MatCheckboxChange, MatSlideToggleChange} from '@angular/material';
import {WorkOrderAccessService} from '../../service/work-order-access/work-order-access.service';
import {isNullOrUndefined} from 'util';
import {GetUser} from '../../../asset/feature/user-list-for-asset/user-list-for-asset.component';
import {UserService} from '../../../user/endpoint/user.service';
import {MyPattern} from '../../../../shared/shared/tools/myPattern';
import {FormService} from '../../../form-builder2/service/form.service';
import {NotiConfig} from '../../../../shared/tools/notifyConfig';

declare var $: any;

@Component({
    selector: 'app-activity-action',
    templateUrl: './activity-action.component.html',
    styleUrls: ['./activity-action.component.scss']
})
export class ActivityActionComponent extends ActivityBaseComponent implements OnInit, OnDestroy, AfterViewInit {

    constructor(
        injector: Injector,
        public activityService: ActivityService,
        public userService: UserService,
        public userTypeService: UserTypeService,
        public formService: FormService,
        public organizationService: OrganizationService,
        private activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        public workOrderAccessService: WorkOrderAccessService
    ) {
        super(injector);
        this.number = 0;
        this.stepNumber = 'activity-step-0';
        this.form = fb.group({
            activityTitle: new FormControl(null, [Validators.required]),
            description: new FormControl(false)
        });
        this.activityLevelForm = fb.group({
            stepTitle: new FormControl(null, [Validators.required]),
            selectedPersonIndex: new FormControl(null, [Validators.required]),
            recipe: new FormControl(null, [Validators.required]),
            stepTitle1: new FormControl(null, [Validators.required]),
            recipe1: new FormControl(null, [Validators.required]),
            personList: new FormControl(null, [Validators.required]),
            selectedOrganization: new FormControl(null, [Validators.required]),
            selectedPost: new FormControl(null, [Validators.required]),
            selectedForm: new FormControl(null, [Validators.required]),
        });
    }

    @Input() formIdList: string[] = [];
    myPattern = MyPattern;

    ActionMode = ActionMode;
    workOrderList: string[];

    activity: Activity = {
        activityLevelList: [] as ActivityLevel[]
    } as Activity;
    // احتمالا برای اینکه دیتای رو خودمون دستی وارد میکنیم.==> برای اینه که بهش حافظه اختصاص داده شه چرا؟
    activityLevelForEditIndex: number;
    activityLevelForEdit: ActivityLevel = {
        nextActivityLevel: {} as ActivityLevel,
        prevActivityLevel: {} as ActivityLevel,
        form: {} as Form,
    } as ActivityLevel;

    activityLevel: ActivityLevel = {
        nextActivityLevel: {} as ActivityLevel,
        prevActivityLevel: {} as ActivityLevel,
        form: {} as Form,
    } as ActivityLevel;

    formList: Form[] = [];
    userTypeList: UserType[] = [];
    form: FormGroup;
    activityLevelForm: FormGroup;
    selectWorOrderMaine = false;
    saveButton: boolean;
    createActivityLevel = true;
    editActivityStatus = false;
    addNewActivity = true;
    activityLevelId: string;
    organizationId: string;
    activityId = '';
    idCounter = 1;
    stepNumber = '';
    stepNumber2 = 0;
    number: number;
    s: string;
    m: string;
    numberOfField = 0;
    organizationList: OrganizationDto.Create[] = [];
    userTypeListByOrg: any[] = [];
    workOrderLength: number;

    organizationList$: Observable<any[]>;
    organizationInput = new Subject<string>();
    organizationLoading = false;


    userByUserTypeIdAndOrganizationId: Class [] = [];
    selectedUser = new Class();
    selectAllUserBoolean = false;
    findId = new ActivityLevelForAddedToStep();

    status = false;

    selectLevel = new ActivityLevelForAddedToStep();
    modalId = ModalUtil.generateModalId();
    MyModalSize = ModalSize;
    workOrderAccess = new WorkOrderAccess();
    workOrderAccessCopy = new WorkOrderAccess();
    fieldsIsExistInWorOrderLis: string[] = [];
    fieldsIsExistInWorOrderLisCopy: string[] = [];
    fieldsIsExistInWorOrder: string;
    loadingOrg = true;
    loadingUserType = true;
    loadingUser = true;
    clickInSave = false;
    staticFormsIdList: string[] = [];
    checkedBoolean = false;
    index: number;
    result: any;
    userTypeId: string[] = [];
    userIdList: string[] = [];
    withoutOrgName: string;
    organizationName: string;
    userByOrgName: string;
    activityLevelForAddedToStep: ActivityLevelForAddedToStep[] = [];
    withoutUser: string;
    userList: string[] = [];
    showOrgNameAndUserTypeNameInTableList: ShowOrgNameAndUserTypeNameInTable[] = [];
    showOrgNameAndUserTypeNameInTable = new ShowOrgNameAndUserTypeNameInTable();
    showSelectUserTable = false;
    candidateMode = CandidateMode;
    staticFormsList =
        [
            {
                text: 'کلیات',
                value: 'information'
            },
            // {
            //     text: 'اطلاعات تکمیلی',
            //     value: 'completionDetails'
            // },
            // {
            //     text: 'اطلاعات پایه',
            //     value: 'basicInformation'
            // },
            // {
            //     text: 'وظایف',
            //     value: 'tasks'
            // },
            // {
            //     text: 'مجموعه کارها',
            //     value: 'taskGroup'
            // },
            // {
            //     text: 'قطعات به کار برده شده ',
            //     value: 'workOrderPart'
            // },
            // {
            //     text: 'هزینه های متفرقه',
            //     value: 'miscCost'
            // },
            // // {
            // // text: 'آگاه سازی',
            // // value: 'notification'
            // // }
            // // ,
            // {
            //     text: 'مستندات',
            //     value: 'file'
            // },
        ];

    loadingGetOne = false;


    loadingSaveActivity = false;


    allowViewActivityLevelListAfterGetOne = true;

    modeForShowModalSelectableUser: string;

    activityLevelForAddContactIndex: number;
    activityLevelForAddContactMode: string;
    activityLevelForAddContact: ActivityLevel = {
        nextActivityLevel: {} as ActivityLevel,
        prevActivityLevel: {} as ActivityLevel,
        form: {} as Form,
    } as ActivityLevel;

    loadingChangeSetting = false;

/////////////////////////////////////////////////////////// ghasem
    loadingUserTypeList = true;
    usrType = new UserType();
    allowGetAllUserType = true;

    selectedUserTypeId: string;

    loadingUserList = false;
    userListByPost: GetUser[] = [];


    ngOnInit() {
        this.activityLevelForEdit.staticFormsIdList = [this.staticFormsList[0].value];
        const user: any = JSON.parse(sessionStorage.getItem('user'));
        // this.activity.organizationId = user.orgId;
        this.activatedRoute.params
            .pipe(untilDestroyed(this))
            .subscribe(param => {
                this.activityId = param.id;

                if (!isNullOrUndefined(this.activityId)) {
                    this.getOne();
                }
            });

        // this.getAllOrganization();
        // this.formService.getAllLimit(this.activity.organizationId)
        //     .pipe(untilDestroyed(this))
        //     .subscribe((res: Form[]) => {
        //         this.formList = res;
        //         if (this.formList.length < 1) {
        //             DefaultNotify.notifyDanger(
        //                 'کاربر گرامی ابتدا فرم مربوط به هر بخش را از منوی فرم ساز ثبت نموده سپس اقدام به ثبت فرآیند نمائید.');
        //         }
        //     });

        const startActivityLevel = {
            id: 'start',
            title: 'شروع',
            recipe: '---',
            nextActivityLevel: {} as ActivityLevel,
            prevActivityLevel: null,
            firstStepIs: true,
            userTypeId: null,
            // organizationId: null,
            assignedUserId: null,
            candidateUserIdList: null,
        } as ActivityLevel;
        if (!this.activity.activityLevelList.some(e => e.id === 'start')) {
            this.activity.activityLevelList.push(startActivityLevel);
        }
        // if (this.activity.activityLevelList[this.activity.activityLevelList.length - 1].title !== 'پایان') {
        const endActivityLevel = {
            id: 'end',
            title: 'پایان',
            recipe: '---',
            nextActivityLevel: null,
            prevActivityLevel: null,
            lastStepIs: true,
            userTypeId: null,
            // organizationId: null,
            candidateUserIdList: null,
            assignedUserId: null,
        } as ActivityLevel;
        if (!this.activity.activityLevelList.some(e => e.id === 'end')) {
            this.activity.activityLevelList.push(endActivityLevel);
        }
        // }
        // this.getAllUserType();

    }

    ngAfterViewInit(): void {
        this.removeInValidClass();
        // $('.ng-select-container').addClass('heightAuto');

    }


    removeInValidClass() {
        $(document).on('click', '.valid-error.ng-invalid', () => {
            $(this).parent().find($('.valid-error')).removeClass('invalid-field');
        });
        $(document).on('click', '.valid-error', () => {
            $(this).parent().removeClass('invalid-field');
        });
        $(document).on('click', '.valid-error.ng-select', () => {
            $(this).closest('.invalid-field').removeClass('invalid-field');
        });
    }

    getOne() {
        this.loadingGetOne = true;
        this.activityService.getOneActivity({activityId: this.activityId})
            .pipe(untilDestroyed(this))
            .subscribe((res: any) => {
                this.loadingGetOne = false;
                const result = res.data;
                const length = result.activityLevelList.length;
                for (let i = 0; i < length; i++) {
                    // if (isNullOrUndefined(result.activityLevelList[i].organizationId)) {
                    //     result.activityLevelList[i].organizationId = null;
                    // }
                    // ==================================tttt=======================================
                    if (!isNullOrUndefined(result.activityLevelList[i].staticFormsIdList)) {

                        for (const item of result.activityLevelList[i].staticFormsIdList) {
                            this.fieldsIsExistInWorOrder = item;
                            this.fieldsIsExistInWorOrderLis.push(this.fieldsIsExistInWorOrder);
                            this.fieldsIsExistInWorOrderLisCopy = this.fieldsIsExistInWorOrderLis;
                        }
                    }
                    if (isNullOrUndefined(result.activityLevelList[i].prevActivityLevel) ||
                        isNullOrUndefined(result.activityLevelList[i].prevActivityLevel.id)) {
                        result.activityLevelList[i].prevActivityLevel = undefined;
                    }
                    if (isNullOrUndefined(result.activityLevelList[i].nextActivityLevel) ||
                        isNullOrUndefined(result.activityLevelList[i].nextActivityLevel.id)) {
                        result.activityLevelList[i].nextActivityLevel = undefined;
                    }
                    if (!isNullOrUndefined(result.activityLevelList[i].workOrderAccessId)) {
                        const t = result.activityLevelList[i].staticFormsIdList.filter(e => e !== 'workOrder');
                        result.activityLevelList[i].staticFormsIdList = [];
                        result.activityLevelList[i].staticFormsIdList = t;
                    }
                }
                this.createActivityLevel = false;
                this.addNewActivity = false;
                this.activity = result;
                // this.viewActivityLevelListAfterGetOne();
            }, error => {
                this.loadingGetOne = false;
                alert('error');

            });
    }

    setNOPLevel(value) {

        if (this.activity.activityLevelList.length < 2) {
            DefaultNotify.notifyDanger('مراحل روند ثبت نشده است.', '', NotiConfig.notifyConfig);
            return;
        }
        // این یعنی تو موود ادد کردن یا ادیت هست
        this.createActivityLevel = value;

        this.selectStep(2);
    }

    cancelEdit() {
        this.activityLevelForm.reset();
        this.editActivityStatus = false;
        this.checkedBoolean = false;
        this.selectWorOrderMaine = false;
        this.workOrderAccess = new WorkOrderAccess();
        this.activityLevelForEdit = {
            nextActivityLevel: {} as ActivityLevel,
            prevActivityLevel: {} as ActivityLevel,
            form: {} as Form,
        } as ActivityLevel;

    }

    addStep2() {


        if (!this.activityLevelForEdit.title) {
            DefaultNotify.notifyDanger('عنوان وارد شود.', '', NotiConfig.notifyConfig);
            return;
        }
        if (this.activity.activityLevelList.some(a => a.title === this.activityLevelForEdit.title && a.id !== this.activityLevelForEdit.id
        )) {
            DefaultNotify.notifyDanger('عنوان  وارد شده تکراری است.', '', NotiConfig.notifyConfig);
            return;
        }
        if (this.numberOfField < 1) {
            if (this.activityLevelForEdit.staticFormsIdList) {

                const index = this.activityLevelForEdit.staticFormsIdList.findIndex(e => e === 'information');
                if (index !== -1) {
                    // this.activityLevelForEdit.staticFormsIdList.splice(index, 1);
                }
                if (this.activityLevelForEdit.staticFormsIdList.length === 0) {
                    this.activityLevelForEdit.workOrderAccessId = null;
                }
            }
        }
        if (this.editActivityStatus) {
            this.activity.activityLevelList[this.activityLevelForEditIndex] = JSON.parse(JSON.stringify(this.activityLevelForEdit));
            // this.activityLevelForAddedToStep[this.activityLevelForEditIndex] = JSON.parse(JSON.stringify(this.activityLevelForEdit));
        } else {
            this.activityLevelForEdit.id = Toolkit2.Common.create().uuidv4();
            this.activity.activityLevelList.push(JSON.parse(JSON.stringify(this.activityLevelForEdit)));
            // this.activityLevelForAddedToStep.push(JSON.parse(JSON.stringify(this.activityLevelForEdit)))
        }
        // this.activityLevelForEdit = this.activityLevel;
        this.activityLevelForm.reset();
        this.editActivityStatus = false;
        this.checkedBoolean = false;
        this.selectWorOrderMaine = false;
        this.workOrderAccess = new WorkOrderAccess();
        this.activityLevelForEdit = {
            nextActivityLevel: {} as ActivityLevel,
            prevActivityLevel: {} as ActivityLevel,
            form: {} as Form,
        } as ActivityLevel;
        this.sortActivityLevelById();
        this.activityLevelForEdit.staticFormsIdList = [this.staticFormsList[0].value];



    }

    sortActivityLevelById() {
        const list = this.activity.activityLevelList.filter(a => a.id !== 'start' && a.id !== 'end');

        for (let i = 0; i < list.length; i++) {
            list[i].id = (i + 1).toString();

        }
        if (this.activity.activityLevelList.some(e => e.id === 'start')) {
            list.unshift(this.activity.activityLevelList.find(e => e.id === 'start'));
        }
        if (this.activity.activityLevelList.some(e => e.id === 'end')) {
            list.push(this.activity.activityLevelList.find(e => e.id === 'end'));
        }
        this.activity.activityLevelList = list;

        for (const activityLevel of this.activity.activityLevelList) {
            if (activityLevel.prevActivityLevel) {
                if (activityLevel.prevActivityLevel.id) {
                    if (!(this.activity.activityLevelList.some(a => a.id === activityLevel.prevActivityLevel.id))) {
                        activityLevel.prevActivityLevel = {
                            nextActivityLevel: {} as ActivityLevel,
                            prevActivityLevel: {} as ActivityLevel,
                            form: {} as Form,
                        } as ActivityLevel;
                    }
                }
            }
            if (activityLevel.nextActivityLevel) {
                if (activityLevel.nextActivityLevel.id) {
                    if (!(this.activity.activityLevelList.some(a => a.id === activityLevel.nextActivityLevel.id))) {
                        activityLevel.nextActivityLevel = {
                            nextActivityLevel: {} as ActivityLevel,
                            prevActivityLevel: {} as ActivityLevel,
                            form: {} as Form,
                        } as ActivityLevel;
                    }
                }
            }
        }

    }

    edit2(item, index) {
        this.activityLevelForEdit = JSON.parse(JSON.stringify(item));
        if (this.activityLevelForEdit.formIdCopy) {
            if (this.activityLevelForEdit.formIdCopy.formId) {
                this.activityLevelForEdit.formId = this.activityLevelForEdit.formIdCopy.formId;
            }
        }
        this.activityLevelForEditIndex = index;
        this.editActivityStatus = true;
        if (this.activityLevelForEdit.workOrderAccessId) {
            this.checkedBoolean = true;
            this.selectWorOrderMaine = true;
            this.getOnWorkOrderAccess();
        } else {
            this.checkedBoolean = false;
            this.selectWorOrderMaine = false;
            this.workOrderAccess = new WorkOrderAccess();
            this.workOrderAccessCopy = new WorkOrderAccess();
        }
    }


    getOnWorkOrderAccess() {
        this.workOrderAccessService.getOne({workOrderAccessId: this.activityLevelForEdit.workOrderAccessId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: WorkOrderAccess) => {
            this.workOrderAccess = res;
            this.workOrderAccessCopy = JSON.parse(JSON.stringify(res));
        });
    }

    delete(id, i) {
        this.activity.activityLevelList.splice(i, 1);


        for (let ii = 0; ii < this.activity.activityLevelList.length; ii++) {
            if (this.activity.activityLevelList[ii].nextActivityLevel) {
                if (this.activity.activityLevelList[ii].nextActivityLevel.id === id) {


                    // this.activity.activityLevelList[ii].nextActivityLevel = new ActivityLevel();
                    this.activity.activityLevelList[ii].nextActivityLevel = {
                        nextActivityLevel: {} as ActivityLevel,
                        prevActivityLevel: {} as ActivityLevel,
                        form: {} as Form,
                    } as ActivityLevel;
                }
            }
            if (this.activity.activityLevelList[ii].prevActivityLevel) {
                if (this.activity.activityLevelList[ii].prevActivityLevel.id === id) {
                    // this.activity.activityLevelList[ii].prevActivityLevel = new ActivityLevel();
                    this.activity.activityLevelList[ii].prevActivityLevel = {
                        nextActivityLevel: {} as ActivityLevel,
                        prevActivityLevel: {} as ActivityLevel,
                        form: {} as Form,
                    } as ActivityLevel;
                }
            }

        }
        this.sortActivityLevelById();
        return;
        // const length = this.activity.activityLevelList.length;
        // for (let i = 0; i < length; i++) {
        //     if (this.activity.activityLevelList[i].id === id) {
        //         for (let j = 0; j < length; j++) {
        //             if (!isNullOrUndefined(this.activity.activityLevelList[j].nextActivityLevel) &&
        //                 !isNullOrUndefined(this.activity.activityLevelList[j].nextActivityLevel.id) &&
        //                 this.activity.activityLevelList[j].nextActivityLevel.id === id) {
        //                 this.activity.activityLevelList[j].nextActivityLevel = new ActivityLevel();
        //             }
        //             if (!isNullOrUndefined(this.activity.activityLevelList[j].prevActivityLevel) &&
        //                 !isNullOrUndefined(this.activity.activityLevelList[j].prevActivityLevel.id) &&
        //                 this.activity.activityLevelList[j].prevActivityLevel.id === id) {
        //                 this.activity.activityLevelList[j].prevActivityLevel = new ActivityLevel();
        //             }
        //         }
        //         if (this.activity.activityLevelList[i].staticFormsIdList && this.activity.activityLevelList[i].staticFormsIdList.length) {
        //             for (let j = 0; j < this.activity.activityLevelList[i].staticFormsIdList.length; j++) {
        //                 this.fieldsIsExistInWorOrderLisCopy.splice(j, 1);
        //             }
        //         }
        //         this.activity.activityLevelList.splice(i, 1);
        //         break;
        //     }
        // }
        // for (let k = 0; k < this.activityLevelForAddedToStep.length; k++) {
        //     if (this.activityLevelForAddedToStep[k].id === id) {
        //         this.activityLevelForAddedToStep.splice(k, 1);
        //     }
        // }
        // if (this.activityLevelForEdit.id === id) {
        //     this.activityLevel = new ActivityLevel();
        //     this.workOrderAccess = new WorkOrderAccess();
        //     this.workOrderAccessCopy = new WorkOrderAccess();
        // }


    }

    saveActivity() {
        // this.sortActivityLevelById();

        if (this.activity.activityLevelList.length === 3) {
            this.activity.activityLevelList.filter(a => {
                if (a.id !== 'start' && a.id !== 'end') {
                    a.existRecipientOrderUser = true;
                    a.workRequestAcceptor = true;
                }
            });
        }
        // if (!this.activity.activityLevelList.some(a => a.existRecipientOrderUser === true)) {
        //     DefaultNotify.notifyDanger('تعیین   کاربر تکنسین مرحله بعد الزامی است');
        //     return;
        // }
        if (!this.activity.activityLevelList.some(a => a.workRequestAcceptor === true)) {
            DefaultNotify.notifyDanger('تعیین کاربر تایید کننده ی درخواست الزامی است', '', NotiConfig.notifyConfig);
            return;
        }
        for (const item1 of this.activity.activityLevelList) {
            if (item1.title !== 'پایان' && isNullOrUndefined(item1.nextActivityLevel.id)) {
                DefaultNotify.notifyDanger('تعیین مرحله ی بعد از تایید الزامی است', '', NotiConfig.notifyConfig);
                return;
            }
        }
        for (const item2 of this.activity.activityLevelList) {
            if (!isNullOrUndefined(item2.prevActivityLevel)) {
                if (item2.title !== 'شروع' && isNullOrUndefined(item2.prevActivityLevel.id)) {
                    DefaultNotify.notifyDanger('تعیین رد هر مرحله الزامی است', '', NotiConfig.notifyConfig);
                    return;
                }
            }
        }
        if (!this.activity.activityLevelList.some(a => a.userTypeId)) {
            DefaultNotify.notifyDanger('انتخاب مخاطب برای تمامی مراحل الزامی است.', '', NotiConfig.notifyConfig);
            return;
        }
        for (let i = 0; i < this.activity.activityLevelList.length; i++) {
            // if (this.activity.activityLevelList[i].title !== 'شروع' && this.activity.activityLevelList[i].title !== 'پایان' &&
            //   !this.activity.activityLevelList[i].rightToChoose &&
            //   !this.activity.activityLevelList[i].existRecipientOrderUser && this.activity.activityLevelList[i + 1].title !== 'پایان' &&
            // isNullOrUndefined(this.activity.activityLevelList[i + 1].assignedUserId) &&
            //   this.activity.activityLevelList[i + 1].candidateUserIdList.length === 0) {
            //   DefaultNotify.notifyDanger('انتخاب کاربر الزامی است');
            //   return;
            // }
        }
        if (this.activity.activityLevelList.length < 3) {
            DefaultNotify.notifyDanger('وارد کردن مراحل فرایند اجباریست.', '', NotiConfig.notifyConfig);
        }
        if (isNullOrUndefined(this.activity.activityLevelList[0].nextActivityLevel) ||
            isNullOrUndefined(this.activity.activityLevelList[0].nextActivityLevel.id)) {
            DefaultNotify.notifyDanger('تعیین مرحله بعد از تایید و رد هر مرحله اجباریست.', '', NotiConfig.notifyConfig);
            return;
        }
        let nextAndPreStatus = true;
        for (const item of this.activity.activityLevelList) {
            if (!item.lastStepIs && !item.firstStepIs) {
                if ((isNullOrUndefined(item.nextActivityLevel) ||
                    isNullOrUndefined(item.nextActivityLevel.id)) ||
                    (isNullOrUndefined(item.prevActivityLevel) ||
                        isNullOrUndefined(item.prevActivityLevel.id))) {
                    nextAndPreStatus = false;
                }
            }
            if (!isNullOrUndefined(item.workOrderAccessId)) {
                if (isNullOrUndefined(item.staticFormsIdList)) {
                    item.staticFormsIdList = ['workOrder'];
                } else {
                    item.staticFormsIdList.push('workOrder');
                }
            }
        }
        if (!nextAndPreStatus) {
            DefaultNotify.notifyDanger('تعیین مرحله بعد از تایید و رد هر مرحله اجباریست.', '', NotiConfig.notifyConfig);
            return;
        }
        if (this.loadingSaveActivity) {
            return;
        }
        this.loadingSaveActivity = true;
        if (!this.activityId) {
            this.activityService.create(this.activity)
                .pipe(untilDestroyed(this))
                .subscribe((res: any) => {
                    this.loadingSaveActivity = false;

                    if (res.id === 'CAN_NOT_BE_EDITED') {
                        DefaultNotify.notifyDanger('از این فرم استفاده شده و نمیتوانید ان را ویرایش کنید.', '', NotiConfig.notifyConfig);
                    } else if (!isNullOrUndefined(res.id)) {
                        DefaultNotify.notifySuccess('عملیات با موفقیت انجام شد.', '', NotiConfig.notifyConfig);
                        this.router.navigateByUrl('/panel/activity/list');
                    } else {
                        DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.', '', NotiConfig.notifyConfig);
                    }
                }, error => {
                    this.loadingSaveActivity = false;
                    DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.', '', NotiConfig.notifyConfig);
                });
        } else if (this.activityId) {
            this.activityService.update(this.activity)
                .pipe(untilDestroyed(this))
                .subscribe((res: any) => {
                    this.loadingSaveActivity = false;
                    if (!isNullOrUndefined(res.id)) {
                        DefaultNotify.notifySuccess('عملیات با موفقیت انجام شد.', '', NotiConfig.notifyConfig);
                        this.router.navigateByUrl('/panel/activity/list');
                    } else {
                        DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.', '', NotiConfig.notifyConfig);
                    }
                }, error => {
                    this.loadingSaveActivity = false;
                });
        }
    }


    // ********************************** org setup ***********************************
    getAllOrganization() {
        this.organizationService.getAll().pipe(takeUntilDestroyed(this))
            .subscribe(res => {
                if (res) {
                    this.organizationList = res;
                    this.loadingOrg = false;
                    this.loadingOrganization();
                } else {
                    DefaultNotify.notifyDanger('ابتدا سازمان ثبت کنید.', '', NotiConfig.notifyConfig);
                }
            });
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


    // ********************************** org setup ***********************************
    setUserTypeDetails(userTypeId, orgId, from) {
        this.withoutUser = null;
        this.loadingUser = true;
        if (from === 'html') {
            this.userIdList = [];
        }
        if (!isNullOrUndefined(userTypeId) && !isNullOrUndefined(orgId)) {
            this.activityService.getUserByUserTypeIdAndOrganizationId({userTypeId, organizationId: orgId})
                .subscribe(res => {
                    if (!isNullOrUndefined(res)) {
                        if (res.length > 0) {
                            if (this.userIdList.length === 0) {
                                this.showSelectUserTable = false;
                                this.activityLevelForEdit.candidateMode = CandidateMode.userType_mode;
                            }
                            if (this.userIdList.length !== 0) {
                                this.activityLevelForEdit.candidateMode = CandidateMode.user_mode;
                            }
                            this.userByUserTypeIdAndOrganizationId = res;
                            this.loadingUser = false;
                        } else if (res.length === 0) {
                            this.withoutUser = null;
                            this.withoutOrgName = null;
                            setTimeout(() => {
                                const userName = this.userTypeListByOrg.find(e => e.id === userTypeId);
                                this.withoutUser = userName.name;
                                this.userByUserTypeIdAndOrganizationId = [];
                            }, 100);

                        }
                    }
                });
        } else if (isNullOrUndefined(userTypeId)) {
            this.userByUserTypeIdAndOrganizationId = [];
        }
    }

    backToStepTwo() {
        // this.activityLevel = new ActivityLevel();
        // this.workOrderAccess = new WorkOrderAccess();
        // this.workOrderAccessCopy = new WorkOrderAccess();
        // this.activity.activityLevelList.splice(this.activity.activityLevelList.length - 1, 1);
        this.selectStep(1);
    }


    selectStep(stepNumber: number) {
        if (this.loadingGetOne) {
            return;
        }
        if (stepNumber === 1) {
            this.viewActivityLevelListAfterGetOne();
        }
        if (stepNumber === 2) {
            this.getAllUserType();
            this.sortActivityLevelById();
        }
        if (this.stepNumber2 < stepNumber) {
            if (this.form.invalid) {
                $('.valid-error.ng-invalid').parent().addClass('invalid-field');
                DefaultNotify.notifyDanger('ورودی ها بررسی شود.', '', NotiConfig.notifyConfig);
                return;
            }
            if (this.activity.activityLevelList.length < 2 && stepNumber === 2) {
                DefaultNotify.notifyDanger('مراحل روند ثبت نشده است.', '', NotiConfig.notifyConfig);
                return;
            }
        }
        if (this.stepNumber2 === 0 && (stepNumber === 1 || stepNumber === 2)) {
            if (!isNullOrUndefined(this.activity.title)) {
                this.activity.title = this.activity.title.trim();
            }
            if (this.activity.title.length === 0) {
                $('.valid-error.ng-valid').parent().addClass('invalid-field');
                return;
            }
        }
        this.stepNumber2 = stepNumber;
        if (stepNumber === 0) {
            this.stepNumber = 'activity-step-0';
            $('#activity-step-0').addClass('active');
        } else if (stepNumber === 1) {
            this.activity.title = this.activity.title.trim();
            this.createActivityLevel = true;
            $('.valid-error.ng-invalid').parent().removeClass('invalid-field');
            // $('#activity-step-0').parent().find($('.carousel-item.active')).removeClass('active');
            this.stepNumber = 'activity-step-1';
            $('#activity-step-1').addClass('active');
        } else if (stepNumber === 2) {
            this.stepNumber = 'activity-step-2';
            $('#activity-step-2').addClass('active');
            // this.setNOPLevel(false);
        } else if (stepNumber === 3) {
            this.stepNumber = 'activity-step-3';
            $('#activity-step-3').addClass('active');
            // this.setNOPLevel(false);
        }
    }

    ngOnDestroy(): void {
    }

    backToList() {
        this.router.navigateByUrl('/panel/activity/list');

    }

    viewActivityLevelListAfterGetOne() {
        if (!this.allowViewActivityLevelListAfterGetOne) {
            return;
        }
        this.activityLevelForAddedToStep = [];

        const oneItem = this.activity.activityLevelList;
        // for (let k = 0; k < this.activity.activityLevelList.length; k++) {
        //     if (oneItem[k].id !== 'start' && oneItem[k].id !== 'end') {
        //         if (oneItem[k].assignedUserId) {
        //             this.userList.push(oneItem[k].assignedUserId);
        //         }
        //         if (oneItem[k].candidateUserIdList) {
        //             if (oneItem[k].candidateUserIdList.length) {
        //                 this.userList = oneItem[k].candidateUserIdList;
        //             }
        //         }
        //         this.activityService.getUserNameOrganisationNameAndUserTypeName({
        //             organisationId: oneItem[k].organizationId,
        //             userTypeId: oneItem[k].userTypeId,
        //             userId: this.userList,
        //         }).subscribe(res => {
        //             this.allowViewActivityLevelListAfterGetOne = false;
        //
        //             this.result = res;
        //             const l = new ActivityLevelForAddedToStep();
        //             l.userName = this.result.username;
        //             l.organizationName = this.result.organizationName;
        //             l.userTypeName = this.result.userTypeName;
        //
        //             // l.organizationId = oneItem[k].organizationId;
        //             l.userTypeId = oneItem[k].userTypeId;
        //             l.userId = this.userList;
        //
        //             l.title = oneItem[k].title;
        //             l.recipe = oneItem[k].recipe;
        //             l.id = oneItem[k].id;
        //
        //             if (oneItem[k].form.id) {
        //                 for (const item of this.formList) {
        //                     if (item.id === oneItem[k].form.id) {
        //                         l.formId = oneItem[k].formId;
        //                         l.formTitle = oneItem[k].title;
        //
        //                     }
        //                 }
        //             } else {
        //                 l.formId = null;
        //                 l.formTitle = null;
        //
        //             }
        //             this.activityLevelForAddedToStep.push(l);
        //
        //
        //         });
        //
        //
        //     }
        // }
        if (this.userTypeListByOrg.length === 0) {
            this.userTypeService.getAllRole()
                .subscribe(res => {
                    if (!isNullOrUndefined(res)) {
                        this.userTypeListByOrg = res;

                    }
                });

        }
        // if (this.userByUserTypeIdAndOrganizationId.length === 0) {
        //     this.setUserTypeDetails(oneItem[k].userTypeId, oneItem[k].organizationId, 'ts');
        // }
        if (this.formList.length === 0) {
            this.formService.getAllNewForm()
                .pipe(untilDestroyed(this))
                .subscribe((res: Form[]) => {
                    this.formList = res;

                    if (this.formList.length < 1) {

                        // DefaultNotify.notifyDanger(
                        //     'کاربر گرامی ابتدا فرم مربوط به هر بخش را از منوی فرم ساز ثبت نموده سپس اقدام به ثبت فرآیند نمائید.');
                    }
                });
        }


    }

    showModalSelectableUser(item: ActivityLevel, index, mode) {
        this.modeForShowModalSelectableUser = mode;
        this.activityLevel = item;
        this.index = index;
        this.selectLevel.userId = [];
        this.userIdList = [];
        this.selectLevel.userTypeId = item.userTypeId;
        if (item.candidateUserIdList) {
            if (item.candidateUserIdList.length > 0) {
                this.selectLevel.userId = item.candidateUserIdList;
                this.userIdList = item.candidateUserIdList;
            }
        }
        if (item.assignedUserId) {
            this.selectLevel.userId = [];
            this.selectLevel.userId.push(item.assignedUserId);
            this.userIdList.push(item.assignedUserId);
        }
        this.selectLevel.title = item.title;
        this.selectLevel.recipe = item.recipe;
        this.selectLevel.organizationId = item.organizationId;
        this.selectLevel.id = item.id;
        this.selectLevel.formId = item.formId;
        this.organizationId = item.organizationId;
        this.userTypeId = item.userTypeId;
        this.userByUserTypeIdAndOrganizationId = [];
        if (!isNullOrUndefined(item.userTypeId)) {
            this.setUserTypeDetails(this.userTypeId, this.organizationId, 'ts');
        }
        ModalUtil.showModal(this.modalId);
    }

    showModalSelectableUser2(item: ActivityLevel, index, mode) {
        this.userByUserTypeIdAndOrganizationId = [];
        this.activityLevelForAddContact = JSON.parse(JSON.stringify(item));
        if (this.activityLevelForAddContact.assignedUserId) {

            this.activityLevelForAddContact.candidateUserIdList = [this.activityLevelForAddContact.assignedUserId];
            this.activityLevelForAddContact.candidateMode = CandidateMode.user_mode;
        }
        if (this.activityLevelForAddContact.userTypeId) {
            this.changeUserType(this.activityLevelForAddContact.userTypeId, 'changeForEdit');
        }
        this.activityLevelForAddContactIndex = index;
        // this.activityLevelForAddContactMode = mode;
        ModalUtil.showModal(this.modalId);
    }

    cancelSelectableUser2() {
        this.activityLevelForAddContact = {
            nextActivityLevel: {} as ActivityLevel,
            prevActivityLevel: {} as ActivityLevel,
            form: {} as Form,
        } as ActivityLevel;
        this.activityLevelForAddContactIndex = null;
        this.activityLevelForAddContactMode = null;
        ModalUtil.hideModal(this.modalId);
    }

    setUserInActivityLevel2() {

        if (this.activityLevelForAddContact.candidateMode === CandidateMode.user_mode) {
            if (this.activityLevelForAddContact.candidateUserIdList.length === 0) {
                DefaultNotify.notifyDanger('کاربری انتخاب نشده است.', '', NotiConfig.notifyConfig);
                return;
            } else {
                if (this.activityLevelForAddContact.candidateUserIdList.length === 1) {
                    this.activityLevelForAddContact.assignedUserId = JSON.parse(JSON.stringify(this.activityLevelForAddContact.candidateUserIdList[0]));
                    this.activityLevelForAddContact.candidateUserIdList = [];
                    ///  وقتی از پستی کاربری انتخاب نشده بود ان پست را از لیست پست های انتخاب شده بردارد
                    const userTypeIdList = [];
                    const userTypeId = this.userByUserTypeIdAndOrganizationId.find(u => u.id === this.activityLevelForAddContact.assignedUserId).userTypeId;
                    if (!userTypeIdList.some(id => id === userTypeId)) {
                        userTypeIdList.push(userTypeId);
                    }
                    this.activityLevelForAddContact.userTypeId = userTypeIdList;
                }
                if (this.activityLevelForAddContact.candidateUserIdList.length > 1) {
                    this.activityLevelForAddContact.assignedUserId = null;
                    ///  وقتی از پستی کاربری انتخاب نشده بود ان پست را از لیست پست های انتخاب شده بردارد
                    const userTypeIdList = [];
                    for (const userId of this.activityLevelForAddContact.candidateUserIdList) {
                        const userTypeId = this.userByUserTypeIdAndOrganizationId.find(u => u.id === userId).userTypeId;
                        if (!userTypeIdList.some(id => id === userTypeId)) {
                            userTypeIdList.push(userTypeId);
                        }
                    }
                    this.activityLevelForAddContact.userTypeId = userTypeIdList;
                }
                this.activity.activityLevelList[this.activityLevelForAddContactIndex].candidateMode =
                    this.activityLevelForAddContact.candidateMode;
                this.activity.activityLevelList[this.activityLevelForAddContactIndex].userTypeId =
                    this.activityLevelForAddContact.userTypeId;
                // this.activity.activityLevelList[this.activityLevelForAddContactIndex].userTypeName =
                //     this.activityLevelForAddContact.userTypeName;
                this.activity.activityLevelList[this.activityLevelForAddContactIndex].candidateUserIdList =
                    this.activityLevelForAddContact.candidateUserIdList;
                this.activity.activityLevelList[this.activityLevelForAddContactIndex].assignedUserId =
                    this.activityLevelForAddContact.assignedUserId;


                /////////////////////////////////////////////////
            }
        } else if (this.activityLevelForAddContact.candidateMode === CandidateMode.userType_mode) {
            this.activityLevelForAddContact.assignedUserId = null;
            this.activityLevelForAddContact.candidateUserIdList = [];
            this.activity.activityLevelList[this.activityLevelForAddContactIndex].candidateMode =
                this.activityLevelForAddContact.candidateMode;
            this.activity.activityLevelList[this.activityLevelForAddContactIndex].userTypeId =
                this.activityLevelForAddContact.userTypeId;
            // this.activity.activityLevelList[this.activityLevelForAddContactIndex].userTypeName =
            //     this.activityLevelForAddContact.userTypeName
            this.activity.activityLevelList[this.activityLevelForAddContactIndex].candidateUserIdList = [];

            this.activity.activityLevelList[this.activityLevelForAddContactIndex].assignedUserId =
                this.activityLevelForAddContact.assignedUserId;
        }
        ModalUtil.hideModal(this.modalId);


    }

    //     for (const item of this.activity.activityLevelList) {
    //         if (this.selectLevel.id === item.id) {
    //             // item.organizationId = this.organizationId;
    //             item.userTypeId = this.userTypeId;
    //             if (this.userIdList.length === 0 && this.activityLevelForEdit.candidateMode === CandidateMode.user_mode) {
    //                 DefaultNotify.notifyDanger('کاربری انتخاب نشده است.');
    //                 return;
    //             }
    //             if (this.userIdList.length === 1 && this.activityLevelForEdit.candidateMode === CandidateMode.user_mode) {
    //                 item.assignedUserId = this.userIdList[0];
    //                 item.candidateUserIdList = [];
    //             }
    //             if (this.userIdList.length > 1 && item.candidateMode === CandidateMode.user_mode) {
    //                 item.candidateUserIdList = [];
    //                 item.candidateUserIdList = this.userIdList;
    //                 item.assignedUserId = null;
    //             }
    //             if (item.candidateMode === CandidateMode.userType_mode) {
    //                 item.candidateUserIdList = [];
    //                 item.assignedUserId = null;
    //             }
    //             this.showOrgNameAndUserTypeNameInTable = new ShowOrgNameAndUserTypeNameInTable();
    //             // this.showOrgNameAndUserTypeNameInTable.OrgName = this.organizationList.find(e => e.id === organizationId).name;
    //             // this.showOrgNameAndUserTypeNameInTable.UserTypeName = this.userTypeListByOrg.find(e => e.id === userTypeId).name;
    //             // this.showOrgNameAndUserTypeNameInTable.UserTypeName = this.userTypeList.find(e => e.id === userTypeId).name;
    //             if (this.modeForShowModalSelectableUser === 'ADD') {
    //                 this.showOrgNameAndUserTypeNameInTableList.push(this.showOrgNameAndUserTypeNameInTable);
    //             }
    //             if (this.modeForShowModalSelectableUser === 'EDIT') {
    //                 this.showOrgNameAndUserTypeNameInTableList[this.index - 1] = this.showOrgNameAndUserTypeNameInTable;
    //             }
    //         }
    //     }
    //     this.selectedUserTypeId = null;
    //     // this.viewActivityLevelList();
    //     ModalUtil.hideModal(this.modalId);
    // }

    setUserInActivityLevel(userTypeId) {
        for (const item of this.activity.activityLevelList) {
            if (this.selectLevel.id === item.id) {
                // item.organizationId = this.organizationId;
                item.userTypeId = this.userTypeId;
                if (this.userIdList.length === 0 && this.activityLevelForEdit.candidateMode === CandidateMode.user_mode) {
                    DefaultNotify.notifyDanger('کاربری انتخاب نشده است.', '', NotiConfig.notifyConfig);
                    return;
                }
                if (this.userIdList.length === 1 && this.activityLevelForEdit.candidateMode === CandidateMode.user_mode) {
                    item.assignedUserId = this.userIdList[0];
                    item.candidateUserIdList = [];
                }
                if (this.userIdList.length > 1 && item.candidateMode === CandidateMode.user_mode) {
                    item.candidateUserIdList = [];
                    item.candidateUserIdList = this.userIdList;
                    item.assignedUserId = null;
                }
                if (item.candidateMode === CandidateMode.userType_mode) {
                    item.candidateUserIdList = [];
                    item.assignedUserId = null;
                }
                this.showOrgNameAndUserTypeNameInTable = new ShowOrgNameAndUserTypeNameInTable();
                // this.showOrgNameAndUserTypeNameInTable.OrgName = this.organizationList.find(e => e.id === organizationId).name;
                // this.showOrgNameAndUserTypeNameInTable.UserTypeName = this.userTypeListByOrg.find(e => e.id === userTypeId).name;
                this.showOrgNameAndUserTypeNameInTable.UserTypeName = this.userTypeList.find(e => e.id === userTypeId).name;
                if (this.modeForShowModalSelectableUser === 'ADD') {
                    this.showOrgNameAndUserTypeNameInTableList.push(this.showOrgNameAndUserTypeNameInTable);
                }
                if (this.modeForShowModalSelectableUser === 'EDIT') {
                    this.showOrgNameAndUserTypeNameInTableList[this.index - 1] = this.showOrgNameAndUserTypeNameInTable;
                }
            }
        }
        this.selectedUserTypeId = null;
        // this.viewActivityLevelList();
        ModalUtil.hideModal(this.modalId);
    }

    checkNextLevels(item) {
        for (const level of this.activity.activityLevelList) {
            if (!level.nextActivityLevel) {
                level.nextActivityLevel = new ActivityLevel();
            }
            if (item.id === level.nextActivityLevel.id && (level.existRecipientOrderUser)) {
                return true;
            }
        }
        return false;
    }

    setExistRecipientOrderUser(event, level, j) {
        // تکنسین چن تایی
        // if (event.checked) {
        //     level.existRecipientOrderUser = true;
        // } else if (!event.checked) {
        //     level.existRecipientOrderUser = false;
        // }
        // // for (let i = 0; i < this.activity.activityLevelList.length; i++) {
        // //   if (this.activity.activityLevelList[i].id === level.nextActivityLevel.id) {
        // //     this.activity.activityLevelList[i].candidateUserIdList = [];
        // //     this.activity.activityLevelList[i].assignedUserId = '';
        // //     this.activity.activityLevelList[i - 1].rightToChoose = false;
        // //   }
        // // }
        if (event.checked) {
            level.existRecipientOrderUser = true;
        } else {
            level.existRecipientOrderUser = false;
        }

        for (let i = 0; i < this.activity.activityLevelList.length; i++) {
            if (i !== j) {
                this.activity.activityLevelList[i].existRecipientOrderUser = false;
            }
        }
    }


    setAuthorizingUserRequest(event, level, j) {
        if (event.checked) {
            level.workRequestAcceptor = true;
        } else {
            level.workRequestAcceptor = false;
        }
        for (let i = 0; i < this.activity.activityLevelList.length; i++) {
            if (i !== j) {
                this.activity.activityLevelList[i].workRequestAcceptor = false;
            }
            // if (i === j) {
            //     this.activity.activityLevelList[i].workRequestAcceptor = true;
            // }
        }

    }


    setToActivityLevelForm(event) {
        this.activityLevelForEdit.formIdCopy = new FormId();
        this.activityLevelForEdit.formIdCopy.formId = event;
        this.activityLevelForEdit.formId = event;
    }


    changeNumberOfField(event: MatSlideToggleChange) {
        if (event.checked === true) {
            this.numberOfField = this.numberOfField + 1;
        } else if (event.checked === false) {
            this.numberOfField = this.numberOfField - 1;
        }
    }

    changeSetting() {
        this.clickInSave = true;
        if (this.loadingChangeSetting) {
            return;
        }
        if (JSON.stringify(this.workOrderAccessCopy) === JSON.stringify(this.workOrderAccess)) {
            DefaultNotify.notifyDanger('شما هیچ ویراشی انجام نداده اید', '', NotiConfig.notifyConfig);
            this.clickInSave = false;
            return;
        }
        if (isNullOrUndefined(this.activityLevelForEdit.workOrderAccessId)) {
            this.loadingChangeSetting = true;
            this.workOrderAccessService.create(this.workOrderAccess)
                .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
                this.loadingChangeSetting = false;
                this.activityLevelForEdit.workOrderAccessId = res.workOrderAccessId;
                ModalUtil.hideModal('accessWorkOrder');
                this.clickInSave = false;
                DefaultNotify.notifySuccess('با موفقیت ثبت شد', '', NotiConfig.notifyConfig);
            }, error => {
                this.clickInSave = false;
                this.loadingChangeSetting = false;
            });

        } else {
            this.loadingChangeSetting = true;
            this.workOrderAccessService.update(this.workOrderAccess, {workOrderAccessId: this.activityLevelForEdit.workOrderAccessId})
                .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
                ModalUtil.hideModal('accessWorkOrder');
                DefaultNotify.notifySuccess('با موفقیت ویرایش شد', '', NotiConfig.notifyConfig);
                this.loadingChangeSetting = false;
                this.clickInSave = false;
            }, error => {
                this.loadingChangeSetting = false;
                this.clickInSave = false;
            });

        }
    }

    showAccessWorkOrderModal() {
        ModalUtil.showModal('accessWorkOrder');
    }

    changeStaticFormsIdList() {


        if (!this.activityLevelForEdit.staticFormsIdList.some(e => e === 'information')) {
            this.checkedBoolean = false;
            this.selectWorOrderMaine = false;
            this.workOrderAccess = new WorkOrderAccess();
            this.workOrderAccessCopy = new WorkOrderAccess();
        } else {
            this.checkedBoolean = true;
            this.selectWorOrderMaine = true;

        }
    }

    selectBasicInformation(event) {


        // debugger
        if (isNullOrUndefined(this.activityLevelForEdit.workOrderAccessId) && event.target.checked) {
            ModalUtil.showModal('accessWorkOrder');
            this.selectWorOrderMaine = true;
            this.checkedBoolean = true;
            if (isNullOrUndefined(this.activityLevelForEdit.staticFormsIdList)) {
                this.activityLevelForEdit.staticFormsIdList = [];
            }
            if (!this.activityLevelForEdit.staticFormsIdList.some(e => e === 'information')) {
                this.activityLevelForEdit.staticFormsIdList = this.activityLevelForEdit.staticFormsIdList.concat(['information']);
            }
        } else if (!isNullOrUndefined(this.activityLevelForEdit.workOrderAccessId) && !event.target.checked) {
            this.activityLevelForEdit.workOrderAccessId = null;
            this.workOrderAccess = new WorkOrderAccess();
            this.workOrderAccessCopy = new WorkOrderAccess();
            this.selectWorOrderMaine = false;
            this.checkedBoolean = false;
            // this.activityLevelForEdit.staticFormsIdList = [];
            this.activityLevelForEdit.staticFormsIdList = this.activityLevelForEdit.staticFormsIdList.filter(e => e !== 'information');


        }
        if (isNullOrUndefined(this.activityLevelForEdit.workOrderAccessId) && !event.target.checked) {
            this.selectWorOrderMaine = false;
            this.checkedBoolean = false;
            this.workOrderAccess = new WorkOrderAccess();
            this.workOrderAccessCopy = new WorkOrderAccess();
            this.activityLevelForEdit.staticFormsIdList = this.activityLevelForEdit.staticFormsIdList.filter(e => e !== 'information');

        }
        if (!isNullOrUndefined(this.activityLevelForEdit.workOrderAccessId) && event.target.checked) {
            this.selectWorOrderMaine = true;
            this.checkedBoolean = true;
            if (isNullOrUndefined(this.activityLevelForEdit.staticFormsIdList)) {
                this.activityLevelForEdit.staticFormsIdList = [];
            }
            if (!this.activityLevelForEdit.staticFormsIdList.some(e => e === 'information')) {
                this.activityLevelForEdit.staticFormsIdList = this.activityLevelForEdit.staticFormsIdList.concat(['information']);
            }
        }
    }

    doValidForm() {
        if (this.form.valid) {
            $('.valid-error.ng-valid').parent().removeClass('invalid-field');
        }
    }

    doNullItemsOfWorkOrderAccess() {
        if (isNullOrUndefined(this.activityLevelForEdit.workOrderAccessId)) {
            this.workOrderAccess = new WorkOrderAccess();
            this.workOrderAccessCopy = new WorkOrderAccess();
        }
    }

    selectUser2(event, idIn) {
        if (event.target.checked) {
            if (!this.activityLevelForAddContact.candidateUserIdList.some(id => id === idIn)) {
                this.activityLevelForAddContact.candidateUserIdList.push(idIn);
            }
        } else if (!event.target.checked) {
            const index = this.activityLevelForAddContact.candidateUserIdList.findIndex(id => id === idIn);
            if (index !== -1) {
                this.activityLevelForAddContact.candidateUserIdList.splice(index, 1);
            }

        }
        if (this.activityLevelForAddContact.candidateUserIdList.length === this.userByUserTypeIdAndOrganizationId.length) {
            this.selectAllUserBoolean = true;
        } else {

            this.selectAllUserBoolean = false;
        }

    }

    selectUser(event, i) {
        if (event.target.checked) {
            this.selectedUser = new Class();
            this.selectedUser = this.userByUserTypeIdAndOrganizationId[i];
            if (isNullOrUndefined(this.userIdList)) {
                this.userIdList = [];
            }
            this.userIdList.push(this.selectedUser.id);
            if (this.userIdList.length === this.userByUserTypeIdAndOrganizationId.length) {
                this.selectAllUserBoolean = true;
            }
        } else if (!event.target.checked) {
            this.selectedUser = new Class();
            this.selectedUser = this.userByUserTypeIdAndOrganizationId[i];
            this.userIdList = this.userIdList.filter(e => e !== this.selectedUser.id);
            if (this.userIdList.length !== this.userByUserTypeIdAndOrganizationId.length) {
                this.selectAllUserBoolean = false;
            }

        }
    }

    selectAllUser(event) {
        if (event.target.checked) {
            this.activityLevelForAddContact.candidateUserIdList = [];
            for (const item of this.userByUserTypeIdAndOrganizationId) {
                this.activityLevelForAddContact.candidateUserIdList.push(item.id);
                item.selectedUserBoolean = true;
            }
        } else if (!event.target.checked) {
            this.activityLevelForAddContact.candidateUserIdList = [];
            for (const item of this.userByUserTypeIdAndOrganizationId) {
                item.selectedUserBoolean = false;
            }
        }
    }

    getAllUserType() {
        if (!this.allowGetAllUserType) {
            return;
        }
        this.loadingUserTypeList = true;
        this.userTypeService.getAllRole()
            .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            this.loadingUserTypeList = false;
            this.allowGetAllUserType = false;
            if (!isNullOrUndefined(res)) {
                this.userTypeList = res;
            }
        });
    }

    // selectedUser = new GetUser();

    changeUserType(event, type) {
        if (type === 'changHtml') {
            this.activityLevelForAddContact.candidateUserIdList = [];
            this.userByUserTypeIdAndOrganizationId = [];
        }
        if (event) {
            // this.selectedUserTypeId = event.id;
            // this.userList = [];
            // this.selectedUser = new GetUser();
            if (type === 'changHtml') {
                this.activityLevelForAddContact.candidateMode = CandidateMode.userType_mode;
                // this.activityLevelForAddContact.userTypeName =
                //     this.userTypeList.find(u => u.id === this.activityLevelForAddContact.userTypeId).name;
            }
            this.getAllUsersOfUserTypeList();
        } else {
            // this.activityLevelForAddContact.userTypeName = null;
            this.activityLevelForAddContact.userTypeId = null;
            // this.selectedUserTypeId = null;
        }

    }

    //// خواندن کاربران بر اساس لیست پست ها

    getAllUsersOfUserTypeList() {
        if (this.activityLevelForAddContact.userTypeId.length > 0) {

            this.userService.getAllUsersOfUserTypeList(
                this.activityLevelForAddContact.userTypeId
            ).pipe(takeUntilDestroyed(this)).subscribe((res: any[]) => {
                this.loadingUserList = false;
                this.userByUserTypeIdAndOrganizationId = res;
                if (this.activityLevelForAddContact.candidateMode === CandidateMode.user_mode) {
                    for (const user of this.userByUserTypeIdAndOrganizationId) {
                        if (this.activityLevelForAddContact.candidateUserIdList.some(id => id === user.id)) {
                            user.selectedUserBoolean = true;
                        }
                    }
                }
            });
        }
    }

    //// خواندن کاربران بر اساس یک پست

    getAllUsersOfUserType() {
        const paging = new Paging();
        paging.size = 15;
        this.loadingUserList = true;
        this.userService.getAllUsersOfUserType({
            paging,
            totalElements: 0,
            userTypeId: this.activityLevelForAddContact.userTypeId
        })
            .pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<Class>) => {
            this.loadingUserList = false;
            this.userByUserTypeIdAndOrganizationId = res.content;
            if (this.activityLevelForAddContact.candidateMode === CandidateMode.user_mode) {
                for (const user of this.userByUserTypeIdAndOrganizationId) {
                    if (this.activityLevelForAddContact.candidateUserIdList.some(id => id === user.id)) {
                        user.selectedUserBoolean = true;
                    }
                }
            }
        });
    }

    test() {
    }

// /////////////////////////////////////////////////////////ghasem!!!

    onChangeUserTypeMode($event: MatCheckboxChange) {
        this.activityLevelForAddContact.candidateUserIdList = [];
        for (const user of this.userByUserTypeIdAndOrganizationId) {
            user.selectedUserBoolean = false;
        }
        if ($event.checked === true) {
            this.activityLevelForAddContact.candidateMode = CandidateMode.userType_mode;
        } else {
            this.activityLevelForAddContact.candidateMode = CandidateMode.user_mode;
        }


    }

    onChangeUserMode($event: MatCheckboxChange) {
        this.activityLevelForAddContact.candidateUserIdList = [];
        if ($event.checked === true) {
            this.activityLevelForAddContact.candidateMode = CandidateMode.user_mode;
        } else {
            this.activityLevelForAddContact.candidateMode = CandidateMode.userType_mode;
        }

    }

    onChange($event: MatCheckboxChange, from: number) {
        if (from === 2 && $event.checked === true) {
            this.showSelectUserTable = true;
            this.activityLevelForEdit.candidateMode = CandidateMode.user_mode;
            this.selectAllUserBoolean = false;
            if (!this.activityLevelForEdit.candidateUserIdList && !this.activityLevelForEdit.assignedUserId) {
                this.userIdList = [];
                for (const item of this.userByUserTypeIdAndOrganizationId) {
                    this.userIdList.push(item.id);
                    item.selectedUserBoolean = true;
                }
            }
            if (this.activityLevelForEdit.candidateUserIdList) {
                if (this.activityLevelForEdit.candidateUserIdList.length === 0 && !this.activityLevelForEdit.assignedUserId) {
                    this.userIdList = [];
                    for (const item of this.userByUserTypeIdAndOrganizationId) {
                        this.userIdList.push(item.id);
                        item.selectedUserBoolean = true;
                    }
                }
            }
            if (this.userByUserTypeIdAndOrganizationId.length > 0) {
                setTimeout(() => {
                    if (this.userIdList) {
                        if (this.userIdList.length > 0) {
                            if (this.userIdList.length === this.userByUserTypeIdAndOrganizationId.length) {
                                this.selectAllUserBoolean = true;
                            }
                            for (const user of this.userByUserTypeIdAndOrganizationId) {
                                for (const item of this.userIdList) {
                                    if (item === user.id) {
                                        user.selectedUserBoolean = true;
                                    }
                                }
                            }
                        } else if (this.userIdList.length === 0) {
                            $('#selectAllUser').click();
                            this.selectAllUserBoolean = true;
                        }
                    } else if (!this.userIdList) {
                        $('#selectAllUser').click();
                        this.selectAllUserBoolean = true;
                    }
                }, 50);
            }
        }
        if (from === 2 && $event.checked === false) {
            this.showSelectUserTable = false;
            this.activityLevelForEdit.candidateMode = CandidateMode.userType_mode;
            this.activityLevelForEdit.candidateUserIdList = [];
        }
        if (from === 1 && $event.checked === true) {
            this.showSelectUserTable = false;
            this.activityLevelForEdit.candidateMode = CandidateMode.userType_mode;
            this.activityLevelForEdit.candidateUserIdList = [];
        }
        if (from === 1 && $event.checked === false) {
            this.showSelectUserTable = true;
            this.activityLevelForEdit.candidateMode = CandidateMode.user_mode;
            this.selectAllUserBoolean = false;
            if (!this.activityLevelForEdit.candidateUserIdList && !this.activityLevelForEdit.assignedUserId) {
                this.userIdList = [];
                for (const item of this.userByUserTypeIdAndOrganizationId) {
                    this.userIdList.push(item.id);
                    item.selectedUserBoolean = true;
                }
            }
            if (this.activityLevelForEdit.candidateUserIdList) {
                if (this.activityLevelForEdit.candidateUserIdList.length === 0 && !this.activityLevelForEdit.assignedUserId) {
                    this.userIdList = [];
                    for (const item of this.userByUserTypeIdAndOrganizationId) {
                        this.userIdList.push(item.id);
                        item.selectedUserBoolean = true;
                    }
                }
            }
            if (this.userByUserTypeIdAndOrganizationId.length > 0) {
                setTimeout(() => {
                    if (this.userIdList) {
                        if (this.userIdList.length > 0) {
                            if (this.userIdList.length === this.userByUserTypeIdAndOrganizationId.length) {
                                this.selectAllUserBoolean = true;
                            }
                            for (const user of this.userByUserTypeIdAndOrganizationId) {
                                for (const item of this.userIdList) {
                                    if (item === user.id) {
                                        user.selectedUserBoolean = true;
                                    }
                                }
                            }
                        } else if (this.userIdList.length === 0) {
                            $('#selectAllUser').click();
                            this.selectAllUserBoolean = true;
                        }
                    } else if (!this.userIdList) {
                        $('#selectAllUser').click();
                        this.selectAllUserBoolean = true;
                    }
                }, 50);
            }
        }

    }

    checkedSelectedUser(id: string) {
        return this.userIdList.find(e => e === id);
    }
}

export class ActivityLevelForAddedToStep {
    userTypeId: string[];
    organizationId: string;
    userId: string[];
    userName: string;
    userTypeName: string;
    organizationName: string;
    recipe: string;
    title: string;
    id: string;
    formId: string;
    formTitle: string;
}


export class Class {
    family: string;
    id: string;
    name: string;
    nationalCode: string;
    orgAndUserTypeList: any[];
    password: string;
    registerDate: string;
    resetPasswordCode: string;
    username: string;
    userTypeName: string;
    userTypeId: string;
    selectedUserBoolean = false;
}

export class ShowOrgNameAndUserTypeNameInTable {
    // OrgName: string;
    UserTypeName: string;
}
