import {AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {ReceiveWorkRequest} from '../../../submitWorkRequest/model/submit-work-request';
import {MyPattern} from '../../../../shared/shared/tools/myPattern';
import {EnumObject} from '../../../formBuilder/shared/utility/enum-array/enum-object';
import {AssetService} from '../../../asset/endpoint/asset.service';
import {ActivatedRoute, Router} from '@angular/router';
import {WorkRequestService} from '../../../submitWorkRequest/endpoint/work-request.service';
import {EnumHandle} from '../../../formBuilder/shared/utility/enum-array/enum-handle';
import {WorkOrderStatusEnum} from '../../../basicInformation/workOrderStatus/model/helper/workOrderStatusEnum';
import {isNullOrUndefined, ModalSize} from '@angular-boot/util';
import {WorkOrderDto} from '../../../workOrder/model/dto/workOrderDto';
import Priority = WorkOrderDto.Priority;
import MaintenanceType = WorkOrderDto.MaintenanceType;
import {ModalUtil} from '@angular-boot/widgets';

@Component({
    selector: 'app-show-work-request-modal',
    templateUrl: './show-work-request-modal.component.html',
    styleUrls: ['./show-work-request-modal.component.scss']
})
export class ShowWorkRequestModalComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
    @Input() workRequestId: string;
    doSave = false;
    submitWorkRequest = new ReceiveWorkRequest();
    myPattern = MyPattern;
    workOrderStatusList: EnumObject[] = [];
    priorityList: EnumObject[] = [];
    maintenanceTypeList: EnumObject[] = [];
    MyModalSize = ModalSize;
    maintenanceType: string;
    priority: string;
    workOrderStatus: string;
    loading = false;
    asset: string;

    activityInstanceId: string;

    constructor(private assetService: AssetService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private workRequestService: WorkRequestService,
    ) {
    }

    ngOnInit() {
        this.workOrderStatusList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<WorkOrderStatusEnum>(WorkOrderStatusEnum));
        this.priorityList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<Priority>(Priority));
        this.maintenanceTypeList = EnumHandle.getEnumObjectList(EnumHandle.listEnums<MaintenanceType>(MaintenanceType));
    }

    ngOnChanges(): void {
        this.loading = true;
        if (this.workRequestId) {
            this.getOneWorkRequest();
        } else {
            setTimeout(() => {
                this.ngOnChanges();
            }, 50);
        }
    }


    getOneWorkRequest() {
        this.workRequestService.getOneWorkRequest({workRequestId: this.workRequestId})
            .subscribe(res => {
                if (!isNullOrUndefined(res)) {
                    this.loading = false;
                    this.submitWorkRequest = res;
                    this.asset = this.submitWorkRequest.assetName;
                    if (this.submitWorkRequest.maintenanceType) {
                        this.maintenanceType = this.maintenanceTypeList.find(e =>
                            e.value === this.submitWorkRequest.maintenanceType.toString()).title;
                    }
                    if (this.submitWorkRequest.priority) {

                        this.priority = this.priorityList.find(e =>
                            e.value === this.submitWorkRequest.priority.toString()).title;
                    }
                    this.loading = false;

                }
            });
    }

    backToList() {
        ModalUtil.hideModal('showWorkRequestModal');
    }


    ngOnDestroy(): void {
    }

    ngAfterViewInit(): void {

    }


}
