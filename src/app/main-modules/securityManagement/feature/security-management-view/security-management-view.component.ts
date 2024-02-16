import {Component, OnInit} from '@angular/core';
import {SecurityManagementService} from "../../endpoint/security-management.service";
import {ActivatedRoute} from "@angular/router";
import {UserTypeDto} from "../../model/userTypeDto";
import {RoleSorterHelper} from "../../../../_base/helper/bean/roleSorterHelper";
import {ModalUtil} from "@angular-boot/widgets";
import {EnumObject} from "../../../../_base/utility/enum/enum-object";
import {EnumHandle} from "../../../../_base/utility/enum/enum-handle";
import {AccessController} from "../../../../_base/helper/enum/userManagement/accessController";
import {Accesses} from "../../../../_base/helper/enum/userManagement/accesses";

@Component({
  selector: 'app-security-management-view',
  templateUrl: './security-management-view.component.html',
  styleUrls: ['./security-management-view.component.scss']
})
export class SecurityManagementViewComponent implements OnInit {
  userId: string;
  userTypeSend = new UserTypeDto.CreateSend();
  allSelectedFromMenu: Array<string> = [];
  userTypeName = '';
  roleSorter: Array<RoleSorterHelper> = [];
  roleAccessList = [] as EnumObject[];
  accessControllerList = [] as EnumObject[];


  constructor(private securityManagementService: SecurityManagementService,
              private activatedRoute: ActivatedRoute) {
    this.userId = this.activatedRoute.snapshot.queryParams.userId;
    this.accessControllerList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<AccessController>(AccessController));
    this.roleAccessList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<Accesses>(Accesses));

  }

  ngOnInit() {
    this.getOne(this.userId);
    this.createAccessList();


  }

  getOne(userTypeId) {
    this.allSelectedFromMenu = [];
    this.userTypeSend = new UserTypeDto.CreateSend();
    this.securityManagementService.getOne({userTypeId}).subscribe((res: any) => {
      this.userTypeSend = res;
      this.userTypeName = res.name;
    });

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


  checkNgModel(role) {
    // اگه لیتسی اطلاعاتی برابر ورودی  داشت ترو برگردون
    if (this.userTypeSend.privilege) {
      if (this.userTypeSend.privilege.filter(e => e === role).length > 0) {
        return true;

        //   برای اینکه تیک خوده نشون بده بعدا
      }
    }
  }

  back() {
    window.history.back();
  }
}
