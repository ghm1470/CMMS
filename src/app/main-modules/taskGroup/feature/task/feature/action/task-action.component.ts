import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {MyPattern} from '../../../../../../shared/shared/tools/myPattern';
import {ActionMode, DefaultNotify, isNullOrUndefined, ModalSize, PageContainer, Paging} from '@angular-boot/util';
import {Location} from '@angular/common';
import {takeUntilDestroyed} from '@angular-boot/core';
import {ModalUtil} from '@angular-boot/widgets';
import {TaskGroupDto} from '../../../../model/dto/taskGroupDto';
import Task = TaskGroupDto.Task;
import {TaskService} from '../../endpoint/task.service';
import {UserService} from '../../../../../user/endpoint/user.service';
import {UserDto} from '../../../../../user/model/dto/user-dto';
import {EnumObject} from '../../../../../../_base/utility/enum/enum-object';
import {EnumHandle} from '../../../../../../_base/utility/enum/enum-handle';
import TaskType = TaskGroupDto.TaskType;
import {DataService} from '../../../../../../shared/service/data.service';
import {WorkTableDto} from '../../../../../worktable/model/workTable';
import {WorkOrderRepositoryService} from '../../../../../workOrder/endpoint/work-order-repository.service';
import {WorkOrderService} from '../../../../../workOrder/endpoint/work-order.service';
import {UserType} from '../../../../../securityManagement/model/userType';
import {UserTypeService} from '../../../../../securityManagement/endpoint/user-type.service';
import {NotiConfig} from "../../../../../../shared/tools/notifyConfig";

declare var $: any;

@Component({
    selector: 'app-task-action',
    templateUrl: './task-action.component.html',
    styleUrls: ['./task-action.component.scss']
})
export class TaskActionComponent implements OnInit, OnDestroy, OnChanges {

    constructor(public location: Location,
                public userService: UserService,
                public workOrderRepositoryService: WorkOrderRepositoryService,
                public workOrderService: WorkOrderService,
                public userTypeService: UserTypeService,
                private taskService: TaskService) {
        // this.selectedUser.id = '-1';
        this.taskTypeList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<TaskType>(TaskType));
    }

    @Input() mode;
    @Input() readService;
    @Input() modeView;
    @Input() formStatus;
    @Input() taskId: string;
    @Input() referenceId = 'null';
    @Input() taskGroupId: string;
    @Input() receiveTaskForEdit: Task = new Task();
    @Output() messageEvent = new EventEmitter<Task>();
    @Output() closeTaskModal = new EventEmitter<boolean>();

    myPattern = MyPattern;
    actionMode = ActionMode;
    doSave = false;
    MyModalSize = ModalSize;
    task = new Task();
    taskCopy = new Task();
    userList: UserDto.GetAllTow[] = [];
    userListCopy: UserDto.GetAllTow[] = [];
    taskTypeList = [] as EnumObject[];
    users: UserDto.GetAllTow[] = [];
    u = new UserDto.GetAllTow();
    disabledButton = false;
    workOrderAndFormRepository: WorkTableDto.ActivitySampleWorkOrderAndFormRepository;
    pageUser = 0;
    totalUser: number;
    sUserB = true;
    loading = false;
    checkTaskCode;

    loadingChangeTaskCode = false;


////////////////////////////////////////////////////////////////////////////
    userTypeList2: UserType[] = [];
    loadingUserTypeList2 = true;
    selectedUserTypeId2: string;
    parentUserId2 = '';
    userList2: UserDto.GetList[] = [];
    loadingUserList2 = false;

    showModalBody = true;

    ngOnInit() {
        DataService.getWAFRepository.subscribe((res: any) => {
            if (res) {
                this.workOrderAndFormRepository = res;
            }
        });
        this.getAllUserType();

    }

    loadingGetUsers = false;

    ngOnChanges(changes: SimpleChanges) {
        // alert(this.modeView)
        this.userList = this.userList.concat(this.users);
        this.task = new Task();
        if (this.mode === ActionMode.EDIT || this.mode === ActionMode.VIEW) {
            if (!isNullOrUndefined(this.taskId)) {
                this.loadingGetUsers = true;
                this.taskService.getTaskByTaskId({taskId: this.taskId}).subscribe(res => {
                    this.loadingGetUsers = false;
                    if (res) {
                        this.task = res;
                        this.taskCopy = JSON.parse(JSON.stringify(res));
                        this.users = JSON.parse(JSON.stringify(this.taskCopy.users));
                        this.taskCopy.users = [];
                        for (const user of this.users) {
                            this.taskCopy.users.push(user.id);
                        }
                        this.users = [];
                        // for (const item of this.taskCopy.users) {
                        //   this.u = JSON.parse(JSON.stringify(item));
                        //
                        //   m = item.user
                        // }
                        this.getOne();
                        if (this.mode === ActionMode.VIEW) {
                            $('input').attr('disabled', 'disabled');
                            $('select').attr('disabled', 'disabled');
                            $('textarea').attr('disabled', 'disabled');
                        }
                    }
                }, error => {
                    this.loadingGetUsers = false;
                });
            }
        }
        if (this.readService) {
            this.getAllUser();
        }
    }


    ngOnDestroy(): void {
    }

    getAllUser() {
        this.userService.getAllTow().subscribe((res: UserDto.GetAllTow[]) => {
            if (res) {
                this.userList = res;
                this.userListCopy = JSON.parse(JSON.stringify(this.userList));
            }
        });
    }


    getOne() {
        // this.loading = true;
        this.sUserB = false;
        // this.taskCopy = JSON.parse(JSON.stringify(this.receiveTaskForEdit));
        for (const user of this.task.users) {
            this.users.push(user);
            this.userList = this.userList.filter(u => u.id !== user.id);
            this.loading = false;

            setTimeout(() => {
                this.sUserB = true;
            }, 300);
        }
    }

    action(form) {
        this.doSave = true;
        if (this.loading) {
            return;
        }
        this.task.users = [];
        for (const user of this.users) {
            this.task.users.push(user.id);
        }
        if (this.mode === ActionMode.ADD) {
            if (this.referenceId !== 'null') {
                this.task.referenceId = this.referenceId;
            }
            this.task.taskGroupId = this.taskGroupId;
            this.loading = true;
            this.taskService.create(this.task).pipe(takeUntilDestroyed(this))
                .subscribe((res: Task) => {
                    this.loading = false;

                    if (res && res.id) {
                        this.task = res;
                        // =================================================================
                        if (this.formStatus === 'pending') {
                            // this.workOrderAndFormRepository.task = this.task;
                            // DataService.setWAFRepository(this.workOrderAndFormRepository);
                            if (!isNullOrUndefined(this.workOrderAndFormRepository.id)) {
                                this.workOrderRepositoryService.update(
                                    this.workOrderAndFormRepository).pipe(takeUntilDestroyed(this)).subscribe(
                                    resTree => {
                                        if (resTree) {
                                            DataService.setWAFRepository(this.workOrderAndFormRepository);
                                        }
                                    });
                            } else if (isNullOrUndefined(this.workOrderAndFormRepository.id)) {
                                this.workOrderRepositoryService.create(this.workOrderAndFormRepository).pipe(
                                    takeUntilDestroyed(this)).subscribe(resTow => {
                                    if (resTow) {
                                        this.workOrderAndFormRepository.id = resTow;
                                        DataService.setWAFRepository(this.workOrderAndFormRepository);
                                    }
                                });
                            }
                        }
                        // =================================================================
                        DefaultNotify.notifySuccess('با موفقیت افزوده شد.', '', NotiConfig.notifyConfig);
                        this.messageEvent.emit(JSON.parse(JSON.stringify(this.task)));
                        // form.reset();
                        $('#formsTask')[0].reset();
                        this.doSave = false;
                        this.cancelModal();
                    }
                }, error => {
                    this.loading = false;
                });
        } else if (this.mode === ActionMode.EDIT) {
            if (JSON.stringify(this.task) === JSON.stringify(this.taskCopy)) {
                this.loading = false;
                DefaultNotify.notifyDanger('شما هیچ ویرایشی انجام نداده اید', '', NotiConfig.notifyConfig);
            } else {
                this.loading = true;
                this.taskService.update(this.task, {taskId: this.task.id})
                    .pipe(takeUntilDestroyed(this)).subscribe((res: Task) => {
                    this.loading = false;
                    if (res) {
                        // =================================================================
                        if (this.formStatus === 'pending') {
                            // this.workOrderAndFormRepository.task = this.task;
                            // DataService.setWAFRepository(this.workOrderAndFormRepository);
                            if (!isNullOrUndefined(this.workOrderAndFormRepository.id)) {
                                this.workOrderRepositoryService.update(this.workOrderAndFormRepository).pipe(
                                    takeUntilDestroyed(this)).subscribe(resTree => {
                                    if (resTree) {
                                        DataService.setWAFRepository(this.workOrderAndFormRepository);
                                    }
                                });
                            } else if (isNullOrUndefined(this.workOrderAndFormRepository.id)) {
                                this.workOrderRepositoryService.create(this.workOrderAndFormRepository).pipe(
                                    takeUntilDestroyed(this)).subscribe(resTow => {
                                    if (resTow) {
                                        this.workOrderAndFormRepository.id = resTow;
                                        DataService.setWAFRepository(this.workOrderAndFormRepository);
                                    }
                                });
                            }
                        }
                        // =================================================================
                        DefaultNotify.notifySuccess('ویرایش با موفقیت انجام شد.', '', NotiConfig.notifyConfig);
                        this.messageEvent.emit(JSON.parse(JSON.stringify(this.task)));
                        // form.reset();
                        $('#formsTask')[0].reset();
                        this.users = [];
                        this.doSave = false;
                        this.cancelModal();
                    }
                }, error => {
                    this.loading = false;
                });
            }
        }
    }

    cancelModal() {
        ModalUtil.hideModal('taskModal');
        this.closeTaskModal.emit(true);
        this.userList = this.userListCopy;
        this.task = new Task();
        this.users = [];
    }

    cancel() {
        this.location.back();
    }

    changeTaskCode(form) {
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
                            this.task.code = this.taskCopy.code;
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


    changeAssetCode() {
        this.checkTaskCode = true;
        this.taskService.checkTaskCode({taskCode: this.task.code})
            .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            if (res) {
                DefaultNotify.notifyDanger('کد وارد شده موجود است.', '', NotiConfig.notifyConfig);
                if (isNullOrUndefined(this.taskId)) {
                    this.task.code = '';
                    this.checkTaskCode = false;
                } else {
                    this.task.code = this.taskCopy.code;
                    this.checkTaskCode = false;
                }
            } else {
                this.checkTaskCode = false;
            }
        });
    }

    getAllUserType() {
        this.loadingUserTypeList2 = true;
        this.userTypeService.getAllRole()
            .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            this.loadingUserTypeList2 = false;
            if (!isNullOrUndefined(res)) {
                this.userTypeList2 = res;
            }
        });
    }

    changeUserType(event) {
        this.userList2 = [];
        this.parentUserId2 = null;
        this.selectedUserTypeId2 = null;
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
            .pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<UserDto.GetList>) => {
            this.loadingUserList2 = false;
            if (this.userList2.length === 0) {
                this.userList2 = res.content;
            } else {
                this.userList2 = this.userList2.concat(res.content);
            }
            // this.userList2 = this.userList2.filter(u => u.id !== this.userId);

        });
    }

    selectUser() {
        if (this.parentUserId2 !== '-1' && this.parentUserId2) {
            if (this.users.some(user => user.id === this.parentUserId2)) {
                DefaultNotify.notifyDanger('کاربر قبلا انتخاب شده است.', '', NotiConfig.notifyConfig);
                return;
            }
            this.users.push(this.userList2.find(user => user.id === this.parentUserId2));
            // this.task.users.push(this.userList.find(user => user.id === this.selectedUser.id).id);
            // this.userList2 = this.userList2.filter(user => user.id !== this.parentUserId2);
            this.parentUserId2 = null;
            // this.selectedUser.id = '';
        }
    }

    deleteUser2(id) {
        // this.userList2.push(this.users.find(user => user.id === id));
        this.users = this.users.filter(user => user.id !== id);
        // this.selectedUser.id = '';
    }

    onCloseModal() {
        this.doSave = false;
        this.showModalBody = false;
        this.task = new Task();
        this.closeTaskModal.emit(true);
        setTimeout(e => {
            this.showModalBody = true;
        }, 10);

    }

// //////////////////////////////////////////////////////////////////////////!!!
}
