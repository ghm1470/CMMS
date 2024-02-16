import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {UserDto} from '../../model/dto/user-dto';
import {concat, Observable, of, Subject} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../../endpoint/user.service';
import {ActionMode, DefaultNotify, isNullOrUndefined, ModalSize, PageContainer, Paging} from '@angular-boot/util';
import {takeUntilDestroyed} from '@angular-boot/core';
import {debounceTime, distinctUntilChanged, switchMap, tap} from 'rxjs/operators';
import {ModalUtil} from '@angular-boot/widgets';
import {UserType} from "../../../securityManagement/model/userType";
import {UserTypeService} from "../../../securityManagement/endpoint/user-type.service";
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

@Component({
    selector: 'app-child-users',
    templateUrl: './child-users.component.html',
    styleUrls: ['./child-users.component.scss']
})
export class ChildUsersComponent implements OnInit, OnDestroy {
    @Input() userId = '';
    @Input() mode: ActionMode;
    actionMode = ActionMode;
    userChild = new UserDto.UserChild();
    MyModalSize = ModalSize;

    ///// select Loading userList//////
    userList$: Observable<any[]>;
    userListInput = new Subject<string>();
    LoadingSelectUserList = false;
    userList: UserDto.GetList[] = [];
    loadingUserList = false;
    loading = false;


    termUserList = '';

    userSelectList: UserDto.UserSelectList[] = [];
    userListForAssignedUser = new UserDto.GetAllUserChild();
    userForAssignedUser = new UserDto.GetAllUserChild();
    parentUserId = '';

    constructor(private activatedRoute: ActivatedRoute,
                public userTypeService: UserTypeService,
                private userService: UserService) {
        this.userId = this.activatedRoute.snapshot.queryParams.userId;
    }

    ngOnInit() {
        if (this.mode === this.actionMode.EDIT) {
            // this.getAllUsersExceptOne();
            this.getAllUserType();
        }
        // this.getListUser();
        this.getOneChildUser();
    }

    ngOnDestroy(): void {
    }


    getAllUsersExceptOne() {
        this.userService.getAllUsersExceptOne({userId: this.userId})
            .pipe(takeUntilDestroyed(this)).subscribe(res => {
            if (res) {
                this.userList = res;

            }
        });
    }

    userTypeList: UserType[] = [];
    loadingUserTypeList = true;
    selectedUserTypeId: string;

    getAllUserType() {
        this.loadingUserTypeList = true;
        this.userTypeService.getAllRole()
            .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            this.loadingUserTypeList = false;
            if (!isNullOrUndefined(res)) {
                this.userTypeList = res;
            }
        });
    }

    changeUserType(event) {
        if (event) {
            this.selectedUserTypeId = event.id;
            this.parentUserId = null;
            this.userList = [];
            this.getAllUsersOfUserType();
        }

    }

    getAllUsersOfUserType() {
        const paging = new Paging();
        paging.size = 15;
        this.loadingUserList = true;
        this.userService.getAllUsersOfUserType({paging, totalElements: 0, userTypeId: this.selectedUserTypeId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<UserDto.GetList>) => {
            this.loadingUserList = false;
            if (this.userList.length === 0) {
                this.userList = res.content;
            } else {
                this.userList = this.userList.concat(res.content);
            }
            this.userList = this.userList.filter(u => u.id !== this.userId);

        });
    }

    // getListUser() {
    //     const paging = new Paging();
    //     paging.size = 15;
    //     this.userService.getPageByTermByPaging({paging, totalElements: 0, term: ''})
    //         .pipe(takeUntilDestroyed(this)).subscribe((res: PageContainer<UserDto.GetList>) => {
    //         
    //         this.userList = res.content;
    //         this.userList = this.userList.filter(u => u.id !== this.userId);
    //         this.loadPostTypeList();
    //     });
    // }

    //////////////////// postType Loading//////////////////////////////
    private loadPostTypeList() {
        const paging = new Paging();
        paging.size = 15;
        this.userList$ = concat(
            of(this.userList), // default items
            this.userListInput.pipe(
                debounceTime(1000),
                distinctUntilChanged(),
                tap(() => this.LoadingSelectUserList = true),
                switchMap(term =>
                    this.userService.getPageByTermByPaging({paging, totalElements: 0, term}).pipe(
                        tap(() => this.LoadingSelectUserList = false),
                    )
                )
            )
        );
    }


    getOneChildUser() {
        this.loading = true;
        this.userService.getAllChildUsersIdOfUserByUserId({userId: this.userId})
            .pipe(takeUntilDestroyed(this)).subscribe(res => {

            this.loading = false;
            if (res) {
                // this.userListForAssignedUser = res[0];

                // for (const user of this.userListForAssignedUser) {
                this.userForAssignedUser = res;

                // for (const user of this.userForAssignedUser) {
                //   if (this.userChild.parentUserId.filter(e => e === user.id).length === 0) {
                //     this.userChild.parentUserId.push(user.id);
                //   }
                // }
            }
        });
    }

    getUserReportTo(userForm) {
        if (userForm.invalid) {
            DefaultNotify.notifyDanger('ورودی انتخاب شود!', '', NotiConfig.notifyConfig);
            return;
        }
        if (!this.parentUserId) {
            DefaultNotify.notifyDanger('کاربر انتخاب شود!', '', NotiConfig.notifyConfig);
            return;
        }
        if (this.userForAssignedUser.id) {
            DefaultNotify.notifyDanger(' شما مجاز به انتخاب یک کاربر هستید.', '', NotiConfig.notifyConfig);
            this.parentUserId = null;
            return;
        }
        this.userService.getUserReportTo({userId: this.parentUserId}).subscribe((res: any) => {
            if (res === this.userId) {
                DefaultNotify.notifyDanger('خطا . فرد دیگری انتخاب کنید.', '', NotiConfig.notifyConfig);

            } else {
                this.updateChildUser(userForm);
            }
        });
    }

    updateChildUser(userForm) {

        // if (this.userChild.parentUserId.filter(e => e === this.parentUserId).length === 0) {
        if (isNullOrUndefined(this.userForAssignedUser.id)) {

            this.userChild.parentUserId = this.parentUserId;
            // }
            this.userChild.userId = this.userId;
            this.loading = true;
            this.userService.updateChildUsersForReportTo(this.userChild)
                .pipe(takeUntilDestroyed(this)).subscribe(res => {
                this.loading = false;
                if (res) {
                    this.parentUserId = null;
                    this.getOneChildUser();
                    DefaultNotify.notifySuccess('با موفقیت افزوده شد.', '', NotiConfig.notifyConfig);
                }
            });
        }


    }


    deleteChildUser(user) {
       // const i = this.userChild.parentUserId.findIndex(e => e === user.id);
        // this.userChild.parentUserId.splice(i, 1);
        // this.userChild.userId.splice(i, 1);
        this.userChild.userId = this.userId;
        this.userService.updateChildUsersForReportTo(this.userChild)
            .pipe(takeUntilDestroyed(this)).subscribe(res => {
            if (res) {
                DefaultNotify.notifySuccess('با موفقیت حذف شد.', '', NotiConfig.notifyConfig);
                // } else {
                this.userForAssignedUser = new UserDto.GetAllUserChild();
                // this.userForAssignedUser.family = null;
                // this.userForAssignedUser.name = null;
                // this.userForAssignedUser.id = null;
                // this.userForAssignedUser.userTypeName = null;
                // } else {
                // this.userChild.parentUserId.push(user.id);
            }
        });
    }

    pae() {
        console.log('parentUserId=====>', this.parentUserId)
    }

    GetUserTypeForParentUser(userForAssignedUser: UserDto.GetAllUserChild) {
        ModalUtil.showModal('UserTypeForParentUserModal')
    }
}
