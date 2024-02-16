import {AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {MyPattern} from '../../../../../shared/shared/tools/myPattern';
import {ModalSize} from '@angular-boot/util';
import {ActivatedRoute, Router} from '@angular/router';
import {WorkTableDto} from '../../../model/workTable';
import {WorkOrderRepositoryService} from '../../../../workOrder/endpoint/work-order-repository.service';
import {takeUntilDestroyed} from '@angular-boot/core';
import {isNullOrUndefined} from 'util';
import {ModalUtil} from '@angular-boot/widgets';
import {Form} from '../../../../formBuilder/fb-model/form/form';
import {WorkOrderDto} from '../../../../workOrder/model/dto/workOrderDto';
import MaintenanceType = WorkOrderDto.MaintenanceType;
import {ActivityService} from '../../../../activity/service/activity.service';

declare var $: any;

@Component({
    selector: 'app-show-the-form-of-previous-steps',
    templateUrl: './show-the-form-of-previous-steps.component.html',
    styleUrls: ['./show-the-form-of-previous-steps.component.scss']
})
export class ShowTheFormOfPreviousStepsComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
    @Input() activityInstanceId: string;
    @Input() activityLevelId: string;
    @Input() from: string;
    @Input() numberOfParticipation: number;
    @Input() sendUser: SendUser;
    @Input() workOrderAccessId: string;
    @Input() workOrderId: string;
    @Input() formIdList: string[];
    doSave = false;
    workOrder = false;
    basicInformation = false;
    completionDetails = false;
    tasks = false;
    taskGroup = false;
    parts = false;
    miscCost = false;
    notification = false;
    reports = false;
    file = false;
    formComplete = false;
    workOrderAndFormRepository = new WorkTableDto.ActivitySampleWorkOrderAndFormRepository();
    sendInformationNumberOfTabs = new SendInformationNumberOfTabs();
    formTitle: string;
    formId: string;
    form = new Form();
    formDataId: string;
    // ============================
    myPattern = MyPattern;
    MyModalSize = ModalSize;
    maintenanceType: string;
    priority: string;
    workOrderStatus: string;
    loading = false;
    asset: string;
    workOrderCreateDTO = new WorkOrderDto.Create();


    constructor(private workOrderRepositoryService: WorkOrderRepositoryService,
                private router: Router,
                private  activityService: ActivityService,
                private activatedRoute: ActivatedRoute,
    ) {
    }

    ngOnInit() {
        this.getActivitySampleFormAndFormData();

    }

    activitySampleFormList = [];

    getActivitySampleFormAndFormData() {
        this.activityService.getActivitySampleFormAndFormData(
            {activitySampleId: this.activityInstanceId}).subscribe((res: any) => {
            if (res) {
                this.activitySampleFormList = res;
                this.formComplete = true;
            }

        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!isNullOrUndefined(changes.formIdList)) {
            // ========================فعلا از ماژول گزارشات استفاده نمیشود
            // if (!isNullOrUndefined(this.formIdList.find(e => e === 'reports'))) {
            //   this.formIdList.splice(this.formIdList.findIndex(e => e === 'reports'), 1);
            // }
            this.sendInformationNumberOfTabs.lengthFormIdList = this.formIdList.length;
            // ===========================================================
            // this.formIdList.filter(e => e === 'tasks');
        }
        if (changes.activityLevelId) {
            if (!isNullOrUndefined(this.activityLevelId)) {
                this.getWorkOrderRepository();
            }
        }
        if (changes.numberOfParticipation) {
            this.sendInformationNumberOfTabs.numberOfFormIdList = new SendInformationNumberOfTabs().numberOfFormIdList;
        }
        this.loading = true;
    }


    getWorkOrderRepository() {
        this.workOrder = false;
        this.formComplete = false;
        this.workOrderRepositoryService.getOne(
            {
                activityInstanceId: this.activityInstanceId,
                activityLevelId: this.activityLevelId,
                numberOfParticipation: this.numberOfParticipation
            }).pipe(takeUntilDestroyed(this))
            .subscribe((res: WorkTableDto.ActivitySampleWorkOrderAndFormRepository) => {
                this.loading = false;
                this.workOrderAndFormRepository = res;
                if (!isNullOrUndefined(res.workOrderCreateDTO)) {
                    this.workOrderCreateDTO = res.workOrderCreateDTO;
                }
                if (!isNullOrUndefined(res.form)) {
                    this.formId = res.form.id;
                    this.sendInformationNumberOfTabs.hasForm = true;
                }
                if (!isNullOrUndefined(res.formData)) {
                    this.formDataId = res.formData.formId;
                }
                if (this.formIdList.length > 0) {
                    this.workOrder = true;
                } else if (this.formIdList.length === 0) {
                    this.formComplete = true;
                }
            });
    }

    ngAfterViewInit(): void {
    }

    ngOnDestroy(): void {
    }

    backToList() {
        ModalUtil.hideModal('showWorkRequestModal');
    }

    nextCarousel(event) {
        const carouselIndex = $('#carouselExampleControlsModal div.active').index();
        if (event) {
            if (carouselIndex < 7) {
                switch (carouselIndex) {
                    case 0: {
                        this.completionDetails = true;
                        this.setCarousel(1, 'completionDetailsB');
                        break;
                    }
                    case 1: {
                        this.basicInformation = true;
                        this.setCarousel(2, 'basicInformationB');
                        break;
                    }
                    case 2: {
                        this.tasks = true;
                        this.setCarousel(3, 'tasksB');
                        break;
                    }
                    case 3: {
                        this.taskGroup = true;
                        this.setCarousel(4, 'taskGroupB');
                        break;
                    }
                    case 4: {
                        this.parts = true;
                        this.setCarousel(5, 'partsB');
                        break;
                    }
                    case 5: {
                        this.miscCost = true;
                        this.setCarousel(6, 'miscCostB');
                        break;
                    }
                    case 6: {
                        this.file = true;
                        this.setCarousel(7, 'fileB');
                        break;
                    }
                    // case 7: {
                    //     this.formComplete = true;
                    //     this.setCarousel(8, 'formCompleteB');
                    //     break;
                    // }
                }

            } else {
                this.setCarousel(carouselIndex + 1, 'formCompleteB' + (carouselIndex - 7));

            }
            //     $('#carouselExampleControls').carousel('next');


        }
        if (!event) {
            if (carouselIndex < 9) {

                switch (carouselIndex) {
                    case 1: {
                        this.basicInformation = true;
                        this.setCarousel(0, 'informationB');
                        break;
                    }
                    case 2: {
                        this.completionDetails = true;
                        this.setCarousel(1, 'completionDetailsB');
                        break;
                    }
                    case 3: {
                        this.basicInformation = true;
                        this.setCarousel(2, 'basicInformationB');
                        break;
                    }
                    case 4: {
                        this.tasks = true;
                        this.setCarousel(3, 'tasksB');
                        break;
                    }
                    case 5: {
                        this.taskGroup = true;
                        this.setCarousel(4, 'taskGroupB');
                        break;
                    }
                    case 6: {
                        this.parts = true;
                        this.setCarousel(5, 'partsB');
                        break;
                    }
                    case 7: {
                        this.miscCost = true;
                        this.setCarousel(6, 'miscCostB');
                        break;
                    }
                    case 8: {
                        this.file = true;
                        this.setCarousel(7, 'fileB');
                        break;
                    }
                }
            } else {
                this.setCarousel(carouselIndex - 1, 'formCompleteB' + (carouselIndex - 9));

            }
        }
    }

    setCarousel(index, id) {
        $('#carouselExampleControlsModal').carousel(index);
        setTimeout(e => {
            $('#' + id).click();
        }, 700);
        // this.navigate(index, id);
    }

    nextCarousel1(event) {
        if (event) {
            this.sendInformationNumberOfTabs.lengthFormIdList = this.formIdList.length;
            if (this.sendInformationNumberOfTabs.numberOfFormIdList < this.sendInformationNumberOfTabs.lengthFormIdList - 1) {
                const key = this.formIdList[this.sendInformationNumberOfTabs.numberOfFormIdList];
                this.sendInformationNumberOfTabs.numberOfFormIdList = this.sendInformationNumberOfTabs.numberOfFormIdList + 1;
                if (key === 'information') {
                    this.basicInformation = true;
                    setTimeout(() => {
                        $('#carouselExampleControls').carousel('next');
                    }, 200);
                }
                if (key === 'completionDetails') {
                    this.completionDetails = true;
                    setTimeout(() => {
                        $('#carouselExampleControls').carousel('next');
                    }, 200);
                }
                if (key === 'tasks') {
                    this.tasks = true;
                    setTimeout(() => {
                        $('#carouselExampleControls').carousel('next');
                    }, 200);
                }
                if (key === 'taskGroup') {
                    this.taskGroup = true;
                    setTimeout(() => {
                        $('#carouselExampleControls').carousel('next');
                    }, 200);
                }
                if (key === 'workOrderPart') {
                    this.parts = true;
                    setTimeout(() => {
                        $('#carouselExampleControls').carousel('next');
                    }, 200);
                }
                if (key === 'miscCost') {
                    this.miscCost = true;
                    setTimeout(() => {
                        $('#carouselExampleControls').carousel('next');
                    }, 200);
                }
                if (key === 'notification') {
                    this.notification = true;
                    setTimeout(() => {
                        $('#carouselExampleControls').carousel('next');
                    }, 200);
                }
                if (key === 'file') {
                    this.file = true;
                    setTimeout(() => {
                        $('#carouselExampleControls').carousel('next');
                    }, 200);
                }
            }
            if (this.sendInformationNumberOfTabs.numberOfFormIdList === this.sendInformationNumberOfTabs.lengthFormIdList - 1
                && !isNullOrUndefined(this.formId)) {
                this.formComplete = true;
                this.sendInformationNumberOfTabs.hasForm = true;
                setTimeout(() => {
                    $('#carouselExampleControls').carousel('next');
                }, 200);
            }
        }
        if (!event) {
            this.sendInformationNumberOfTabs.numberOfFormIdList = this.sendInformationNumberOfTabs.numberOfFormIdList - 1;
            setTimeout(() => {
                $('#carouselExampleControls').carousel('prev');
            }, 200);
        }
    }


    getFormWorKOrder(event: boolean) {
        if (event) {
            $('#workOrder').addClass('active');
        }
    }

    getFormTitle(event) {
        this.formTitle = event;
        if (!this.workOrder) {
            this.loading = false;
            setTimeout(() => {
                $('#formComplete').addClass('active');

            }, 30);
        }
    }


}

export class SendUser {
    userTypeTitle: string;
    username: string;
    userFamilyName: string;
}

export class WorkOrderForWorkOrderAndFormRepository {
    assetCode: string;
    assetId: string;
    assetName: string;
    code: string;
    creationDate: Date;
    endDate: Date;
    fromSchedule = false;
    id: string;
    image: null;
    maintenanceType: MaintenanceType;
    projectId: string;
    requiredCompletionDate: Date;
    startDate: Date;
    status = false;
    statusId: string;
    title: string;
}

export class SendInformationNumberOfTabs {
    numberOfFormIdList = 0;
    lengthFormIdList: number;
    hasForm = false;
}
