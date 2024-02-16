import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AssetDto} from '../../asset/model/dto/assetDto';
import {takeUntilDestroyed} from '@angular-boot/core';
import {AssetService} from '../../asset/endpoint/asset.service';
import {CategoryDto} from '../../category/model/dto/categoryDto';
import CategoryType = CategoryDto.CategoryType;
import {ActionMode, DefaultNotify, isNullOrUndefined, ModalSize, Paging, Toolkit2} from '@angular-boot/util';
import {FormControl, FormGroup} from '@angular/forms';
import {workingField} from '../../basicInformation/working-field/model/working-field-dto';
import {TypeOfActivityService} from '../../basicInformation/type-of-activity/endpoint/type-of-activity.service';
import {DegreeOfImportanceService} from '../../basicInformation/degree-of-importance/endpoint/degree-of-importance.service';
import {WorkingFieldService} from '../../basicInformation/working-field/endpoint/working-field.service';
import {typeOfActivityDto} from '../../basicInformation/type-of-activity/model/type-of-activity-dto';
import {DegreeOfImportanceDto} from '../../basicInformation/degree-of-importance/model/degree-of-importance-dto';
import {ActivatedRoute, Router} from '@angular/router';
import {Moment} from '../../../shared/shared/tools/date/moment';
import {Tools} from '../../../shared/tools/Tools';
import {ScheduleService} from '../endpoint/schedule.service';
import {ScheduleDto} from '../model/scheduleDto';
import {DeleteModel} from '../../../shared/conferm-delete/model/delete-model';
import {ModalUtil} from '@angular-boot/widgets';
import {ScheduleExcelService} from '../endpoint/schedule-excel.service';
import * as FileSaver from 'file-saver';
import {NumberTools} from '../../../shared/tools/numberTools';
import {SchedulePdfService} from '../endpoint/schedule-pdf.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import {WorkTableScheduleService} from "../../work-table-schedule/endpoint/work-table-schedule.service";
import {NotiConfig} from "../../../shared/tools/notifyConfig";

declare var $: any;

@Component({
    selector: 'app-scheduling-list',
    templateUrl: './scheduling-list.component.html',
    styleUrls: ['./scheduling-list.component.scss']
})
export class SchedulingListComponent implements OnInit, OnDestroy, AfterViewInit {

    constructor(private entityService: ScheduleService,
                protected assetService: AssetService,
                protected workTableScheduleService: WorkTableScheduleService,
                public router: Router,
                private typeOfActivityService: TypeOfActivityService, // نوع فعایت
                private degreeOfImportanceService: DegreeOfImportanceService, //  درجه اهمیت
                private workingFieldService: WorkingFieldService, // رسته کاری
                private activatedRoute: ActivatedRoute,
                private scheduleExcelService: ScheduleExcelService,
                private schedulePdfService: SchedulePdfService,
    ) {
        this.activatedRoute.queryParams.subscribe(params => {
            params.pageIndex ? this.pageIndex = params.pageIndex : '';
            params.pageSize ? this.pageSize = params.pageSize : '';
            this.getPage();
        });

    }

    htmlForm: FormGroup;

    listMode = true;
    assetList: AssetDto.CreateAsset[] = [];
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

    ///////////////
    loading = false;
    entityList: ScheduleDto.GetPage[] = [];
    entityListForReport: ScheduleDto.GetPage[] = [];
    pageSize = 10;
    pageIndex = 0;
    length = -1;
    myMoment = Moment;
    tools = Tools;
    AssetStatus = ScheduleDto.AssetStatus;
    Frequency = ScheduleDto.Frequency;
    RunStatus = ScheduleDto.RunStatus;
    getPageSearchDto = new ScheduleDto.GetPageSearchDto();
    actionMode: ActionMode = ActionMode.ADD;
    ActionMode = ActionMode;
    selectedEntityId: string;
    MyModalSize = ModalSize;
    selectedSolution: string;

    selectedItemForDelete = new DeleteModel();

    loadingOpenPdf = false;
    @ViewChild('htmlData', {static: false}) htmlData: ElementRef;
    @ViewChild('table', {static: false}) table: ElementRef;

    ngOnInit(): void {
        this.creatForm();
        this.getAllFacility();
        this.getAllTypeOfActivity();
        this.getAllDegreeOfImportanceList();
        this.getAllWorkingFieldList();
    }

    creatForm() {
        //     motorcyclePlaque: new FormControl({ value: null, disabled: true }),
        this.htmlForm = new FormGroup({
            assetId: new FormControl(), // نام دستگاه
            majorPartList: new FormControl({value: null, disabled: true}), // قطعه اصلی
            minorPart: new FormControl({value: null, disabled: true}), // قطعه جزئی
            typeOfActivity: new FormControl(),  // نوع فعایت
            workingField: new FormControl(), // رسته کاری
            degreeOfImportance: new FormControl(),  //  درجه اهمیت
            assetStatus: new FormControl(),  // وضعیت تجهیز
            runStatus: new FormControl(),  //   وضعیت اجرا
        });
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
    changeAssetIdList(event: AssetDto.CreateAsset) {
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
        if (event) {
            this.htmlForm.controls.minorPart.enable();
        } else {
            this.htmlForm.controls.minorPart.disable();
            this.htmlForm.controls.minorPart.reset();

        }
    }

    onSubmit() {

        this.getPageSearchDto = new ScheduleDto.GetPageSearchDto();
        this.htmlForm.controls.assetId.value ? this.getPageSearchDto.assetId = this.htmlForm.controls.assetId.value : null;
        this.htmlForm.controls.majorPartList.value ? this.getPageSearchDto.mainSubSystemId = this.htmlForm.controls.majorPartList.value : null;
        this.htmlForm.controls.minorPart.value ? this.getPageSearchDto.minorSubSystem = this.htmlForm.controls.minorPart.value : null;
        this.htmlForm.controls.typeOfActivity.value ? this.getPageSearchDto.activityTypeId = this.htmlForm.controls.typeOfActivity.value : null;
        this.htmlForm.controls.workingField.value ? this.getPageSearchDto.workCategoryId = this.htmlForm.controls.workingField.value : null;
        this.htmlForm.controls.degreeOfImportance.value ? this.getPageSearchDto.importanceDegreeId = this.htmlForm.controls.degreeOfImportance.value : null;
        this.htmlForm.controls.runStatus.value ? this.getPageSearchDto.runStatus = this.htmlForm.controls.runStatus.value : null;
        this.htmlForm.controls.assetStatus.value ? this.getPageSearchDto.assetStatus = this.htmlForm.controls.assetStatus.value : null;
        this.pageIndex = 0;

        if (this.pageIndex == 0) {
            this.getPage();
        } else {
            this.pageIndex = 0;
            this.navigate();
        }
    }

    changePage(event: any) {
        this.length = event.length;
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.navigate();
    }

    navigate() {
        this.router.navigate([window.location.hash.split('#/')[1].split('?')[0]], {
            queryParams: {
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
            },
        });
    }

    getPage() {
        this.loading = true;
        const paging = new Paging();
        paging.page = this.pageIndex;
        paging.size = this.pageSize;
        this.length = -1;
        this.entityList = [];
        this.entityService.getPage(this.getPageSearchDto, {
            term: '',
            paging,
            totalElements: -1,
        }).subscribe((res: any) => {
            if (res) {
                this.entityList = res.content;
                this.length = res.totalElements;
                this.loading = false;
            }
        }, error => {
            this.loading = false;
        });
        this.entityService.getAllForReport(this.getPageSearchDto).subscribe((res: any) => {
            if (res) {
                this.entityListForReport = res;
            }
        }, error => {
        });
    }


    backEmit() {
        this.listMode = true;
        // this.setJqueryDate();

        if (
            this.getPageSearchDto.assetId ||
            !isNullOrUndefined(this.getPageSearchDto.mainSubSystemId) ||
            !isNullOrUndefined(this.getPageSearchDto.minorSubSystem) ||
            !isNullOrUndefined(this.getPageSearchDto.activityTypeId) ||
            !isNullOrUndefined(this.getPageSearchDto.workCategoryId) ||
            !isNullOrUndefined(this.getPageSearchDto.importanceDegreeId) ||
            !isNullOrUndefined(this.getPageSearchDto.assetStatus) ||
            !isNullOrUndefined(this.getPageSearchDto.runStatus)
        ) {
            setTimeout((e) => {
                // $('#assets-search-btn').click();
                $('#workTable-search').addClass('show');

            }, 5);
        }
    }

    deleteItem(event) {
        if (event) {
            this.selectedItemForDelete.loading = true;
            this.entityService.delete({id: this.selectedItemForDelete.id})
                .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
                if (res === true) {
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
                    this.entityList.splice(this.selectedItemForDelete.index, 1);
                    if (this.entityList.length === 0) {
                        this.pageIndex = this.pageIndex - 1;
                        if (this.pageIndex < 0) {
                            this.pageIndex = 0;
                            this.getPage();
                        }
                        this.navigate();
                    }
                    this.selectedItemForDelete = new DeleteModel();
                } else if (res !== true) {
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
                    DefaultNotify.notifyDanger(' حذف این زمانبندی امکان پذیر نیست. ', '', NotiConfig.notifyConfig);

                }
            });

        } else {
            ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
            this.selectedItemForDelete = new DeleteModel();
        }
    }

    checkIfScheduleIsInActivityProcess(item: ScheduleDto.GetPage, type, i?) {
        this.workTableScheduleService.checkIfScheduleIsInActivityProcess({scheduleId: item.id}).subscribe((res: boolean) => {
            if (res) {
                if (type === 'delete') {
                    DefaultNotify.notifyDanger(' زمانبندی انتخاب شده در کارتابل قرار دارد و امکان حذف آن وجود ندارد. ', '', NotiConfig.notifyConfig);
                } else if (type === 'edit') {
                    DefaultNotify.notifyDanger(' زمانبندی انتخاب شده در کارتابل قرار دارد و امکان ویرایش آن وجود ندارد. ', '', NotiConfig.notifyConfig);

                }
            } else {
                if (type === 'delete') {
                    this.showModalDelete(item, i);
                } else if (type === 'edit') {
                    this.listMode = false;
                    this.actionMode = ActionMode.EDIT;
                    this.selectedEntityId = item.id;

                }
            }
        });
    }

    showModalDelete(item: ScheduleDto.GetPage, i) {
        this.selectedItemForDelete.loading = false;
        this.selectedItemForDelete.id = item.id;
        this.selectedItemForDelete.title = ' آیا   زمانبندی انتخاب شده حذف شود  ' + ' حذف  شود؟ ';
        this.selectedItemForDelete.index = i;
        setTimeout(e => {
            ModalUtil.showModal('modalId' + this.selectedItemForDelete.id);
        }, 10);
    }


    ngOnDestroy(): void {
    }

    public sowModalSelectedSolution(entity: ScheduleDto.GetPage) {
        this.selectedItemForDelete.id = entity.id;
        this.selectedSolution = entity.solution;
        setTimeout(() => {
            ModalUtil.showModal('solutionModalId');
        }, 10);

    }

    downloadFile(type) {
        const getPageSearchDto = new ScheduleDto.GetPageSearchDto();
        this.htmlForm.controls.assetId.value ? getPageSearchDto.assetId = this.htmlForm.controls.assetId.value : null;
        this.htmlForm.controls.majorPartList.value ? getPageSearchDto.mainSubSystemId = this.htmlForm.controls.majorPartList.value : null;
        this.htmlForm.controls.minorPart.value ? getPageSearchDto.minorSubSystem = this.htmlForm.controls.minorPart.value : null;
        this.htmlForm.controls.typeOfActivity.value ? getPageSearchDto.activityTypeId = this.htmlForm.controls.typeOfActivity.value : null;
        this.htmlForm.controls.workingField.value ? getPageSearchDto.workCategoryId = this.htmlForm.controls.workingField.value : null;
        this.htmlForm.controls.degreeOfImportance.value ? getPageSearchDto.importanceDegreeId = this.htmlForm.controls.degreeOfImportance.value : null;
        this.htmlForm.controls.runStatus.value ? getPageSearchDto.runStatus = this.htmlForm.controls.runStatus.value : null;
        this.htmlForm.controls.assetStatus.value ? getPageSearchDto.assetStatus = this.htmlForm.controls.assetStatus.value : null;
        if (type === 'excel') {
            this.scheduleExcelService.Excel(getPageSearchDto).pipe(takeUntilDestroyed(this))
                .subscribe((res: any) => {
                    if (!isNullOrUndefined(res)) {
                        const time = NumberTools.En2Fa(Moment.convertIsoToJDateWithTime(new Date().toISOString()));
                        FileSaver.saveAs(res, 'زمانبندی ' + time + '.xlsx');
                    }
                });
        } else if (type === 'pdf') {
            this.schedulePdfService.Pdf(getPageSearchDto).pipe(takeUntilDestroyed(this))
                .subscribe((res: any) => {
                    if (!isNullOrUndefined(res)) {
                        const time = NumberTools.En2Fa(Moment.convertIsoToJDateWithTime(new Date().toISOString()));
                        FileSaver.saveAs(res, 'زمانبندی ' + time + '.pdf');
                    }
                });
        }
    }


    fireEvent() {
        const prefix = name || 'جدول زمانبندی  ';
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
                + ' - جدول زمانبندی  ' + '.pdf');
            doc.save(name);
            this.loadingOpenPdf = false;


        });


    }

    public ngAfterViewInit(): void {
        // $(function () {
        //     $('.wrapper1').on('scroll', function (e) {
        //         $('.wrapper2').scrollLeft($('.wrapper1').scrollLeft());
        //     });
        //     $('.wrapper2').on('scroll', function (e) {
        //         $('.wrapper1').scrollLeft($('.wrapper2').scrollLeft());
        //     });
        // });
    }

}
