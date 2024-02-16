import {Component, OnInit} from '@angular/core';
import {isNullOrUndefined} from 'util';
import {DefaultNotify} from '@angular-boot/util';
import {UserType} from '../../model/userType';
import {RoleSorterHelper} from '../../../../_base/helper/bean/roleSorterHelper';
import {EnumObject} from '../../../../_base/utility/enum/enum-object';
import {Validations} from '../../../../_base/utility/validations';
import {UserTypeService} from '../../endpoint/user-type.service';
import {Role} from '../../../../_base/helper/enum/userManagement/role';
import {AccessList} from '../../../../_base/helper/enum/userManagement/accessList';
import {AccessController} from '../../../../_base/helper/enum/userManagement/accessController';
import {EnumHandle} from '../../../../_base/utility/enum/enum-handle';
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

@Component({
    selector: 'app-role',
    templateUrl: './role.component.html',
    styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {


    mode = '';
    roleId: number;
    userTypeList: Array<UserType> = [];
    roleList = [] as EnumObject[];
    roleAccessList = [] as EnumObject[];
    accessControllerList = [] as EnumObject[];
    roleSorter: Array<RoleSorterHelper> = [];
    userType: UserType = new UserType();
    myVal = Validations;
    allSelectedFromMenu: Array<string> = [];
    searchedUser = new UserType();
    noSearchResult = false;

    constructor(private userTypeService: UserTypeService) {
        this.searchedUser.accessList = null;
        this.searchedUser.privilege = null;
    }

    ngOnInit() {
        this.userTypeService.getAllRole().subscribe((res: UserType[]) => {
            if (res !== null) {
                this.userTypeList = res;
            } else {
                DefaultNotify.notifyWarning('پستی ثبت نشده است!', '', NotiConfig.notifyConfig);
            }
        });
        this.roleList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<Role>(Role));
        this.roleAccessList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<AccessList>(AccessList));
        this.accessControllerList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<AccessController>(AccessController));
        this.createAccessList();
    }

    createAccessList() {
        for (const item of this.roleAccessList) {
            const newItem = new RoleSorterHelper();
            newItem.controllerName = item;
            for (const item2 of this.accessControllerList) {
                const splitting = item2._value.split('_');
                if (splitting[0] === item._value) {
                    newItem.roleList.push(item2);
                }
            }
            this.roleSorter.push(newItem);
        }
    }

    doAdd() {
        this.mode = 'add';
    }

    cancel() {
        this.mode = '';
        this.userType = new UserType();
    }

    doEdit(id) {
        this.mode = 'edit';
        this.roleId = id;
        this.allSelectedFromMenu = [];
        this.userTypeService.getRoleById(id).subscribe((res: UserType) => {
            this.userType = res;
            if (isNullOrUndefined(res.privilege)) {
                this.userType.privilege = [];
            }
            if (isNullOrUndefined(res.accessList)) {
                this.userType.accessList = [];
            }
            this.createAllSelectedFromMenu();
            // دونه دونه roleSorter رو بخونه و اگه برای یک تب همه منو رو داشت اون تب رو به allSelectedFromMenu اضافه کند
        });
    }

    createAllSelectedFromMenu() {
        let found = 0;
        for (const item of this.roleSorter) {
            if (item.roleList.length > 0) {
                for (const item1 of item.roleList) {
                    if (this.userType.accessList.indexOf(item1._value) < 0) {
                        found = -1;
                        break;
                    }
                }
                if (found === 0) {
                    this.allSelectedFromMenu.push(item.controllerName._value);
                } else if (found === -1) {
                    found = 0;
                }
            } else {
                if (this.userType.privilege.indexOf(item.controllerName._value) > -1) {
                    this.allSelectedFromMenu.push(item.controllerName._value);
                }
            }
        }
        console.log(this.allSelectedFromMenu);
    }

    deleteRole(i, id) {
        if (confirm('ایا میخواهید این پست را حذف کنید؟')) {
            this.userTypeService.deleteRole(id).subscribe(res => {
                if (res) {
                    this.userTypeList.splice(i, 1);
                    DefaultNotify.notifySuccess('پست با موفقیت حذف شد.', '', NotiConfig.notifyConfig);
                } else {
                    DefaultNotify.notifyDanger('هنگام حذف مشکلی رخ داده است.', '', NotiConfig.notifyConfig);
                }
            });
        }
    }

    addRole() {
        if (!isNullOrUndefined(this.userType.name)) {
            this.userTypeService.create(this.userType).subscribe((res: any) => {
                if (res) {
                    DefaultNotify.notifySuccess('پست با موفقیت افزوده شد.', 'موفق', NotiConfig.notifyConfig);
                    this.userType = new UserType();
                    this.userTypeList.push(res);
                    this.mode = '';
                }
            });
        } else {
            DefaultNotify.notifyDanger('اطلاعات به صورت کامل وارد نشده است.', 'خطا', NotiConfig.notifyConfig);
        }
    }

    editRole() {
        this.userTypeService.editRole(this.userType).subscribe(res => {
            if (res) {
                DefaultNotify.notifySuccess('پست با موفقیت ویرایش شد', 'موفق',  NotiConfig.notifyConfig);
                this.mode = '';
                let i = 0;
                for (const item of this.userTypeList) {
                    if (item.id === this.userType.id) {
                        this.userTypeList.splice(i, 1);
                        this.userTypeList.push(this.userType);
                    }
                    i += 1;
                }
            }
        });
    }

    setRole(event) {
        this.userType.role = event;
    }

    selectAllAccess(event) {
        if (event) {
            if (this.userType.privilege.length !== this.roleAccessList.length
                || this.allSelectedFromMenu.length !== this.accessControllerList.length) {
                for (const item of this.roleAccessList) {
                    if (this.userType.privilege.indexOf(item._value) < 0) {
                        this.userType.privilege.push(item._value);
                    }
                    if (this.allSelectedFromMenu.indexOf(item._value) < 0) {
                        this.allSelectedFromMenu.push(item._value);
                    }
                }
            }
            if (this.userType.accessList.length !== this.accessControllerList.length) {
                for (const item of this.accessControllerList) {
                    if (this.userType.accessList.indexOf(item._value) < 0) {
                        this.userType.accessList.push(item._value);
                    }
                }
            }
        } else {
            this.userType.accessList = [];
            this.userType.privilege = [];
            this.allSelectedFromMenu = [];
        }
    }

    check(item, menuName) {
        console.log(menuName);
        if (this.userType.accessList.indexOf(item) > -1) {
            this.userType.accessList.splice(this.userType.accessList.indexOf(item), 1);
            this.allSelectedFromMenu.splice(this.allSelectedFromMenu.indexOf(menuName._value), 1);
            if (this.uncheckMenu(menuName)) {
                this.userType.privilege.splice(this.userType.privilege.indexOf(menuName._value), 1);
            }
        } else {
            this.userType.accessList.push(item);
            if (this.checkMenu(menuName)) {
                this.allSelectedFromMenu.push(menuName._value);
            }
            if (this.userType.privilege.indexOf(menuName._value) < 0) {
                this.userType.privilege.push(menuName._value);
            }
        }
        console.log(this.userType.accessList);
        console.log(this.userType.privilege);
    }

    checkMenu(menuName) {
        let all = true;
        for (const item of this.roleSorter) {
            if (item.controllerName === menuName) {
                for (const item2 of item.roleList) {
                    if (this.userType.accessList.indexOf(item2._value) < 0) {
                        all = false;
                    }
                }
            }
        }
        return all;
    }

    uncheckMenu(menuName) {
        let all = true;
        for (const item of this.roleSorter) {
            if (item.controllerName === menuName) {
                for (const item2 of item.roleList) {
                    if (this.userType.accessList.indexOf(item2._value) > -1) {
                        all = false;
                    }
                }
            }
        }
        return all;
    }

    checkOnMenu(event, menuName) {
        console.log(event);
        console.log(menuName);
        // debugger;
        if (event) {
            if (this.userType.privilege.indexOf(menuName._value) < 0) {
                this.userType.privilege.push(menuName._value);
            }
            if (this.allSelectedFromMenu.indexOf(menuName._value) < 0) {
                this.allSelectedFromMenu.push(menuName._value);
            }
            for (const item of this.roleSorter) {
                if (item.controllerName === menuName) {
                    for (const item2 of item.roleList) {
                        if (this.userType.accessList.indexOf(item2._value) < 0) {
                            this.userType.accessList.push(item2._value);
                        }
                    }
                }
            }
        } else {
            for (const item of this.roleSorter) {
                if (item.controllerName === menuName) {
                    for (const item2 of item.roleList) {
                        if (this.userType.accessList.indexOf(item2._value) > -1) {
                            this.userType.accessList.splice(this.userType.accessList.indexOf(item2._value), 1);
                        }
                    }
                }
            }
            if (this.allSelectedFromMenu.indexOf(menuName._value) > -1) {
                this.allSelectedFromMenu.splice(this.allSelectedFromMenu.indexOf(menuName._value), 1);
            }
            if (this.userType.privilege.indexOf(menuName._value) > -1) {
                this.userType.privilege.splice(this.userType.privilege.indexOf(menuName._value), 1);
            }
        }
        console.log(this.allSelectedFromMenu);
        console.log(this.userType.accessList);
        console.log(this.userType.privilege);
    }

    changeSearchName() {
        if (this.searchedUser.name.length > 2) {
            this.search();
        }
    }

    search() {
        if (isNullOrUndefined(this.searchedUser.role)) {
            this.searchedUser.role = 'all';
        } else {
            this.userTypeService.search({name: this.searchedUser.name, role: this.searchedUser.role})
                .subscribe((res: any) => {
                    if (res.length > 0) {
                        this.userTypeList = res;
                        this.noSearchResult = false;
                    } else {
                        this.userTypeList = [];
                        this.noSearchResult = true;
                    }
                });
        }
    }

}
