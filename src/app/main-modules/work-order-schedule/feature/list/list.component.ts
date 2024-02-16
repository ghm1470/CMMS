import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AssetService} from '../../../asset/endpoint/asset.service';
import {ActionMode, DefaultNotify, isNullOrUndefined, ModalSize, Paging} from '@angular-boot/util';
import {ActivatedRoute, Router} from '@angular/router';
import {TypeOfActivityService} from '../../../basicInformation/type-of-activity/endpoint/type-of-activity.service';
import {DegreeOfImportanceService} from '../../../basicInformation/degree-of-importance/endpoint/degree-of-importance.service';
import {WorkingFieldService} from '../../../basicInformation/working-field/endpoint/working-field.service';
import {WorkOrderScheduleService} from '../../../work-table-schedule/endpoint/work-order-schedule.service';
import {Moment} from '../../../../shared/shared/tools/date/moment';
import {AssetDto} from '../../../asset/model/dto/assetDto';
import {FormControl, FormGroup} from '@angular/forms';
import {workingField} from '../../../basicInformation/working-field/model/working-field-dto';
import {typeOfActivityDto} from '../../../basicInformation/type-of-activity/model/type-of-activity-dto';
import {DegreeOfImportanceDto} from '../../../basicInformation/degree-of-importance/model/degree-of-importance-dto';
import {ScheduleDto} from '../../../scheduling/model/scheduleDto';
import {UserDto} from '../../../user/model/dto/user-dto';
import {WorkOrderSchedule} from '../../model/workOrderSchedule';
import {CacheService, CacheType, takeUntilDestroyed} from '@angular-boot/core';
import {ModalUtil} from '@angular-boot/widgets';
import {NotiConfig} from '../../../../shared/tools/notifyConfig';
import * as XLSX from 'xlsx';
import {NumberTools} from '../../../../shared/tools/numberTools';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {TokenRoleList} from '../../../../shared/shared/constants/tokenRoleList';
import {Auth} from '../../../../shared/constants/cacheKeys';

declare var $: any;

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, AfterViewInit, OnDestroy {

    constructor(private entityService: WorkOrderScheduleService,
                private cacheService: CacheService,
                public assetService: AssetService,
                public router: Router,
                private typeOfActivityService: TypeOfActivityService, // نوع فعایت
                private degreeOfImportanceService: DegreeOfImportanceService, //  درجه اهمیت
                private workingFieldService: WorkingFieldService, // رسته کاری
                private activatedRoute: ActivatedRoute) {
        this.user = JSON.parse(sessionStorage.getItem('user'));
        this.activatedRoute.queryParams.subscribe(params => {
            params.pageIndex ? this.pageIndex = params.pageIndex : '';
            params.pageSize ? this.pageSize = params.pageSize : '';
            this.getPage();
        });
    }
    myMoment = Moment;
    listMode = true;
    loading = false;
    assetList: AssetDto.CreateAsset[] = [];
    getAllByFilterAndPagination = new WorkOrderSchedule.GetPageDto();
    entityList: WorkOrderSchedule.GetPage[] = [];
    entityListForReport: WorkOrderSchedule.GetPage[] = [];
    pageSize = 10;
    pageIndex = 0;
    length = -1;
    htmlForm: FormGroup;
    loadingAllAsset = false;
    majorPartList: AssetDto.CreateAsset[] = [];
    loadingMajorPart = false;
    readAsset;
// رسته کاری
    workingFieldList: workingField.GetAll[];
    loadingWorkingFieldList: boolean;
    // نوع فعایت
    typeOfActivityList: typeOfActivityDto.GetAll[];
    loadingTypeOfActivityList: boolean;
    //  درجه اهمیت
    degreeOfImportanceList: DegreeOfImportanceDto.GetAll[];
    loadingDegreeOfImportanceList: boolean;
    status: boolean;
    AssetStatus = ScheduleDto.AssetStatus;
    inputStartDate: any;
    inputEndDate: any;
    user: UserDto.Create = new UserDto.Create();

    MyModalSize = ModalSize;
    selectedSolution: string;
    selectedEntity = new WorkOrderSchedule.GetPage();
    ActionMode = ActionMode;

    loadingRouterToAction = false;

    loadingOpenPdf = false;
    @ViewChild('htmlData', {static: false}) htmlData: ElementRef;
    @ViewChild('table', {static: false}) table: ElementRef;

    roleList = new TokenRoleList();

    loadingForCheckUpdate = false;
    selectedWorkOrderIdForCheck: string;

    selectedItemIdForAction: string;
    modeForAction = ActionMode.VIEW;

    ngOnInit(): void {
        this.getRoleListKey();
        this.creatForm();
        this.getAllFacility();
        this.getAllTypeOfActivity();
        this.getAllDegreeOfImportanceList();
        this.getAllWorkingFieldList();
    }

    getRoleListKey() {
        this.cacheService.getItem(Auth.RoleListKey,
            CacheType.LOCAL_STORAGE).pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            if (res) {
                this.roleList = res;
            }
        });
    }

    creatForm() {
        this.htmlForm = new FormGroup({
            assetId: new FormControl(), // نام دستگاه
            majorPartList: new FormControl({value: null, disabled: true}), // قطعه اصلی
            minorPart: new FormControl({value: null, disabled: true}), // قطعه جزئی
            typeOfActivity: new FormControl(),  // نوع فعایت
            workingField: new FormControl(), // رسته کاری
            degreeOfImportance: new FormControl(),  //  درجه اهمیت
            assetStatus: new FormControl(),  // وضعیت تجهیز
            startDate: new FormControl(),  // تاریخ سررسید از تاریخ
            endDate: new FormControl(),  //  تاریخ سررسید تا تاریخ
        });
    }

    setDateJquery() {
        setTimeout(t => {
            $('#inputStartDate').azPersianDateTimePicker({
                Placement: 'bottom', // default is 'bottom'
                Trigger: 'click', // default is 'focus',
                enableTimePicker: false, // default is true,
                TargetSelector: '', // default is empty,
                GroupId: '', // default is empty,
                ToDate: false, // default is false,
                FromDate: false, // default is false,
                targetTextSelector: $('#inputStartDate'),
                textFormat: 'yyyy/MM/dd ',
            })
                .on('change', (e) => {
                    const val = $(e.currentTarget).val();
                    this.inputStartDate = val;
                    console.log(val);
                });
            $('#inputEndDate').azPersianDateTimePicker({
                Placement: 'bottom', // default is 'bottom'
                Trigger: 'click', // default is 'focus',
                enableTimePicker: false, // default is true,
                TargetSelector: '', // default is empty,
                GroupId: '', // default is empty,
                ToDate: false, // default is false,
                FromDate: false, // default is false,
                targetTextSelector: $('#inputEndDate'),
                textFormat: 'yyyy/MM/dd ',
            })
                .on('change', (e) => {
                    const val = $(e.currentTarget).val();
                    this.inputEndDate = val;
                    console.log(val);
                });

        }, 50);
    }

    getAllFacility() {

        this.loadingAllAsset = true;
        this.assetService.getAllFacility()
            .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
            this.loadingAllAsset = false;
            
            if (!isNullOrUndefined(res)) {
                this.assetList = res.data;

            }
        }, error => {
            this.loadingAllAsset = false;
        });
    }

    // رسته کاری
    getAllWorkingFieldList() {
        this.loadingWorkingFieldList = true;
        this.workingFieldService.getAll().subscribe((res) => {
            this.loadingWorkingFieldList = false;
            if (res) {
                this.workingFieldList = res;
            }
        }, error => {
            this.loadingWorkingFieldList = false;
        });
    }

    // نوع فعایت
    getAllTypeOfActivity() {
        this.loadingTypeOfActivityList = true;
        this.typeOfActivityService.getAll().subscribe((res) => {
            this.loadingTypeOfActivityList = false;
            if (res) {
                this.typeOfActivityList = res;
            }
        }, error => {
            this.loadingTypeOfActivityList = false;
        });

    }

    //  درجه اهمیت
    getAllDegreeOfImportanceList() {
        this.loadingDegreeOfImportanceList = true;
        this.degreeOfImportanceService.getAll().subscribe((res) => {
            this.loadingDegreeOfImportanceList = false;
            if (res) {
                this.degreeOfImportanceList = res;
            }
        }, error => {
            this.loadingDegreeOfImportanceList = false;
        });
    }

//// دستگاهها
    changeAssetIdList(event) {
        console.log(event);
        this.htmlForm.controls.minorPart.reset();
        this.htmlForm.controls.minorPart.disable();
        if (event) {
            this.getMajorPartList(event.id);
        } else {
            this.majorPartList = [];
            this.htmlForm.controls.majorPartList.reset();
            this.htmlForm.controls.majorPartList.disable();
            this.htmlForm.controls.minorPart.disable();
            this.htmlForm.controls.minorPart.reset();
        }

    }


    getMajorPartList(parentId) {
        this.loadingMajorPart = true;
        this.majorPartList = [];
        this.htmlForm.controls.majorPartList.reset();
        this.assetService.getAllAssetByParentId({parentId})
            .pipe(takeUntilDestroyed(this)).subscribe((res: AssetDto.CreateAsset[]) => {
            this.loadingMajorPart = false;
            
            if (!isNullOrUndefined(res)) {
                this.htmlForm.controls.majorPartList.enable();
                this.majorPartList = res;
                // this.majorPartList = this.majorPartList.filter(a => a.categoryType === CategoryType[CategoryType.FACILITY.toString()]);

            }
        }, error => {
            this.loadingMajorPart = false;
        });
    }

    changeMajorPartList(event: AssetDto.CreateAsset) {
        console.log(event);
        if (event) {
            this.htmlForm.controls.minorPart.enable();
        } else {
            this.htmlForm.controls.minorPart.disable();
            this.htmlForm.controls.minorPart.reset();

        }
    }

    onSubmit() {
        if (this.inputStartDate && this.inputEndDate) {
            if (this.inputStartDate > this.inputEndDate) {
                DefaultNotify.notifyDanger('بازه زمانی درست انتخاب شود .', '', NotiConfig.notifyConfig);
                return;
            }
        }
        this.getAllByFilterAndPagination = new WorkOrderSchedule.GetPageDto();
        this.htmlForm.controls.assetId.value ? this.getAllByFilterAndPagination.assetId = this.htmlForm.controls.assetId.value : null;
        this.htmlForm.controls.majorPartList.value ? this.getAllByFilterAndPagination.mainSubSystemId = this.htmlForm.controls.majorPartList.value : null;
        this.htmlForm.controls.minorPart.value ? this.getAllByFilterAndPagination.minorSubSystem = this.htmlForm.controls.minorPart.value : null;
        this.htmlForm.controls.typeOfActivity.value ? this.getAllByFilterAndPagination.activityTypeId = this.htmlForm.controls.typeOfActivity.value : null;
        this.htmlForm.controls.workingField.value ? this.getAllByFilterAndPagination.workCategoryId = this.htmlForm.controls.workingField.value : null;
        this.htmlForm.controls.degreeOfImportance.value ? this.getAllByFilterAndPagination.importanceDegreeId = this.htmlForm.controls.degreeOfImportance.value : null;
        this.htmlForm.controls.assetStatus.value ? this.getAllByFilterAndPagination.assetStatus = this.htmlForm.controls.assetStatus.value : null;

        if (this.inputStartDate) {
            this.getAllByFilterAndPagination.startDate = this.myMoment.convertJaliliToGregorian(this.inputStartDate);
            // this.getAllByFilterAndPagination.startDate = this.getAllByFilterAndPagination.startDate.replaceAll('/', '-') + 'T00:00:00.000Z';
            this.getAllByFilterAndPagination.startDate = this.getAllByFilterAndPagination.startDate.replaceAll('/', '-') + 'T00:00:00.000+03:30';
        }
        if (this.inputEndDate) {
            this.getAllByFilterAndPagination.endDate = this.myMoment.convertJaliliToGregorian(this.inputEndDate);
            // this.getAllByFilterAndPagination.startDate = this.getAllByFilterAndPagination.startDate.replaceAll('/', '-') + 'T00:00:00.000Z';
            this.getAllByFilterAndPagination.endDate = this.getAllByFilterAndPagination.endDate.replaceAll('/', '-') + 'T23:59:00.000+03:30';
        }

        this.pageIndex = 0;

        if (this.pageIndex == 0) {
            this.getPage();
        } else {
            this.pageIndex = 0;
            this.navigate();
        }
        console.log(this.getAllByFilterAndPagination);
    }

    getPage() {
        this.loading = true;
        const paging = new Paging();
        paging.page = this.pageIndex;
        paging.size = this.pageSize;
        this.entityService.getPage(this.getAllByFilterAndPagination, {
            paging, totalElements: -1
        }).subscribe((res) => {
            this.loading = false;
            if (res) {
                if (res.content) {
                    this.entityList = res.content;
                    this.length = res.totalElements;
                    if (this.pageIndex > 0 && this.entityList.length === 0) {
                        this.pageIndex--;
                        this.navigate();
                    }
                }
            }
        }, error => {
            this.loading = false;

        });

    }

    search() {
        if (this.pageIndex == 0) {
            this.getPage();
        } else {
            this.pageIndex = 0;
            this.navigate();
        }
    }

    navigate() {
        this.router.navigate([window.location.hash.split('#/')[1].split('?')[0]], {
            queryParams: {
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
            },
        });
    }

    changePage(event: any) {
        this.length = event.length;
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.navigate();
    }


    public sowModalSelectedSolution(entity: WorkOrderSchedule.GetPage) {
        this.selectedSolution = entity.solution;
        setTimeout(() => {
            ModalUtil.showModal('solutionModalId');
        }, 10);

    }

    routerToAction(entity: WorkOrderSchedule.GetPage) {
        if (this.loadingRouterToAction) {
            return;
        }
        this.loadingRouterToAction = true;
        this.selectedEntity = entity;
        // this.entityService.checkIfActivityLevelIsPending({
        //   activityInstanceId: entity.activityInstanceId,
        //   activityLevelId: entity.activityLevelId,
        // }).subscribe((res: boolean) => {
        //   this.loadingRouterToAction = false;
        //   if (res === true) {
        //     setTimeout((e) => {
        //       this.listMode = false;
        //     }, 100);
        //   } else {
        //     DefaultNotify.notifyDanger(' فرایند توسط شخص دیگری ثبت گردید .', '', NotiConfig.notifyConfig);
        //     this.selectedEntity = new WorkTableSchedule.GetPage();
        //     this.getPage();
        //   }
        // }, error => {
        //   this.loadingRouterToAction = false;
        //   this.selectedEntity = new WorkTableSchedule.GetPage();
        // });

    }

    backEmit() {
        console.log('backEmit');
        this.listMode = true;
        this.setDateJquery();
        this.selectedEntity = new WorkOrderSchedule.GetPage();
    }

    getAll(type: string) {
        this.entityService.getAll(this.getAllByFilterAndPagination).subscribe((res) => {
            this.loading = false;
            this.entityListForReport = res;
            setTimeout(() => {
            if (type === 'excel') {
                this.fireEventExcel();
            } else if (type === 'pdf') {
                this.openPDF();
            }
            }, 10);
        }, error => {

        });
    }

    fireEventExcel() {
        const prefix = name || 'فرایند در انتظار تایید - PM ';
        const targetTableElm = document.getElementById('htmlData');
        const wb = XLSX.utils.table_to_book(targetTableElm, {sheet: prefix} as XLSX.Table2SheetOpts);
        const name2 = NumberTools.En2Fa(Moment.convertIsoToJDateWithTime(new Date().toISOString())
            + ' -   ' + '.xlsx');

        XLSX.writeFile(wb, name2);
    }

    openPDF() {

        this.loadingOpenPdf = true;
        $('#myTable1').removeClass('myTable1');
        const imgData = document.getElementById('htmlData');
        setTimeout(() => {
            $('#myTable1').addClass('myTable1');

        }, 0.000000001);
        html2canvas(imgData).then((canvas) => {

            const imgWidth = 210;
            const pageHeight = 290;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;


            const doc = new jsPDF('p', 'mm');
            let position = 0;
            const pageData = canvas.toDataURL('image/jpeg', 1.0);
            const imgData = encodeURIComponent(pageData);
            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            doc.setLineWidth(1);
            doc.setDrawColor(255, 255, 255);
            doc.rect(0, 0, 295, 295);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                doc.addPage();
                doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                doc.setLineWidth(1);
                doc.setDrawColor(255, 255, 255);
                doc.rect(0, 0, 295, 295);
                heightLeft -= pageHeight;
            }
            const name = NumberTools.En2Fa(Moment.convertIsoToJDateWithTime(new Date().toISOString())
                + ' - فرایند در انتظار تایید - PM  ' + '.pdf');
            doc.save(name);
            this.loadingOpenPdf = false;


        });


    }

    chooseSelectedItemForEdit(item: WorkOrderSchedule.GetPage) {
        if (this.loadingForCheckUpdate) {
            return;
        }
        this.selectedWorkOrderIdForCheck = item.id;
        this.selectedItemIdForAction = item.id;
        this.modeForAction = ActionMode.EDIT;
        this.showActionComponent();
        // this.loadingForCheckUpdate = true;
        // this.entityService.getOne({id: item.id}).subscribe();
        // this.entityService.checkIfWorkOrderIsInProcess({workOrderId: item.id}).subscribe((res: boolean) => {
        //     this.loadingForCheckUpdate = false;
        //     if (res === true) {
        //         DefaultNotify.notifyDanger(' دستور کار فوق در روند تعمیرات قرار دارد و امکان ویرایش آن نمی باشد. ', '', NotiConfig.notifyConfig);
        //     } else {
        //         this.selectedItemIdForAction = item.id;
        //         this.modeForAction = ActionMode.EDIT;
        //         this.showActionComponent();
        //         // this.router.navigate(['action'], {
        //         //     queryParams: {mode: ActionMode.EDIT, entityId: item.id},
        //         //     relativeTo: this.activatedRoute
        //         // });
        //     }
        // }, error => {
        //     this.loadingForCheckUpdate = false;
        // });

    }

    chooseSelectedItemForView(item: WorkOrderSchedule.GetPage) {
        this.selectedWorkOrderIdForCheck = item.id;
        this.selectedItemIdForAction = item.id;
        this.modeForAction = ActionMode.VIEW;
        this.showActionComponent();

        // this.selectedItemIdForAction = item.id;
        // this.modeForAction = ActionMode.VIEW;
        // this.showActionComponent();
        // this.router.navigate(['action'], {
        //     queryParams: {mode: ActionMode.VIEW, entityId: item.id},
        //     relativeTo: this.activatedRoute
        // });
    }

    showActionComponent() {
        setTimeout(e => {
            this.listMode = false;
        }, 1);
    }

    public ngAfterViewInit(): void {
        this.setDateJquery();
    }

    public ngOnDestroy(): void {
    }

}
