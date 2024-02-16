import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivityBaseComponent} from '../shared/activity-base-component';
import {Organization} from '../../model/organization/organization';
import {Post} from '../../model/post/post';
import {OrganizationService} from '../../service/organization/organization.service';
import {PostService} from '../../service/post/post.service';
import {DefaultNotify} from '@angular-boot/util';
import {SmartTableConfig, SmartTableConfigI} from '../../../../shared/util-module/smart-table-test/smart-table-config';
import {untilDestroyed} from '../../../../shared/service/take-until-destroy';
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent extends ActivityBaseComponent implements OnInit, OnDestroy {

  data: any[];
  config: SmartTableConfigI;
  expanderTemplate: any;
  newOrganization: Organization = new Organization();
  organizations: Organization[] = [];
  postList: Post[] = [];
  mode = '';
  newForm: FormGroup;
  editForm: FormGroup;
  // userParkList: Park.ResScienceParkGetOneDTO [] = [];

  constructor(injector: Injector,
              private organizationService: OrganizationService,
              private postService: PostService) {
    super(injector);
    this.newForm = this.formBuilder.group(
      {
        titleNew: new FormControl(null, [Validators.required])
      }
    );
    this.editForm = this.formBuilder.group({
      titleEdit: new FormControl(null, [Validators.required])
    });
    this.config = {
      data: [],
      table: {
        rows: [],
        columns: [
          {
            title: '#'
          },
          {
            title: 'نام سازمان',
            name: 'title',
            sort: '',
            filtering: {filterString: ''},
          },
          {
            title: 'پست های این سازمان',
          },
          {
            title: 'ویرایش',
          },
          {
            title: 'حذف',
          },
        ]
      },
      export: {},
      paging: {},
      filtering: {filterString: ''},
    };
  }

  createData(res) {
    this.config.data = [];
    const getOrganizationTitleByPostList = (item: any) => {
      let ret = item.title;
      let isExist = false;
      if (this.postList.length > 0) {
        for (const post of this.postList) {
          if (item.id === post.organizationId) {
            if (!isExist) {
              isExist = true;
              ret += '(' + post.title;
            } else {
              ret += ',' + post.title;
            }
          }
        }
        if (isExist) {
          ret += ')';
        }
      }
      return ret;
    };
    const data = [];
    for (const i of res) {
      const row = {
        id: i.id,
        title: getOrganizationTitleByPostList(i)
      };
      data.push(row);
    }
    return data;
  }

  ngOnInit() {
    this.organizationService.getAllByParkId(JSON.parse(sessionStorage.getItem('user')).orgId).subscribe( (res: any) => {
      if (res && res.length) {
        this.organizations = res;
      }
    });
  }

  // getAllPost() {
  //   this.postService.getAllByParkId(this.userParkList[0].id)
  //     .pipe(untilDestroyed(this))
  //     .subscribe((res: Post[]) => {
  //       if (res.length > 0) {
  //         this.postList = res;
  //         this.setTableDate();
  //       }
  //     });
  // }

  cancelOperation() {
    this.mode = '';
    this.newOrganization = new Organization();
  }

  editOrganization(id: string) {
    this.organizationService.getOne(id)
      .pipe(untilDestroyed(this))
      .subscribe((res: Organization) => {
        this.newOrganization = res;
        this.mode = 'edit';
        this.setTableDate();
      });
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    let top = document.getElementById('determine-access');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }

  addOrganization() {
    this.mode = 'new';
  }


  doAddOrganization() {
    if (this.newForm.invalid) {
      DefaultNotify.notifyDanger('اطلاعات فرم کامل نیست.', '', NotiConfig.notifyConfig);
      return;
    }
    const user = JSON.parse(sessionStorage.getItem('user'));
    this.newOrganization.parkId = user.orgId;
    this.organizationService.create(this.newOrganization)
      .pipe(untilDestroyed(this))
      .subscribe((res: Organization) => {
        if (res && res.id) {
          DefaultNotify.notifySuccess('سازمان با موفقیت ثبت شد', '', NotiConfig.notifyConfig);
          this.organizations.push(res);
          this.newOrganization.title = res.title;
          this.newOrganization.parkId = res.parkId;
          this.mode = '';
          this.setTableDate();
          this.newForm.reset();
          this.newOrganization = new Organization();
        } else {
          DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.', '', NotiConfig.notifyConfig);
        }
      });
  }

  doEditOrganization() {
    this.organizationService.update(this.newOrganization)
      .pipe(untilDestroyed(this))
      .subscribe((res: Organization) => {
        if (res && res.id) {
          DefaultNotify.notifySuccess('ویرایش با موفقیت انجام شد.', '', NotiConfig.notifyConfig);
          const length = this.organizations.length;
          for (let i = 0; i < length; i++) {
            if (this.organizations[i].id === res.id) {
              this.organizations[i] = res;
              break;
            }
          }
          this.mode = '';
          this.setTableDate();
          this.editForm.reset();
          this.newOrganization = new Organization();
        } else {
          DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.', '', NotiConfig.notifyConfig);
        }
      });
  }

  deleteOrganization(organizationId) {
    if (confirm('آیا مایل به حذف هستید؟')) {
      this.organizationService.delete(organizationId)
        .pipe(untilDestroyed(this))
        .subscribe((res) => {
          if (res === true) {
            DefaultNotify.notifySuccess('حذف با موفقیت انجام شد', '', NotiConfig.notifyConfig);
            for (let i = 0; i < this.organizations.length; i++) {
              if (this.organizations[i].id === organizationId) {
                this.organizations.splice(i, 1);
                this.setTableDate();
              }
            }
          } else {
            DefaultNotify.notifyDanger('این سازمان دارای پست بوده و نمیتوانید آن را حذف کنید.', '', NotiConfig.notifyConfig);
          }
        });
    }
  }

  setTableDate() {
    this.config.data = this.createData(this.organizations);
    this.config = SmartTableConfig.getInstance(this.config);
  }

  ngOnDestroy(): void {
  }

  // getUserParkList() {
  //   this.userParkList = JSON.parse(sessionStorage.getItem(USER_PARK_LIST));
  //   if (this.userParkList) {
  //     this.getAllByParkId();
  //   }
  //
  // }

  // private getAllByParkId() {
  //   this.organizationService.getAllByParkId(this.userParkList[0].id)
  //     .pipe(untilDestroyed(this))
  //     .subscribe((res: Organization[]) => {
  //       this.organizations = res;
  //       if (res.length > 0) {
  //         this.getAllPost();
  //       }
  //       this.setTableDate();
  //     }, null);
  // }
}
