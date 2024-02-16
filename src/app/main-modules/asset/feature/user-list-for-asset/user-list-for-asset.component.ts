import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {AssetService} from '../../endpoint/asset.service';
import {takeUntilDestroyed} from '@angular-boot/core';
import {UserDto} from '../../../user/model/dto/user-dto';
import {UserService} from '../../../user/endpoint/user.service';
import {PartService} from '../../../part/endpoint/part.service';
import {ActionMode, DefaultNotify, PageContainer, Paging, Toolkit2} from '@angular-boot/util';
import {DeleteModel} from '../../../../shared/conferm-delete/model/delete-model';
import {isNullOrUndefined} from 'util';
import {UserTypeService} from '../../../securityManagement/endpoint/user-type.service';
import {OrganizationService} from '../../../basicInformation/organization/endpoint/organization.service';
import {ActivityService} from '../../../activity/service/activity.service';
import {NotiConfig} from '../../../../shared/tools/notifyConfig';

declare var $: any;

@Component({
    selector: 'app-user-list-for-asset',
    templateUrl: './user-list-for-asset.component.html',
    styleUrls: ['./user-list-for-asset.component.scss']
})
export class UserListForAssetComponent implements OnInit, OnDestroy, OnChanges {

    @Input() entityId: string;
    @Input() mode: string;
    userList: GetUser[] = [];
    loadingUserList = false;

    userListCopy: GetUser[] = [];
    userListAssignedToUser: UserDto.Create[] = [];
    userListAssignedToGroup: UserDto.UsersAssignedToGroupDTO[] = [];
    selectedUser = new GetUser();
    @Input() modePage: ActionMode;
    actionMode = ActionMode;
    loading = false;
    toolkit = Toolkit2;
    selectedItemForDelete = new DeleteModel();
    dontSave = false;
    organizationList: GetOrg[] = [];
    userTypeList: UserType[] = [];
    loadingUserTypeList = true;
    userTypeListCopy: UserType[] = [];
    receiveGetAllUserTypeRes = false;
    userInformation = new UserDto.GetOneUserMainInformation();
    org = new GetOrg();
    usrType = new UserType();
    withoutUserType = false;
    withoutUser = false;
    assignedToUser = true;
    assignedToGroup = false;
    usersAssignedToUser = new OrgAndUserTypeAndUsers();
    usersAssignedToGroup = new OrgAndUserType();
    nameOfPartOrAsset: string;


    constructor(public userService: UserService,
                public assetService: AssetService,
                public activityService: ActivityService,
                public userTypeService: UserTypeService,
                public organizationService: OrganizationService,
                public partService: PartService) {
        this.selectedUser.id = '-1';
    }

    ngOnInit() {
        // this.getAllUser();
        // this.getOrganization();
        this.getAllUserType();
    }

    getPersonPersonnelOfAsset() {
        this.loading = true;
        this.userListAssignedToUser = [];
        this.assetService.getPersonPersonnelOfAsset({assetId: this.entityId}).pipe(takeUntilDestroyed(this))
            .subscribe((res: any) => {
                this.loading = false;
                if (res && res.length > 0) {
                    for (const item of res) {
                        const f = new UserDto.Create();
                        f.userTypeId = item.userTypeId;
                        // f.orgId = item.orgId;
                        f.id = item.id;
                        f.name = item.name;
                        f.family = item.family;
                        f.userTypeName = item.userTypeName;
                        // f.orgName = item.orgName;
                        this.userListAssignedToUser.push(f);
                    }
                    this.filterUserList();
                }
            });
    }

    getGroupPersonnelOfAsset() {
        this.userListAssignedToGroup = [];

        this.assetService.getGroupPersonnelOfAsset({assetId: this.entityId}).pipe(takeUntilDestroyed(this))
            .subscribe((res: any) => {
                this.loading = false;
                if (res && res.length > 0) {
                    for (const item of res) {
                        const f = new UserDto.UsersAssignedToGroupDTO();
                        f.userTypeId = item.userTypeId;
                        f.userTypeName = item.userTypeName;
                        this.userListAssignedToGroup.push(f);
                    }
                    this.filterUserList();
                }
            });
    }

    getPersonPersonnelOfPart() {
        this.loading = true;
        this.userListAssignedToUser = [];
        this.partService.getPersonPersonnelOfPart({partId: this.entityId}).pipe(takeUntilDestroyed(this))
            .subscribe((res: any) => {
                this.loading = false;
                if (res && res.length > 0) {
                    for (const item of res) {
                        const f = new UserDto.Create();
                        f.userTypeId = item.userTypeId;
                        f.id = item.userId;
                        f.name = item.userName;
                        f.family = item.userFamily;
                        f.userTypeName = item.userTypeName;
                        this.userListAssignedToUser.push(f);
                    }
                    this.filterUserList();
                }
            });
    }

    getGroupPersonnelOfPart() {
        this.userListAssignedToGroup = [];
        this.partService.getGroupPersonnelOfPart({partId: this.entityId}).pipe(takeUntilDestroyed(this))
            .subscribe((res: any) => {
                this.loading = false;
                if (res && res.length > 0) {
                    for (const item of res) {
                        const f = new UserDto.UsersAssignedToGroupDTO();
                        f.userTypeId = item.userTypeId;
                        f.userTypeName = item.userTypeName;
                        this.userListAssignedToGroup.push(f);
                    }
                    this.filterUserList();
                }
            });
    }


    filterUserList() {
        if (this.userList.length > 0 && this.userListAssignedToUser.length > 0) {
            for (const item of this.userListAssignedToUser) {
                if (this.usrType.userTypeId === item.userTypeId) {
                    this.userList = this.userList.filter(user => user.id !== item.id);
                }
            }
        }
    }


    showMessage(res) {
        if (res) {
            DefaultNotify.notifySuccess('عملیات با موفقیت انجام شد.', '', NotiConfig.notifyConfig);
        } else {
            DefaultNotify.notifyDanger('عملیات انجام نشد دورباره تلاش کنید.', '', NotiConfig.notifyConfig);
        }
    }

    ngOnDestroy(): void {
    }


    ngOnChanges(changes: SimpleChanges): void {
        if (this.mode === 'asset') {
            this.nameOfPartOrAsset = 'دارایی';
            this.getPersonPersonnelOfAsset();
            this.getGroupPersonnelOfAsset();
        } else {
            this.nameOfPartOrAsset = 'قطعه';
            this.getPersonPersonnelOfPart();
            this.getGroupPersonnelOfPart();
        }

    }


    // //////////////////////////////////////////////////////////////////////////
    userTypeList2: UserType[] = [];
    loadingUserTypeList2 = true;
    selectedUserTypeId2: string;
    parentUserId2 = '';
    userList2: UserDto.Create[] = [];
    loadingUserList2 = false;

//  ///////////////////
    openAssignedToUserCard(event) {
        this.selectedUserTypeId2 = null;
        this.parentUserId2 = null;
        if (event.source._checked) {
            this.assignedToUser = true;
            this.assignedToGroup = false;
        }
    }

    openAssignedToGroupCard(event) {
        this.selectedUserTypeId2 = null;
        // this.getPersonnelGroupOfProject();


        if (event.source._checked) {
            this.assignedToGroup = true;
            this.assignedToUser = false;
        }
    }

    getAllUserType() {
        this.loadingUserTypeList2 = true;
        this.userTypeService.getAllRole()
            .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            this.loadingUserTypeList2 = false;
            // console.log('getAllUserType', res);
            if (!isNullOrUndefined(res)) {
                this.userTypeList2 = res;
            }
        });
    }

    changeUserType(event: UserType) {
        this.parentUserId2 = null;
        this.userList2 = [];
        if (event) {
            this.selectedUserTypeId2 = event.id;
            if (this.assignedToGroup) {
                const item = {
                    userTypeId: event.id,
                    userTypeName: event.name
                };
                const exist = this.userListAssignedToGroup.some(p => p.userTypeId === item.userTypeId);
                if (exist) {
                    DefaultNotify.notifyDanger('این پست قبلا انتخاب شده است.', '', NotiConfig.notifyConfig);
                    return;
                }
                if (!exist) {
                    this.userListAssignedToGroup.push(item);
                }
                setTimeout(e => {
                    this.selectedUserTypeId2 = null;
                }, 10);
                return;
            }
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
            // this.userList2 = this.userList2.filter(u => u.id !== this.userId);

        });
    }

    selectUser() {
        if (this.parentUserId2 !== '-1' && this.parentUserId2) {
            if (this.userListAssignedToUser.some(user => user.id === this.parentUserId2)) {
                DefaultNotify.notifyDanger('کاربر قبلا انتخاب شده است.', '', NotiConfig.notifyConfig);
                setTimeout(e => {
                    this.parentUserId2 = null;
                }, 10);
                return;
            }
            this.userListAssignedToUser.push(this.userList2.find(user => user.id === this.parentUserId2));
            setTimeout(e => {
                this.parentUserId2 = null;
            }, 10);
        }
    }

    addGroupPersonnelToProject() {
        if (this.mode === 'asset') {

            this.assetService.updateGroupTypePersonnel(this.userListAssignedToGroup,
                {assetId: this.entityId}).subscribe((res: any) => {
                if (res) {
                    DefaultNotify.notifySuccess('با موفقیت ثبت شد.', '', NotiConfig.notifyConfig);
                }
            });
        } else {
            this.partService.updateGroupTypePersonnel(this.userListAssignedToGroup,
                {partId: this.entityId}).subscribe((res: any) => {
                if (res) {
                    DefaultNotify.notifySuccess('با موفقیت ثبت شد.', '', NotiConfig.notifyConfig);
                }
            });
        }
    }

    addPersonnelToProject() {
        // this.project.users = this.userListAssignedToUser.map(e => e.id && e.userTypeId);

        const assignedToPersonList = [];
        for (const item of this.userListAssignedToUser) {
            const dto = {
                userId: item.id,
                userTypeId: item.userTypeId
            };
            assignedToPersonList.push(dto);
        }
        if (this.mode === 'asset') {

            this.assetService.updatePersonTypePersonnel(assignedToPersonList,
                {assetId: this.entityId}).subscribe((res: any) => {
                if (res) {
                    DefaultNotify.notifySuccess('با موفقیت ثبت شد.', '', NotiConfig.notifyConfig);
                }
            });
        } else {
            this.partService.updatePersonTypePersonnel(assignedToPersonList,
                {partId: this.entityId}).subscribe((res: any) => {
                if (res) {
                    DefaultNotify.notifySuccess('با موفقیت ثبت شد.', '', NotiConfig.notifyConfig);
                }
            });
        }
    }

    deleteUser2(id) {
        // this.userList2.push(this.userListAssignedToUser.find(user => user.id === id));
        this.userListAssignedToUser = this.userListAssignedToUser.filter(user => user.id !== id);
        setTimeout(e => {
            this.parentUserId2 = null;
        }, 10);
        // this.selectedUser.id = '';
    }

    deleteGroup(id) {
        // this.userList2.push(this.userListAssignedToUser.find(user => user.id === id));
        this.userListAssignedToGroup = this.userListAssignedToGroup.filter(group => group.userTypeId !== id);
        setTimeout(e => {
            this.selectedUserTypeId2 = null;
        }, 10);
        // this.selectedUser.id = '';
    }

// //////////////////////////////////////////////////////////////////////////!!!
}

export class GetUser {
    family: string;
    id: string;
    name: string;
}


export class GetOrg {
    name: string;
    code: string;
    id: string;
}

export class UserType {
    userTypeName: string;
    name: string;
    userTypeId: string;
    id: string;
}

export class AssignedToPersonList {
    assignedToPersonList: OrgAndUserTypeAndUsers[] = [];
}

export class AssignedToGroupList {
    orgAndUserType: OrgAndUserType[] = [];
}

export class OrgAndUserTypeAndUsers {
    orgId: string;
    userTypeId: string;
    userId: string;
}

export class OrgAndUserType {
    orgId: string;
    userTypeId: string;
}
