import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {ActivityService} from '../../../activity/service/activity.service';
import {ActivityLevel} from '../../../activity/model/activityLevel';
import {takeUntilDestroyed} from '@angular-boot/core';
import {UserDto} from '../../../user/model/dto/user-dto';
import {UserService} from '../../../user/endpoint/user.service';
import {isNullOrUndefined} from 'util';
import {SecurityManagementService} from "../../../securityManagement/endpoint/security-management.service";

@Component({
    selector: 'app-acceptation-process',
    templateUrl: './acceptation-process.component.html',
    styleUrls: ['./acceptation-process.component.scss']
})
export class AcceptationProcessComponent implements OnInit, OnChanges, OnDestroy {
    @Input() activityInstanceId: string;
    @Input() submitWorkRequestTitle: string;


    processList: ActivityLevelList[] = [];
    processList2 = [];
    t = 1;
    userList: UserDto.Create[] = [];
    loading = false;
    user = new UserDto.Create();

    activitySample: any;


    constructor(private activityService: ActivityService,
                private securityManagementService: SecurityManagementService,
                private userService: UserService) {
    }

    ngOnInit() {
        if (this.activityInstanceId) {
            // this.getAllUser();
            this.getStatusOfMyRequest();
        }
    }


    getStatusOfMyRequest() {
        this.loading = true;
        this.activityService.getActivitySampleByInstanceId({workRequestId: this.activityInstanceId})
            .subscribe((res: V) => {
                this.loading = false;

                if (res) {

                    this.activitySample = res;
                    this.processList = res.activityLevelList;

                    if (res.activityLevelSequenceHistory && res.activityLevelSequenceHistory.length > 0) {
                        this.processList2.push(this.processList.find(e => e.id === 'start'));
                        for (const item of res.activityLevelSequenceHistory) {
                            let itemEdit = new ActivityLevelList();
                            for (const acL of this.processList) {
                                if (item.levelId === acL.id) {
                                    itemEdit = JSON.parse(JSON.stringify(acL));
                                    itemEdit.actionLevel = item.status;
                                    this.processList2.push(JSON.parse(JSON.stringify(itemEdit)));
                                }
                            }
                        }
                        if (res.activityLevelSequenceHistory[res.activityLevelSequenceHistory.length - 1].status === 'accepted') {
                            const startIndex: number = res.activityLevelList.findIndex(e => e.id
                                === res.activityLevelSequenceHistory[res.activityLevelSequenceHistory.length - 1].levelId);
                            if (startIndex !== res.activityLevelList.length - 1) {
                                for (let j = startIndex + 1; j < res.activityLevelList.length; j++) {
                                    this.processList2.push(res.activityLevelList[j]);
                                }
                            } else {
                                this.processList2.push(res.activityLevelList.find(e => e.id = 'end'));
                            }
                        }
                        if (res.activityLevelSequenceHistory[res.activityLevelSequenceHistory.length - 1].status === 'rejected') {

                            const prevId = res.activityLevelList.find(e => e.id ===
                                res.activityLevelSequenceHistory[res.activityLevelSequenceHistory.length - 1].levelId).prevActivityLevel.id;
                            const startIndex: number = res.activityLevelList.findIndex(e => e.id
                                === prevId);
                            if (startIndex !== res.activityLevelList.length - 1) {
                                for (let j = startIndex; j < res.activityLevelList.length; j++) {
                                    let my;
                                    my = JSON.parse(JSON.stringify(res.activityLevelList[j]));
                                    // this.processList2.push(res.activityLevelList[j]);
                                    if (j !== startIndex && j !== res.activityLevelList.length - 1) {
                                        my.actionLevel = JSON.parse(JSON.stringify('waiting'));
                                    } else {
                                        my.actionLevel = JSON.parse(JSON.stringify('pending'));
                                    }
                                    if (my.id === 'end') {
                                        my.actionLevel = JSON.parse(JSON.stringify('end'));
                                    }
                                    this.processList2.push(my);
                                }
                            } else {
                                this.processList2.push(res.activityLevelList.find(e => e.id = 'end'));
                            }
                        }


                    } else {
                        for (const ALL of res.activityLevelList) {
                            this.processList2.push(ALL);
                        }
                    }


                    for (const item of this.processList2) {
                        if (item.assignedUserId !== '') {
                            if (!isNullOrUndefined(item.assignedUserId)) {
                                this.userService.getOneMainInformation({userId: item.assignedUserId}).subscribe((resUser: any) => {


                                    item.assigned = resUser.name + ' ' + resUser.family + ' - ' + resUser.userTypeName;
                                    // item.assignedUserId = resUser.name;
                                    // item.userFamilyName = resUser.family;
                                    // item.userTypeName = resUser.userTypeName;
                                });
                            } else if (!isNullOrUndefined(item.userTypeId)) {
                                this.securityManagementService.getOne({userTypeId: item.userTypeId}).subscribe((resUserType: any) => {
                                    item.assigned = resUserType.name;
                                });
                            }
                        }

                    }
                }
            }, error => {
                this.loading = false;

            });

    }

    getAllUser() {
        this.userService.getAll().pipe(takeUntilDestroyed(this))
            .subscribe((res: UserDto.Create[]) => {
                if (res && res.length) {
                    this.userList = res;
                }
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
    }


    findAcceptId(item) {


    }

    ngOnDestroy(): void {
    }


}

export class V {
    active: boolean;
    activityInstanceId: string;
    activityLevelList: ActivityLevelList[] = [];
    activityLevelSequenceHistory: ActivityLevelSequenceHistory[] = [];
    description: string;
    id: string;
    relatedActivityId: string;
    requesterId: string;
    title: string;
    workOrderId: string;
    workRequestTitle: string;
}

export class ActivityLevelSequenceHistory {
    levelId: string;
    status: string;
    formData: string;
    levelEndDate: Date;
}

export class ActivityLevelList {
    // actionLevel: string;
    // cancel: false;
    // firstStepIs: false;
    // formDataId: string;
    // id: string;

    id: string;
    title: string;
    recipe: string;
    orgId: string;
    // private ObjectId formId;
    //    private UserType userType;
    // private Object form;
    nextActivityLevel: ActivityLevel;
    prevActivityLevel: ActivityLevel;
    firstStepIs: boolean;
    lastStepIs: boolean;
    showHistory: boolean;
    canOperate: boolean;
    organizationName: string;
    formTitle: string;
    userId: string;
    assignedUserId: string;
    username: string;
    userFamilyName: string;
    userTypeId: string;
    userTypeTitle: string;
    organizationId: string;
    cancel: boolean;
    actionLevel: string;
    formIdBeta: string;
    formName: string;
    formDataId: string;
    pendingDate: Date;
    staticFormsIdList: [];
}

export class Rejected2List {
    startId: string;
    endId: string;
}
