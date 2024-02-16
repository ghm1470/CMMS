import {Component, OnInit} from '@angular/core';
import {Validations} from '../../../../_base/utility/validations';
import {UserTypeDto} from '../../model/userTypeDto';
import {MyPattern} from '../../../../shared/shared/tools/myPattern';
import {EnumObject} from '../../../../_base/utility/enum/enum-object';
import {EnumHandle} from '../../../../_base/utility/enum/enum-handle';
import {RoleSorterHelper} from '../../../../_base/helper/bean/roleSorterHelper';
import {
    AccessController,
    AccessController1,
    AccessController2
} from '../../../../_base/helper/enum/userManagement/accessController';
import {Type} from '../../model/userType';
import {SecurityManagementService} from '../../endpoint/security-management.service';
import {DefaultNotify} from '@angular-boot/util';
import {Accesses} from '../../../../_base/helper/enum/userManagement/accesses';
import {ModalUtil} from '@angular-boot/widgets';
import {ActivatedRoute} from '@angular/router';
import {NotiConfig} from '../../../../shared/tools/notifyConfig';

declare var $: any;

@Component({
    selector: 'app-security-management-action',
    templateUrl: './security-management-action.component.html',
    styleUrls: ['./security-management-action.component.scss']
})
export class SecurityManagementActionComponent implements OnInit {

    constructor(private securityManagementService: SecurityManagementService,
                private activatedRoute: ActivatedRoute) {
        this.searchedUser.accessList = null;
        this.searchedUser.privilege = null;
        this.userTypeId = this.activatedRoute.snapshot.queryParams.id;
        if (this.activatedRoute.snapshot.queryParams.mode) {
            this.mode = this.activatedRoute.snapshot.queryParams.mode;
        }
    }

    myVal = Validations;
    mode = 'ADD';
    userType = new UserTypeDto.Create();
    userTypeSend = new UserTypeDto.CreateSend();
    userTypeId: string;
    myPattern = MyPattern;
    roleList = [] as EnumObject[];
    roleSorter: Array<RoleSorterHelper> = [];
    roleAccessList = [] as EnumObject[];
    accessControllerList = [];

    allSelectedFromMenu: Array<string> = [];
    roleId: number;

    searchedUser = new UserTypeDto.Create();

    userTypeList: Array<UserTypeDto.Create> = [];


    typeList = [] as EnumObject[];
    AccessList = [] as EnumObject[];
    noSearchResult = false;

    roleListForAll: any[] = [];
    doSave = false;

    ngOnInit() {
        this.roleList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<Type>(Type));
        this.typeList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<Type>(Type));
        this.roleAccessList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<Accesses>(Accesses));
        this.accessControllerList = EnumHandle.ConvertByModel(new (AccessController2));
        this.createAccessList();
        if (this.userTypeId) {
            this.mode = 'EDIT';
            this.getOne(this.userTypeId);

        }
    }



    createAccessList() {
        for (const item of this.roleAccessList) {
            // با این اطلاعات دیتا مدل نیو ایتم رو پر می کنیم
            const newItem = new RoleSorterHelper();
            newItem.controllerName = item;
            for (const item2 of this.accessControllerList) {
                const splitting = item2._value.split('_');
                if (splitting[0] === item._value) {
                    newItem.roleList.push(item2);
                }
            }
            newItem.id = ModalUtil.generateModalId();
            // بعد از پر شدن نیو ایتم اون رو به یک لیست پوش می کنیم
            this.roleSorter.push(newItem);
        }
    }


    onChangeForTotal(event) {
        // if (event.checked === false) {
        for (const first of this.roleSorter) {
            this.onChangeAll(event, first);
        }
        // }

    }

    checkNgModelTotal(returns?) {
        let i = 0;
        let ourlength = 0;
        let sum = 0;

        for (let first of this.roleSorter) {

            for (let secont of first.roleList) {
                // for (let item of this.userTypeSend.privilege) {
                // ourlength = first.roleList.length;
                // sum = + ourlength;
                i++;
            }
            // if (this.userTypeSend.privilege.length === i) {
            //   return true;
            //   // }
            // }
            // else if (this.userTypeSend.privilege.length !== sum) {
            //   return false;
            //   // }
            // }
        }
        let k = i + this.roleSorter.length;
        if (this.userTypeSend.privilege.length === i) {
            return true;
            // }
        }

    }

    // ***************************

    checkNgModelAll(roleGroup) {
        const roleIdList = [];
        const MyRoleIdList = [];
        //تمامی رول لیست های یک  اکسس رو جدا میکنه
        for (let item of roleGroup.roleList) {
            roleIdList.push(item._value);
        }

        // this.roleGroup.filter(e => {
        //   if (e.id === roleGroupId) {
        //     roleIdList.push(e);
        //   }
        // });
        // حالا می خواد بررسی کنه تو انتخابام هست یا نه
        for (const role of roleIdList) {
            for (const selectedRole of this.userTypeSend.privilege) {
                if (selectedRole === role) {
                    MyRoleIdList.push(role);
                }

            }
        }

        if (
            MyRoleIdList.length === roleIdList.length) {
            return true;
        }


    }

    // checkNgModelAll(access) {
    //   let a = true;
    //   for (const item of access.roleList) {
    //     if (this.userTypeSend.privilege.filter(e => e === item).length === 4) {
    //       a = false;
    //     }
    //   }
    //   return a;
    // }


    onChangeAll(event, access) {
        this.roleSorter.filter(e => {
            // تمامی رول های یک دسترسی رو دونه دونه سلکت می کنه
            if (e.id === access.id) {
                for (const item of e.roleList) {
                    this.onChange(event, item._value, access);
                }
            }
        });
    }

    // ***************************

    checkNgModel(role) {
        // اگه لیتسی اطلاعاتی برابر ورودی  داشت ترو برگردون
        if (this.userTypeSend.privilege) {
            if (this.userTypeSend.privilege.filter(e => e === role).length > 0) {
                return true;
                //   برای اینکه تیک خوده نشون بده بعدا
            }
        }
    }

    // checkAllTick(event, role, access){
    //   if (){}
    // }


    onChange(event, role, access) {
        // اگه تیک برداشته شد از انتخاب ها اسپلایت کن

        if (event.checked === false) {
            const index = this.userTypeSend.privilege.findIndex(e => e === role);
            if (index !== -1) {
                this.userTypeSend.privilege.splice(index, 1);
            }
        } else if (event.checked === true) {
            // اگه تیک زده شد اگه قبلا انتخاب نشده بود  پوش کن تو لیست

            if (this.userTypeSend.privilege.filter(e => e === role).length === 0) {
                this.userTypeSend.privilege.push(role);
                // if (this.userTypeSend.privilege.length === access.roleList.length) {
                //   $('#All' + access.id).prop('checked', true);
                //   // this.checkNgModelAll(access)
                //
                //
                // }
            }
        }
    }

    // ***************************


    getOne(userTypeId) {
        this.allSelectedFromMenu = [];
        this.securityManagementService.getOne({userTypeId}).subscribe((res: any) => {
            this.userTypeSend = res;
        });

    }


    action(form) {
        this.doSave = true;
        if (form.invalid) {
            DefaultNotify.notifyDanger('ورودی را بررسی کنید.', '', NotiConfig.notifyConfig);
            return;
        }
        if (this.userTypeSend.privilege.length === 0) {
            DefaultNotify.notifyDanger('دسترسی انتخاب نشده!', '', NotiConfig.notifyConfig);
            return;
        }

        if (this.mode === 'ADD') {
            this.securityManagementService.create(this.userTypeSend).subscribe((res: any) => {
                if (res) {
                    DefaultNotify.notifySuccess('پست با موفقیت افزوده شد.', '', NotiConfig.notifyConfig);
                    this.back();
                }
            });
        } else if (this.mode === 'EDIT') {
            this.securityManagementService.update(this.userTypeSend).subscribe((res: any) => {
                if (res) {
                    DefaultNotify.notifySuccess('پست با موفقیت ویرایش شد.', '', NotiConfig.notifyConfig);
                    this.back();
                }
            });
        }
    }


    //
    checkNgModelAllAll() {
        // let found = true;
        // this.roleList.filter(role => {
        //   if (this.selectedItem.roleIdList.filter(id => role.id === id).length === 0) {
        //     found = false;
        //     return null;
        //   }
        // });
        // if (found) {
        //   return 'ewew';
        // }
    }

    back() {
        window.history.back();
    }

    trimTitle() {
        this.userTypeSend.name = this.userTypeSend.name.trim();
    }
}


