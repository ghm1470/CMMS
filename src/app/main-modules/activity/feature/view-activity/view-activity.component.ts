import {AfterViewInit, Component, Injector, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivityBaseComponent} from '../shared/activity-base-component';
import {ActionMode, DefaultNotify, ModalSize} from '@angular-boot/util';
import {Activity} from '../../model/activity';
import {ActivityLevel} from '../../model/activityLevel';
import {Form, FormId} from '../../../formBuilder/fb-model/form/form';
import {UserType} from '../../../securityManagement/model/userType';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {OrganizationDto} from '../../../basicInformation/organization/model/organizationDto';
import {ModalUtil} from '@angular-boot/widgets';
import {WorkOrderAccess} from '../../model/work-order-access';
import {ActivityService} from '../../service/activity.service';
import {UserTypeService} from '../../../securityManagement/endpoint/user-type.service';
import {OrganizationService} from '../../../basicInformation/organization/endpoint/organization.service';
import {ActivatedRoute} from '@angular/router';
import {WorkOrderAccessService} from '../../service/work-order-access/work-order-access.service';
import {untilDestroyed} from '../../../../shared/service/take-until-destroy';
import {isNullOrUndefined} from 'util';
import {takeUntilDestroyed} from '@angular-boot/core';
import {MatSlideToggleChange} from '@angular/material';
import {FormService} from '../../../form-builder2/service/form.service';
import {NotiConfig} from '../../../../shared/tools/notifyConfig';

declare var $: any;
@Component({
  selector: 'app-view-activity',
  templateUrl: './view-activity.component.html',
  styleUrls: ['./view-activity.component.scss']
})
export class ViewActivityComponent extends ActivityBaseComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() formIdList: string[] = [];

  ActionMode = ActionMode;
  workOrderList: string[];

  activity: Activity = {
    activityLevelList: [] as ActivityLevel[]
  } as Activity;

  activityLevel: ActivityLevel = {
    // personList: [] as User[],
    nextActivityLevel: {} as ActivityLevel,
    prevActivityLevel: {} as ActivityLevel,
    form: {} as Form,
     } as ActivityLevel;
  formList: any[] = [];
  userTypeList: UserType[] = [];
  form: FormGroup;
  activityLevelForm: FormGroup;
  selectWorOrderMaine = false;
  saveButton: boolean;
  createActivityLevel = true;
  editActivityStatus = false;
  addNewActivity = true;
  activityLevelRecipe: string;
  setActivityLevelNOP: string;
  activityLevelTitle: string;
  activityLevelId: string;
  organizationId: string;
  activityId = '';
  idCounter = 1;
  stepNumber = '';
  number: number;
  s: string;
  m: string;
  numberOfField = 0;
  organizationList: OrganizationDto.Create[] = [];
  userTypeListByOrg: any[] = [];
  workOrderLength: number;
  organizationName: string;


  userByUserTypeIdAndOrganizationId: any [] = [];
  findId = new ActivityLevelForAddedToStep();

  status = false;

  selectLevel = new ActivityLevelForAddedToStep();
  modalId = ModalUtil.generateModalId();
  MyModalSize = ModalSize;
  workOrderAccess = new WorkOrderAccess();
  fieldsIsExistInWorOrderLis: string[] = [];
  fieldsIsExistInWorOrderLisCopy: string[] = [];
  fieldsIsExistInWorOrder: string;
  activityLevelForAddedToStep: ActivityLevelForAddedToStep[] = [];
  result: any;
  userTypeId: string;
  userId: string[];
  ShowOrgAndUserTypeAndUserModal = false;
  userList: string[];


  constructor(
    injector: Injector,
    public activityService: ActivityService,
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


  ngAfterViewInit(): void {
    this.removeInValidClass();
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

  ngOnInit() {
    // const user: any = JSON.parse(sessionStorage.getItem('user'));
    // // this.activity.organizationId = user.orgId;
    // this.activatedRoute.params
    // // وقتی دیتایی از بین بره
    //   .pipe(untilDestroyed(this))
    //   .subscribe(param => {
    //     this.activityId = param.id;
    //
    //     if (!isNullOrUndefined(this.activityId)) {
    //
    //       this.activityService.getOneActivity({activityId: this.activityId})
    //         .pipe(untilDestroyed(this))
    //         .subscribe((res: any) => {
    //           const result = res.data;
    //           const length = result.activityLevelList.length;
    //           for (let i = 0; i < length; i++) {
    //             // if (isNullOrUndefined(result.activityLevelList[i].organizationId)) {
    //             //   result.activityLevelList[i].organizationId = null;
    //             // }
    //             // ==================================tttt=======================================
    //             if (!isNullOrUndefined(result.activityLevelList[i].staticFormsIdList)) {
    //
    //               for (const item of result.activityLevelList[i].staticFormsIdList) {
    //                 this.fieldsIsExistInWorOrder = item;
    //                 this.fieldsIsExistInWorOrderLis.push(this.fieldsIsExistInWorOrder);
    //                 this.fieldsIsExistInWorOrderLisCopy = this.fieldsIsExistInWorOrderLis;
    //               }
    //             }
    //             if (isNullOrUndefined(result.activityLevelList[i].prevActivityLevel) ||
    //               isNullOrUndefined(result.activityLevelList[i].prevActivityLevel.id)) {
    //               result.activityLevelList[i].prevActivityLevel = undefined;
    //             }
    //             if (isNullOrUndefined(result.activityLevelList[i].nextActivityLevel) ||
    //               isNullOrUndefined(result.activityLevelList[i].nextActivityLevel.id)) {
    //               result.activityLevelList[i].nextActivityLevel = undefined;
    //             }
    //             if (!isNullOrUndefined(result.activityLevelList[i].workOrderAccessId)) {
    //               const t = result.activityLevelList[i].staticFormsIdList.filter(e => e !== 'workOrder');
    //               result.activityLevelList[i].staticFormsIdList = [];
    //               result.activityLevelList[i].staticFormsIdList = t;
    //             }
    //           }
    //           this.createActivityLevel = false;
    //           this.addNewActivity = false;
    //           this.activity = result;
    //           this.viewActivityLevelListAfterGetOne();
    //         }, error => {
    //           alert('error');
    //
    //         });
    //     }
    //   });
    //
    //
    // // this.getAllOrganization();
    // // this.formService.getAllLimit(this.activity.organizationId)
    // this.formService.getAllLimit(null)
    //   .pipe(untilDestroyed(this))
    //   .subscribe((res: Form[]) => {
    //     this.formList = res;
    //     if (this.formList.length < 1) {
    //       DefaultNotify.notifyDanger(
    //         'کاربر گرامی ابتدا فرم مربوط به هر بخش را از منوی فرم ساز ثبت نموده سپس اقدام به ثبت فرآیند نمائید.');
    //     }
    //   });
    //
    // const startActivityLevel = {
    //   id: 'start',
    //   title: 'شروع',
    //   recipe: '---',
    //   nextActivityLevel: {} as ActivityLevel,
    //   prevActivityLevel: null,
    //   firstStepIs: true,
    //   userTypeId: null,
    //   organizationId: null,
    //   assignedUserId: null,
    //   candidateUserIdList: null,
    // } as ActivityLevel;
    // this.activity.activityLevelList.push(startActivityLevel);
  }

  setNOPLevel(value) {
    if (this.activity.activityLevelList.length < 2) {
      DefaultNotify.notifyDanger('مراحل روند ثبت نشده است.', '', NotiConfig.notifyConfig);
      return;
    }
    this.createActivityLevel = value;
    if (this.activity.activityLevelList[this.activity.activityLevelList.length - 1].title !== 'پایان') {
      const endActivityLevel = {
        id: 'end',
        title: 'پایان',
        recipe: '---',
        nextActivityLevel: null,
        prevActivityLevel: null,
        lastStepIs: true,
        userTypeId: null,
        organizationId: null,
        assignedUserId: null,
        candidateUserIdList: null,
      } as ActivityLevel;
      this.activity.activityLevelList.push(endActivityLevel);
    }
    this.selectStep(2);
  }





  edit(id, index) {
    this.activityLevel = new ActivityLevel();
    this.findId = null;
    this.workOrderAccess = new WorkOrderAccess();
    this.selectWorOrderMaine = false;
    if (this.activityLevelForAddedToStep[index]) {
      this.findId = this.activityLevelForAddedToStep[index];
    }
    this.activityLevel = JSON.parse(JSON.stringify(this.activity.activityLevelList[index + 1]));
    if (!isNullOrUndefined(this.activityLevel.formIdCopy)) {
      this.activityLevel.form.id = this.activityLevel.formIdCopy.formId;
    }

    if (!isNullOrUndefined(this.activity.activityLevelList[index + 1].staticFormsIdList)) {
      this.workOrderList = this.activity.activityLevelList[index + 1].staticFormsIdList;
      if (this.activity.activityLevelList[index + 1].workOrderAccessId) {
        this.getOnWorkOrderAccess();
        this.selectWorOrderMaine = true;
        $( '#rootBuilding' ).prop( 'checked', true );
        setTimeout(() => {
          $( '#rootBuilding' ).prop( 'disabled', true );
        }, 50);
        if (!isNullOrUndefined(this.activity.activityLevelList[index + 1].staticFormsIdList.find( e => e === 'workOrder'))) {
          const indexSFI = this.activity.activityLevelList[index + 1].staticFormsIdList.findIndex(e => e === 'workOrder');
          this.activity.activityLevelList[index + 1].staticFormsIdList.splice(indexSFI, 1);
        }
      } else {
        $( '#rootBuilding' ).prop( 'checked', false );
        setTimeout(() => {
          $( '#rootBuilding' ).prop( 'disabled', true );
        }, 50);
      }
    }
    if (isNullOrUndefined(this.activity.activityLevelList[index + 1].staticFormsIdList) &&
      !isNullOrUndefined(this.activity.activityLevelList[index + 1].workOrderAccessId)) {
      this.getOnWorkOrderAccess();
      this.selectWorOrderMaine = true;
    }
    this.editActivityStatus = true;
    let top = document.getElementById('activityFormStep2');

    if (top !== null) {

      top.scrollIntoView();
      top = null;
    }
  }

  getOnWorkOrderAccess() {
    this.workOrderAccessService.getOne({workOrderAccessId: this.activityLevel.workOrderAccessId})
      .pipe(takeUntilDestroyed(this)).subscribe((res: WorkOrderAccess) => {
      this.workOrderAccess = res;
    });
  }

  delete(id) {
    const length = this.activity.activityLevelList.length;
    for (let i = 0; i < length; i++) {

      if (this.activity.activityLevelList[i].id === id) {
        for (let j = 0; j < length; j++) {
          if (!isNullOrUndefined(this.activity.activityLevelList[j].nextActivityLevel) &&
            !isNullOrUndefined(this.activity.activityLevelList[j].nextActivityLevel.id) &&
            this.activity.activityLevelList[j].nextActivityLevel.id === id) {
            this.activity.activityLevelList[j].nextActivityLevel = new ActivityLevel();
          }
          if (!isNullOrUndefined(this.activity.activityLevelList[j].prevActivityLevel) &&
            !isNullOrUndefined(this.activity.activityLevelList[j].prevActivityLevel.id) &&
            this.activity.activityLevelList[j].prevActivityLevel.id === id) {
            this.activity.activityLevelList[j].prevActivityLevel = new ActivityLevel();
          }
        }
        this.activity.activityLevelList.splice(i, 1);
        if (this.activity.activityLevelList[i].staticFormsIdList && this.activity.activityLevelList[i].staticFormsIdList.length) {
          for (let j = 0; j < this.activity.activityLevelList[i].staticFormsIdList.length; j++) {
            this.fieldsIsExistInWorOrderLisCopy.splice(j, 1);
          }
        }
      }
    }
    // اینو برای مدل جدید اضافه کردم
    for (let k = 0; k < this.activityLevelForAddedToStep.length; k++) {
      if (this.activityLevelForAddedToStep[k].id === id) {
        this.activityLevelForAddedToStep.splice(k, 1);
      }
    }
  }


  // ********************************** org setup ***********************************

  getAllOrganization() {
    this.organizationService.getAll().pipe(takeUntilDestroyed(this))
      .subscribe(res => {
        if (res) {
          this.organizationList = res;
        }
      });
  }
  // ********************************** org setup ***********************************


  setUserTypeDetails(userTypeId, orgId) {
    this.activityService.getUserByUserTypeIdAndOrganizationId({userTypeId, organizationId: orgId})
      .subscribe(res => {
        if (!isNullOrUndefined(res)) {
          this.userByUserTypeIdAndOrganizationId = res;
        }
      });
  }

  backToStepTwo() {
    this.activity.activityLevelList.splice(this.activity.activityLevelList.length - 1, 1);
    this.selectStep(1);
  }

  selectStep(stepNumber: number) {

    if (stepNumber === 0) {
      this.stepNumber = 'activity-step-0';
      $('#activity-step-0').addClass('active');
    } else if (stepNumber === 1) {
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
    }
  }

  ngOnDestroy(): void {
  }

  backToList() {
    this.router.navigateByUrl('/panel/activity/list');

  }


  viewActivityLevelList() {
    if (this.findId === null) {
      const l = new ActivityLevelForAddedToStep();

      l.title = this.activityLevel.title;
      l.recipe = this.activityLevel.recipe;
      l.id = this.idCounter.toString();

      for (const item of this.organizationList) {
        if (item.id === this.activityLevel.organizationId) {
          l.organizationId = item.id;
          l.organizationName = item.name;
        }
      }

      for (const item of this.userTypeListByOrg) {
        if (item.id === this.activityLevel.userTypeId) {
          l.userTypeId = item.id;
          l.userTypeName = item.name;
        }
      }
      for (const item of this.userByUserTypeIdAndOrganizationId) {
        if (item.id === this.activityLevel.assignedUserId) {
          l.userId.push(item.id);
          l.userName = item.name;
        }
      }
      for (const item of this.formList) {
        if (item.id === this.activityLevel.form.id) {
          l.formId = item.id;
          l.formTitle = item.title;
        }
      }
      this.activityLevelForAddedToStep.push(l);

    } else if (this.findId.id !== null) {
      this.findId.title = this.activityLevel.title;
      this.findId.recipe = this.activityLevel.recipe;

      for (const item of this.organizationList) {
        if (item.id === this.activityLevel.organizationId) {
          this.findId.organizationId = item.id;
          this.findId.organizationName = item.name;
        }
      }

      for (const item of this.userTypeListByOrg) {
        if (item.id === this.activityLevel.userTypeId) {
          this.findId.userTypeId = item.id;
          this.findId.userTypeName = item.name;
        }
      }
      for (const item of this.userByUserTypeIdAndOrganizationId) {
        if (this.activityLevel.assignedUserId) {
          if (item.id === this.activityLevel.assignedUserId) {
            this.findId.userId = JSON.parse(JSON.stringify(item.id));
            this.findId.userName = JSON.parse(JSON.stringify( item.name));
          }
          }
      }
      for (const item of this.formList) {
        if (item.id === this.activityLevel.form.id) {
          this.findId.formId = item.id;
          this.findId.formTitle = item.title;
        }
      }

      this.findId = new ActivityLevelForAddedToStep();

    }


  }


  viewActivityLevelListAfterGetOne() {
    this.activityLevelForAddedToStep = [];
    const oneItem = this.activity.activityLevelList;
    for (let k = 0; k < this.activity.activityLevelList.length; k++) {
      if (oneItem[k].id !== 'start' && oneItem[k].id !== 'end') {
        if (oneItem[k].candidateUserIdList) {
          if (oneItem[k].candidateUserIdList.length) {
            this.userList = oneItem[k].candidateUserIdList;
          }
        }
        // this.activityService.getUserNameOrganisationNameAndUserTypeName({
        //   organisationId: oneItem[k].organizationId,
        //   userTypeId: oneItem[k].userTypeId,
        //   userId: this.userList,
        // }).subscribe(res => {
        //   ;
        //   this.result = res;
        //   const l = new ActivityLevelForAddedToStep();
        //   l.userName = this.result.username;
        //   l.organizationName = this.result.organizationName;
        //   l.userTypeName = this.result.userTypeName;
        //
        //   l.organizationId = oneItem[k].organizationId;
        //   l.userTypeId = oneItem[k].userTypeId;
        //   l.userId = this.userList;
        //
        //   l.title = oneItem[k].title;
        //   l.recipe = oneItem[k].recipe;
        //   // l.id = this.idCounter.toString();
        //   l.id = oneItem[k].id;
        //
        //   if (oneItem[k].form.id) {
        //     for (const item of this.formList) {
        //       if (item.id === oneItem[k].form.id) {
        //         l.formId = oneItem[k].formId;
        //         l.formTitle = oneItem[k].title;
        //
        //       }
        //     }
        //   } else {
        //     l.formId = null;
        //     l.formTitle = null;
        //
        //   }
        //   this.activityLevelForAddedToStep.push(l);
        //
        //
        // });

        if (this.userTypeListByOrg.length === 0) {
          this.userTypeService.getAllUserTypesOfThOrganization({organizationId: oneItem[k].organizationId})
            .subscribe(res => {
              if (!isNullOrUndefined(res)) {
                this.userTypeListByOrg = res;

              }
            });

        }
        if (this.userByUserTypeIdAndOrganizationId.length === 0) {
          this.setUserTypeDetails(oneItem[k].userTypeId, oneItem[k].organizationId);
        }
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
    }

  }
  showModalSelectableUser(item) {
    this.ShowOrgAndUserTypeAndUserModal = true;
    this.activityLevel = item;
    this.selectLevel = item;
    this.organizationId = item.organizationId;
    this.userTypeId = item.userTypeId;
    this.userId = item.userId;
    setTimeout(() => {
      ModalUtil.showModal(this.modalId);
    }, 50);
  }

  setUserInActivityLevel() {
    // this.activityLevel.organizationId = this.selectLevel.organizationId;
    // this.activityLevel.userTypeId = this.selectLevel.userTypeId;
    // this.activityLevel.userId = this.selectLevel.userId;
    // const indexLevel = this.activity.activityLevelList.findIndex(e => e.id === this.activityLevel.id);
    // for (const item of this.activity.activityLevelList) {
    //   if (this.selectLevel.id === item.id) {
    //     item.organizationId = this.organizationId;
    //     item.userTypeId = this.userTypeId;
    //     if (this.userId.length === 1) {
    //       item.assignedUserId = this.userId[0];
    //     }
    //     if (this.userId.length > 1) {
    //       item.candidateUserIdList = this.userId;
    //     }
    //   }
    //
    // }
    this.viewActivityLevelList();
    ModalUtil.hideModal(this.modalId);
  }

  checkNextLevels(item) {
    for (const level of this.activity.activityLevelList) {
      if (!level.nextActivityLevel) {
        level.nextActivityLevel = new ActivityLevel();
      }
      if (item.id === level.nextActivityLevel.id && (level.rightToChoose || level.existRecipientOrderUser)) {
        return true;
      }
    }
    return false;
  }

  setExistRecipientOrderUser(event, level) {
    if (event.checked) {
      level.existRecipientOrderUser = true;
    } else if (!event.checked) {
      level.existRecipientOrderUser = false;
    }
    for (let i = 0; i < this.activity.activityLevelList.length ; i ++) {
      if (this.activity.activityLevelList[i].id === level.nextActivityLevel.id) {
        this.activity.activityLevelList[i].candidateUserIdList = [];
        this.activity.activityLevelList[i].assignedUserId = '';
        this.activity.activityLevelList[i - 1].rightToChoose = false;
      }
    }
  }

  setRightToChoose(event, level) {
    if (event.checked) {
      level.rightToChoose = true;
    } else if (!event.checked) {
      level.rightToChoose = false;
    }
    for (let i = 0; i < this.activity.activityLevelList.length; i++) {
      if (this.activity.activityLevelList[i].id === level.nextActivityLevel.id) {
        this.activity.activityLevelList[i].candidateUserIdList = [];
        this.activity.activityLevelList[i].assignedUserId = '';
        this.activity.activityLevelList[i - 1].existRecipientOrderUser = false;
      }
    }
  }


  levelUser(item: ActivityLevel) {
    // for (const level of this.activityLevelForAddedToStep) {
    //   if (item.userId === level.userId) {
    //     // alert(level.userName)
    //
    //     return level.userName;
    //   }
    // }
    // return '';
  }

  checkWorkOrderFormInLevel(form) {
    if (!isNullOrUndefined(this.fieldsIsExistInWorOrderLisCopy.find(e => e === 'workOrder'))) {
      if (isNullOrUndefined(this.workOrderList)) {
        if (!isNullOrUndefined(this.fieldsIsExistInWorOrderLisCopy.find(e => e === form))) {
          return true;
        } else {
          return false;
        }
      } else if (!isNullOrUndefined(this.workOrderList)) {
        if (!isNullOrUndefined(this.fieldsIsExistInWorOrderLisCopy.find(e => e === form))) {
          if (!isNullOrUndefined(this.workOrderList.find(e => e === form))) {
            return false;
          } else {
            return true;
          }
        }
      }
    } else if (isNullOrUndefined(this.fieldsIsExistInWorOrderLisCopy.find(e => e === 'workOrder'))) {
      if (form === 'workOrder') {
        return false;
      } else {
        return true;
      }
    }
    // ===================================================
    // this.existOtherField = null;
    // this.existWorkOrderField = null;
    // this.existWorkOrderField =  this.fieldsIsExistInWorOrderLis.find( e => e === 'workOrder');
    // this.existOtherField =  this.fieldsIsExistInWorOrderLis.find( e => e === form);
    // if (this.workOrderList && this.workOrderList.length > 0) {
    //   this.m = this.workOrderList.find( e => e === form);
    // }
    // if (isNullOrUndefined(this.existWorkOrderField)) {
    //   if (form === 'workOrder' || isNullOrUndefined( this.existOtherField) ||  (!isNullOrUndefined( this.existOtherField)   &&
    //     !isNullOrUndefined(this.m))) {
    //     return false;
    //   } else {
    //     return true;
    //   }
    // } else if (!isNullOrUndefined(this.existWorkOrderField)) {
    //     if (!isNullOrUndefined( this.existOtherField) && isNullOrUndefined(this.m)) {
    //       return true;
    //     } else {
    //       return false;
    //     }
    //
    // }
    //
  }

  kkkkk(event) {
    this.activityLevel.formIdCopy = new FormId();
    this.activityLevel.formIdCopy.formId = event;
    this.activityLevel.form.id = event;
  }


  wwwwww(workOrderList: any[], $event) {
    // =====================================================
    if (!this.workOrderList || !this.workOrderList.length) {
      this.workOrderLength = 0;
    } else {
      this.workOrderLength = this.workOrderList.length;
    }
    if (workOrderList.length < this.workOrderLength) {
      for (const item of workOrderList) {
        const i = this.workOrderList.findIndex(e => e === item);
        this.workOrderList.splice(i, 1);
      }
      if (!isNullOrUndefined(this.fieldsIsExistInWorOrderLisCopy.find(e => e === this.workOrderList[0]))) {
        const j = this.fieldsIsExistInWorOrderLisCopy.findIndex(e => e === this.workOrderList[0]);
        this.fieldsIsExistInWorOrderLisCopy.splice(j, 1);
      }
    }


    // =====================================================
    if (this.selectWorOrderMaine === false) {
      for (const item of workOrderList) {
        if (item === 'workOrder') {
          this.fieldsIsExistInWorOrderLisCopy.push('workOrder');
          this.selectWorOrderMaine = true;
          ModalUtil.showModal('accessWorkOrder');
        }
      }
    } else if (this.selectWorOrderMaine === true) {
      if (isNullOrUndefined(workOrderList.find(e => e === 'workOrder'))) {
        this.fieldsIsExistInWorOrderLisCopy.filter(e => e === 'workOrder');
        this.selectWorOrderMaine = false;
      }
    }
    this.workOrderList = workOrderList;
  }

  changeNumberOfField(event: MatSlideToggleChange) {
    // console.log('checked', event.checked);
    // console.log('workOrderAccess', this.workOrderAccess);
    if (event.checked === true) {
      this.numberOfField = this.numberOfField + 1;
    } else if (event.checked === false) {
      this.numberOfField = this.numberOfField - 1;
    }
  }

  changeSetting() {
    if (isNullOrUndefined(this.activityLevel.workOrderAccessId)) {
      this.workOrderAccessService.create(this.workOrderAccess)
        .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
        this.activityLevel.workOrderAccessId = res.workOrderAccessId;
        ModalUtil.hideModal('accessWorkOrder');
        DefaultNotify.notifySuccess('با موفقیت ثبت شد', '', NotiConfig.notifyConfig);
      });
    } else {
      this.workOrderAccessService.update(this.workOrderAccess, {workOrderAccessId: this.activityLevel.workOrderAccessId})
        .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
        ModalUtil.hideModal('accessWorkOrder');
        DefaultNotify.notifySuccess('با موفقیت ویرایش شد', '', NotiConfig.notifyConfig);
      });
    }
  }

  yyyyyyyy() {
    ModalUtil.showModal('accessWorkOrderss');
  }


  selectBasicInformation(event) {
    if (isNullOrUndefined(this.activityLevel.workOrderAccessId) && event.target.checked) {
      ModalUtil.showModal('accessWorkOrder');
      this.selectWorOrderMaine = true;
    } else if (!isNullOrUndefined(this.activityLevel.workOrderAccessId) && !event.target.checked) {
      this.activityLevel.workOrderAccessId = new ActivityLevel().workOrderAccessId;
      this.workOrderAccess = new WorkOrderAccess();
      this.selectWorOrderMaine = false;
      this.activityLevel.staticFormsIdList = [];
    }
    if (isNullOrUndefined(this.activityLevel.workOrderAccessId) && !event.target.checked) {
      this.selectWorOrderMaine = false;
      this.workOrderAccess = new WorkOrderAccess();
    }
  }

  doValidForm() {
    if (this.form.valid) {
      $('.valid-error.ng-valid').parent().removeClass('invalid-field');
    }
  }
}

export class UserByOrganizationId {
  id: string;
  username: string;
  family: string;
  name: string;
  nationalCode: string;
  fatherName: string;
  userTypeId: string;
  parentUserId: string;
  organizationList: string[] = [];
}

export class ActivityLevelForAddedToStep {
  userTypeId: string;
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
