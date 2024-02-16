import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {MyPattern} from '../../../../../../shared/shared/tools/myPattern';
import {
    ActionMode,
    DefaultNotify,
    isNullOrUndefined,
    ModalSize,
    PageContainer,
    Paging,
    Toolkit2
} from '@angular-boot/util';
import {UserDto} from '../../../../../user/model/dto/user-dto';
import {EnumObject} from '../../../../../../_base/utility/enum/enum-object';
import {WorkTableDto} from '../../../../../worktable/model/workTable';
import {Location} from '@angular/common';
import {UserService} from '../../../../../user/endpoint/user.service';
import {WorkOrderRepositoryService} from '../../../../../workOrder/endpoint/work-order-repository.service';
import {TaskService} from '../../endpoint/task.service';
import {EnumHandle} from '../../../../../../_base/utility/enum/enum-handle';
import {DataService} from '../../../../../../shared/service/data.service';
import {takeUntilDestroyed} from '@angular-boot/core';
import {ModalUtil} from '@angular-boot/widgets';
import {TaskGroupDto} from '../../../../model/dto/taskGroupDto';
import Task = TaskGroupDto.Task;
import TaskType = TaskGroupDto.TaskType;
import {UserType} from "../../../../../securityManagement/model/userType";
import {AssetTemplatePersonnelDTO, AssignedToGroup} from "../../../../../assetTemplate/endpoint/asset-template.service";
import {UserTypeService} from "../../../../../securityManagement/endpoint/user-type.service";
import {Router} from "@angular/router";
import {NotiConfig} from "../../../../../../shared/tools/notifyConfig";


declare var $: any;

@Component({
    selector: 'app-action-ts',
    templateUrl: './action-ts.component.html',
    styleUrls: ['./action-ts.component.scss']
})
export class ActionTsComponent implements OnInit, OnDestroy, OnChanges {

    @Input() mode;
    @Input() isView: boolean;
    @Input() taskId: string;
    @Input() referenceId: string;
    @Input() receiveTaskForEdit: Task = new Task();
    @Output() messageEvent = new EventEmitter<Task>();

    myPattern = MyPattern;
    actionMode = ActionMode;
    doSave = false;

    task = new Task();
    taskCopy = new Task();
    selectedUser: UserDto.Create = new UserDto.Create();
    userListCopy: UserDto.Create[] = [];
    taskTypeList = [] as EnumObject[];
    users: UserDto.Create[] = [];
    u = new UserDto.Create();
    disabledButton = false;
    workOrderAndFormRepository: WorkTableDto.ActivitySampleWorkOrderAndFormRepository;
    checkCode = false;
    existCode = true;
    MyModalSize = ModalSize;

    constructor(public location: Location,
                public userService: UserService,
                public workOrderRepositoryService: WorkOrderRepositoryService,
                public router: Router,
                public userTypeService: UserTypeService,
                private taskService: TaskService) {
        this.taskTypeList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<TaskType>(TaskType));
    }

    ngOnInit() {
        DataService.getWAFRepository.subscribe((res: any) => {
            if (res) {
                this.workOrderAndFormRepository = res;
            }
        });
        // this.getAllUser();
        this.getAllUserType();

    }

    ngOnDestroy(): void {
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
                // console.log('getAllUserType', res);
                if (!isNullOrUndefined(res)) {
                    this.userTypeList2 = res;
                }
            });
        }
    }

    changeUserType(event: UserType) {
        this.selectedUser.id = null;
        this.userList2 = [];
        if (event) {
            this.selectedUserTypeId2 = event.id;
            this.getAllUsersOfUserType();
        }

    }

    getAllUsersOfUserType() {
        const paging = new Paging();
        paging.size = 15;
        this.loadingUserList2 = true;
        this.userService.getAllUsersOfUserType({paging, totalElements: 0, userTypeId: this.selectedUserTypeId2})
            .pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<UserDto.Create>) => {
            this.loadingUserList2 = false;
            if (this.userList2.length === 0) {
                this.userList2 = res.content;
            } else {
                this.userList2 = this.userList2.concat(res.content);
            }
            this.userListCopy = JSON.parse(JSON.stringify(this.userList2))
            // this.userList2 = this.userList2.filter(u => u.id !== this.userId);

        });
    }

///// !!!کاربر

//TODO ایشوی     http://185.128.138.176:8888/root/cmms/-/issues/491
    getOne() {
        // this.task = this.receiveTaskForEdit;
        //
        // if (this.task.users) {
        //     for (const user of this.task.users) {
        //         this.u = this.userList2.find(u => u.id === user);
        //         this.users.push(this.u);
        //         this.userList2 = this.userList2.filter(u => u.id !== user);
        //     }
        // }

        this.taskService.getTaskByTaskId({taskId: this.taskId}).subscribe((res: any) => {
            if (res) {

                this.task = res;
                // if (this.task.users) {
                //     for (const user of this.task.users) {
                //         // this.u = this.userList2.find(u => u.id === user);
                //         this.users.push(user);
                //         this.userList2 = this.userList2.filter(u => u.id !== user);
                //     }
                // }
                if (this.task.users) {
                    for (const user of this.task.users) {
                        this.userList2 = this.userList2.filter(u => u.id !== user);
                    }
                }
                this.taskCopy = JSON.parse(JSON.stringify(this.task));
                console.log('task', this.task)
                console.log('taskCopy', this.taskCopy)
            } else {
                DefaultNotify.notifyDanger('کار یافت نشد.', '', NotiConfig.notifyConfig);
            }
        });
    }

    action(form) {
        this.doSave = true;
        if (form.invalid) {
            DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            return;
        }
        // this.task.users = [];
        // for (const user of this.users) {
        //     this.task.users.push(user.id);
        // }
        if (this.mode === ActionMode.ADD) {
            this.task.referenceId = this.referenceId;
            // this.taskService.create(this.task).pipe(takeUntilDestroyed(this))
            //   .subscribe((res: Task) => {
            //     if (res && res.id) {
            //       this.task = res;
            //       DefaultNotify.notifySuccess('با موفقیت افزوده شد.');
            this.task.users = this.task.users.map(u => u.id);
            this.messageEvent.emit(JSON.parse(JSON.stringify(this.task)));
            $('#formsTask')[0].reset();
            this.users = [];
            this.existCode = true;
            this.checkCode = false;
            this.doSave = false;
            this.cancelModal();
            //   }
            // });
        } else if (this.mode === ActionMode.EDIT) {
            if (JSON.stringify(this.task) === JSON.stringify(this.taskCopy)) {
                // this.loading = false;
                DefaultNotify.notifyDanger('شما هیچ ویرایشی انجام نداده اید', '', NotiConfig.notifyConfig);
            } else {
                // this.taskService.update(this.task, {taskId: this.task.id})
                //   .pipe(takeUntilDestroyed(this)).subscribe((res: Task) => {
                //   if (res) {
                this.task.users = this.task.users.map(u => u.id);
                this.messageEvent.emit(JSON.parse(JSON.stringify(this.task)));
                // $('#formsTask')[0].reset();
                this.users = [];
                this.existCode = true;
                this.checkCode = false;
                this.doSave = false;
                this.cancelModal();
                //   }
                // });
            }
        }
    }

    sendTask(form) {
        if (JSON.stringify(this.task.code) !== JSON.stringify(this.taskCopy.code)) {
            if (this.checkCode) {
                if (!this.existCode) {
                    this.action(form);
                }
            } else {
                setTimeout(() => {
                    this.sendTask(form);
                }, 50);
            }
        } else {
            this.action(form);
        }
    }

    cancelModal() {
        ModalUtil.hideModal('taskModal2');
        this.userList2 = this.userListCopy;
        this.task = new Task();
        this.users = [];
    }

    cancel() {
        this.location.back();
    }

    loadingChangeTaskCode = false;

    changeTaskCode(form) {
        console.log('this.taskCopy', this.taskCopy);
        console.log('this.task', this.task);
        this.doSave = true;
        if (this.loadingChangeTaskCode) {
            return;
        }
        if (form.invalid) {
            DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            return;
        }
        // if (!this.task.taskType) {
        //     DefaultNotify.notifyDanger('انتخاب نوع کار اجباری است');
        //     return;
        // }
        // if (!this.task.timeEstimate) {
        //     DefaultNotify.notifyDanger('وارد کردن تخمین نفر ساعت اجباری است');
        //     return;
        // }

        // if (this.mode === this.actionMode.EDIT) {
        if (this.task.timeEstimate) {
            this.task.timeEstimate = Toolkit2.Common.Fa2En(this.task.timeEstimate);
        }
        if (this.taskCopy.code !== this.task.code) {
            this.loadingChangeTaskCode = true;
            this.taskService.checkTaskCode({taskCode: this.task.code})
                .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
                this.loadingChangeTaskCode = false;
                if (res) {
                    DefaultNotify.notifyDanger('کد وارد شده تکراری است.', '', NotiConfig.notifyConfig);
                    if (isNullOrUndefined(this.task.id)) {
                        // this.task.code = '';
                    } else {
                        // this.task.code = this.taskCopy.code;
                    }
                    return;
                } else if (!res) {
                    this.action(form);
                }
            }, error => {
                this.loadingChangeTaskCode = false;
            });
        } else {
            this.action(form);
        }
        // } else {
        //     this.action(form);
        // }

    }

    changeTaskCode2() {
        this.taskService.checkTaskCode({taskCode: this.task.code})
            .pipe(takeUntilDestroyed(this)).subscribe((res: boolean) => {
            if (res) {

                this.existCode = true;
                DefaultNotify.notifyDanger('کد وارد شده تکراری است.', '', NotiConfig.notifyConfig);
                if (isNullOrUndefined(this.task.id)) {
                    // this.task.code = '';
                } else {
                    this.task.code = this.taskCopy.code;
                }
            } else {
                this.existCode = false;
            }
            this.checkCode = true;
        });
    }

    changeUser() {
        if (this.task.users.some(u => u.id === this.selectedUser.id)) {
            DefaultNotify.notifyDanger('این کاربر قبلا انتخاب شده است.', '', NotiConfig.notifyConfig);
            return;
        }
        if (this.selectedUser.id !== '-1' && this.selectedUser.id) {
            this.task.users.push(this.userList2.find(user => user.id === this.selectedUser.id));
            this.userList2 = this.userList2.filter(user => user.id !== this.selectedUser.id);
            // this.resetInput('selectUserFromTask');
            setTimeout(e => {
                this.selectedUser = new UserDto.Create();
            }, 100);
        }
    }

    // resetInput(id) {
    //     const $el = $('#' + id);
    //     $el.wrap('<form>').closest('form').get(0).reset();
    //     $el.unwrap();
    // }

    deleteUser(id) {
        this.userList2.push(this.task.users.find(user => user.id === id));
        this.task.users = this.task.users.filter(user => user.id !== id);
    }

    ngOnChanges(changes: SimpleChanges) {
        this.userList2 = this.userList2.concat(this.users);
        this.task = new Task();
        if (this.mode !== ActionMode.ADD) {
            if (!isNullOrUndefined(this.taskId)) {
                this.getOne();
            }
        }
    }

    showModalBody: boolean;

    onCloseModal() {
        this.doSave = false;
        this.showModalBody = false;
        this.task = new Task();
        this.selectedUser = new UserDto.Create();
        this.selectedUserTypeId2 = null;
    }
}
