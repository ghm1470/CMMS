import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivityBaseComponent} from '../shared/activity-base-component';
import {Post} from '../../model/post/post';
import {PostService} from '../../service/post/post.service';
import {DefaultNotify} from '@angular-boot/util';
import {SmartTableConfig, SmartTableConfigI} from '../../../../shared/util-module/smart-table-test/smart-table-config';
import {untilDestroyed} from '../../../../shared/service/take-until-destroy';
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent extends ActivityBaseComponent implements OnInit, OnDestroy {
  data: any[];
  config: SmartTableConfigI;
  expanderTemplate: any;
  newPost: Post = {} as Post;
  posts: Post[] = [];
  mode = '';
  organizationId: string;
  organizationTitle: string;
  newForm: FormGroup;
  editForm: FormGroup;

  constructor(injector: Injector,
              private postService: PostService) {
    super(injector);
    this.newForm = this.formBuilder.group({titleNew: new FormControl(null, [Validators.required])});
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
            title: 'نام پست',
            name: 'title',
            sort: '',
            filtering: {filterString: ''},
          },
          // {
          //   title: 'لیست دسترسی ها',
          // },
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
    const data = [];
    for (const i of res) {
      const row = {
        id: i.id,
        title: i.title,
        accountingAccess: i.accountingAccess,
        statisticsAccess: i.statisticsAccess,
        tripsAccess: i.tripsAccess,
        requestAccess: i.requestAccess,
        hallAccess: i.hallAccess,
        createRequestAccess: i.createRequestAccess,
        manageEmployeeAccess: i.manageEmployeeAccess,
        activityAccess: i.activityAccess,
        formBuilderAccess: i.formBuilderAccess
      };
      data.push(row);
    }
    return data;
  }

  ngOnInit() {
    this.route.params
      .pipe(untilDestroyed(this))
      .subscribe(param => {
        this.organizationId = param.id;
        this.organizationTitle = param.title;
        this.newPost.organizationId = this.organizationId;
        this.postService.getAllByOrganization(this.organizationId)
          .pipe(untilDestroyed(this))
          .subscribe((res: Post[]) => {
            this.posts = res;
            this.setTableDate();
          }, null);
      });
  }

  cancelOperation() {
    this.mode = '';
    this.newPost = new Post();
  }

  editPost(id: string) {
    this.postService.getOne(id)
      .pipe(untilDestroyed(this))
      .subscribe((res: Post) => {
        this.newPost = res;
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

  addPost() {
    this.mode = 'new';
    this.newPost = new Post();
    this.newPost.organizationId = this.organizationId;
  }


  doAddPost() {
    this.postService.create(this.newPost)
      .pipe(untilDestroyed(this))
      .subscribe((res: Post) => {
        if (res && res.id) {
          DefaultNotify.notifySuccess('پست با موفقیت ثبت شد.', '', NotiConfig.notifyConfig);
          this.posts.push(res);
          this.newPost = new Post();
          this.newPost.organizationId = this.organizationId;
          this.mode = '';
          this.newForm.reset();
          this.setTableDate();
        } else {
          DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.', '', NotiConfig.notifyConfig);
        }
      });
  }

  setTableDate() {
    this.config.data = this.createData(this.posts);
    this.config = SmartTableConfig.getInstance(this.config);
  }

  doEditPost() {
    this.postService.update(this.newPost)
      .pipe(untilDestroyed(this))
      .subscribe((res: Post) => {
        if (res && res.id) {
          DefaultNotify.notifySuccess('ویرایش با موفقیت انجام شد', '', NotiConfig.notifyConfig);
          for (let i = 0; i < this.posts.length; i++) {
            if (this.posts[i].id === res.id) {
              this.posts[i] = res;
              break;
            }
          }
          this.mode = '';
          this.setTableDate();
          this.editForm.reset();
          this.newPost = {} as Post;
          this.newPost.organizationId = this.organizationId;
        } else {
          DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.', '', NotiConfig.notifyConfig);
        }
      });
  }

  deletePost(postId) {
    if (confirm('آیا مایل به حذف هستید؟')) {
      this.postService.delete(postId)
        .pipe(untilDestroyed(this))
        .subscribe((res) => {
          if (res === true) {
            DefaultNotify.notifySuccess('حذف با موفقیت انجام شد.', '', NotiConfig.notifyConfig);
            for (let i = 0; i < this.posts.length; i++) {
              if (this.posts[i].id === postId) {
                this.posts.splice(i, 1);
                this.setTableDate();
              }
            }
          } else {
            DefaultNotify.notifyDanger('از این پست برای کارمندان استفاده شده و نمیتوانید آن را حذف کنید.', '', NotiConfig.notifyConfig);
          }
        });
    }
  }

  ngOnDestroy(): void {
  }

}
