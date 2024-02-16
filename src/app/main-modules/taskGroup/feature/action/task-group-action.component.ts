import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActionMode, DefaultNotify, isNullOrUndefined} from '@angular-boot/util';
import {MyPattern} from '../../../../shared/shared/tools/myPattern';
import {TaskGroupService} from '../../endpoint/task-group.service';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular-boot/core';
import {TaskGroupDto} from '../../model/dto/taskGroupDto';
import {Location} from '@angular/common';
import {FileModel} from '../../../../shared/model/fileModel';
import {UploadService} from '../../../../shared/service/upload.service';
import {TaskService} from '../task/endpoint/task.service';
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

declare var $: any;

@Component({
    selector: 'app-task-group-action',
    templateUrl: './task-group-action.component.html',
    styleUrls: ['./task-group-action.component.scss']
})
export class TaskGroupActionComponent implements OnInit, OnDestroy {
    @Input() mode: ActionMode = ActionMode.ADD;
    actionMode = ActionMode;
    taskGroup = new TaskGroupDto.Create();
    tasks: TaskGroupDto.Task[] = [];
    taskGroupCopy = new TaskGroupDto.Create();
    @Input() taskGroupId: string;
    @Input() from: string;
    myPattern = MyPattern;
    doSave = false;
    disabledButton = false;
    files: Array<File> = [];
    fileModel: Array<FileModel> = [];
    showFileDocument = false;
    showTasks = false;
    uniqCode;

    constructor(public location: Location,
                public uploadService: UploadService,
                public taskGroupService: TaskGroupService,
                public taskService: TaskService,
                public router: Router,
                private activatedRoute: ActivatedRoute) {
        if (this.activatedRoute.snapshot.queryParams.mode) {
            this.mode = this.activatedRoute.snapshot.queryParams.mode;
        }
        if (this.activatedRoute.snapshot.queryParams.entityId) {
            this.taskGroupId = this.activatedRoute.snapshot.queryParams.entityId;
        }
    }

    ngOnInit() {
        if (this.mode !== ActionMode.ADD) {
            if (!isNullOrUndefined(this.taskGroupId)) {
                this.getOne();
            }
        }
    }

    getOne() {
        this.taskGroupService.getOne({taskGroupId: this.taskGroupId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: TaskGroupDto.Create) => {
            if (res) {
                this.taskGroup = res;
                this.taskGroupCopy = JSON.parse(JSON.stringify(res));
            }
        });
    }

    action(form) {
        this.doSave = true;
        if (form.invalid) {
            DefaultNotify.notifyDanger('ورودی‌ها را بررسی کنید.', '', NotiConfig.notifyConfig);
            return;
        }
        if (this.mode === ActionMode.ADD) {
            this.taskGroupService.create(this.taskGroup)
                .pipe(takeUntilDestroyed(this)).subscribe(res => {
                if (res) {
                    DefaultNotify.notifySuccess('با موفقیت افزوده شد.', '', NotiConfig.notifyConfig);
                    // form.reset();
                    // this.cancel();
                    this.mode = ActionMode.EDIT;
                    this.taskGroupId = res.id;
                    this.taskGroup.id = res.id;
                    this.router.navigate([], {
                        queryParams: {mode: 'EDIT', taskGroupId: res.id},
                        relativeTo: this.activatedRoute
                    });
                }
            });
        } else if (this.mode === ActionMode.EDIT) {
            this.taskGroupService.update(this.taskGroup, {taskGroupId: this.taskGroupId})
                .pipe(takeUntilDestroyed(this)).subscribe(res => {
                if (res) {
                    DefaultNotify.notifySuccess('ویرایش با موفقیت انجام شد.', '', NotiConfig.notifyConfig);
                    // this.cancel();
                }
            });
        }
    }

    cancel() {
        this.location.back();
    }

    ngOnDestroy(): void {
    }

    changeTaskGroupCode() {
        this.uniqCode = true;
        this.taskGroupService.checkTaskGroupCode({taskGroupCode: this.taskGroup.code})
            .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            if (res) {
                DefaultNotify.notifyDanger('کد وارد شده تکراری است.', '', NotiConfig.notifyConfig);
                this.uniqCode = false;
                if (isNullOrUndefined(this.taskGroup.id)) {
                    this.taskGroup.code = '';
                } else {
                    this.uniqCode = false;
                    this.taskGroup.code = this.taskGroupCopy.code;
                }
            } else {
                this.uniqCode = false;
            }
        });
    }

    changeTaskList(event) {
        this.tasks = event;
    }

    nextCarousel(event) {
        if (event) {
            this.showFileDocument = true;
            setTimeout(() => {
                $('#carouselExampleControlsTow').carousel('next');
            }, 200);
        }
        if (!event) {
            setTimeout(() => {
                $('#carouselExampleControlsTow').carousel('prev');
            }, 200);
        }
    }

    private getAllTaskByTaskGroupId(id) {
        this.taskService.getTaskListByTaskGroupId({taskGroupId: id}).pipe(takeUntilDestroyed(this))
            .subscribe((res: TaskGroupDto.Task[]) => {
                if (res) {
                    this.tasks = res;
                }
            });
    }

    next() {
        $('#taskCreate').carousel('next');
        if (this.mode !== ActionMode.ADD) {
            if (!isNullOrUndefined(this.taskGroupId)) {
                this.getAllTaskByTaskGroupId(this.taskGroup.id);
            }
        }

    }

    prev() {
        $('#taskCreate').carousel('prev');
    }
}
