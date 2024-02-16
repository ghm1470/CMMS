import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {ActionMode, DefaultNotify, isNullOrUndefined, ModalSize} from '@angular-boot/util';
import {FileModel} from '../../../model/fileModel';
import {ModalUtil} from '@angular-boot/widgets';
import {UploadService} from '../../../service/upload.service';
import {DocumentService} from '../endPoint/document.service';
import {WorkOrderRepositoryService} from '../../../../main-modules/workOrder/endpoint/work-order-repository.service';
import {DownloadService} from '../../../service/download.service';
import {takeUntilDestroyed} from '@angular-boot/core';
import {DataService} from '../../../service/data.service';
import * as FileSaver from 'file-saver';
import {CompanyDto} from '../../../../main-modules/company/model/dto/companyDto';
import DocumentFile = CompanyDto.DocumentFile;
import {SendInformationNumberOfTabs} from '../../../../main-modules/worktable/feature/show-the-trend-here/show-the-form-of-previous-steps/show-the-form-of-previous-steps.component';
import * as moment from 'jalali-moment';
import _date = moment.unitOfTime._date;
import {DeleteModel} from '../../../conferm-delete/model/delete-model';
import {NotiConfig} from "../../../tools/notifyConfig";

declare var $: any;

@Component({
    selector: 'app-document-work-table',
    templateUrl: './document-work-table.component.html',
    styleUrls: ['./document-work-table.component.scss']
})
export class DocumentWorkTableComponent implements OnInit, OnDestroy, OnChanges {
    actionMode = ActionMode;
    @Input() staticFormsIdList: string [] = [];
    @Input() extraId: string;
    @Output() documents = new EventEmitter<any>();
    @Output() nextCarousel = new EventEmitter<boolean>();
    @Input() activityInstanceId: string;
    @Input() activityLevelId: string;
    @Input() isView: boolean;
    @Input() workOrderId: string;
    @Output() formData = new EventEmitter<any>();
    @Output() finishedUpload = new EventEmitter<boolean>();
    @Input() sendInformationNumberOfTabs = new SendInformationNumberOfTabs();
    @Input() numberOfParticipation: number;
    existedAlreadySaveForWAR = false;
    documentList: DocumentFile[] = [];
    files: Array<File> = [];
    fileModel: Array<FileModel> = [];
    modalId = ModalUtil.generateModalId();
    MyModalSize = ModalSize;
    showName: string;
    selectedItemForDelete = new DeleteModel();
    // workOrderAndFormRepository: WorkTableDto.ActivitySampleWorkOrderAndFormRepository;
    loading = false;
    uploadLoading = false;
    ext: string[] = ['zip', 'rar', 'tar', 'zip'
        , 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'odt', 'fodt', 'ZIP', 'RAR', 'TAR', '7ZIP'
        , 'DOC', 'DOCX', 'XLS', 'XLSX', 'PPT', 'PPTX', 'PDF', 'ODT', 'FODT'];

    constructor(protected uploadService: UploadService,
                protected workOrderRepositoryService: WorkOrderRepositoryService,
                protected downloadService: DownloadService,
                protected documentService: DocumentService) {
    }

    enableItems = false;

    ngOnInit() {
        if (this.staticFormsIdList) {
        if (this.staticFormsIdList.some(id => id === 'file')) {
            this.enableItems = true;
        }
        }
        DataService.getExistedAlreadySaveForWAR.subscribe((res: boolean) => {
            if (res) {
                this.existedAlreadySaveForWAR = res;
            }
        });
        this.getDocument();
    }

    getDocument() {
        setTimeout(() => {
            if (this.extraId) {
                this.loading = true;
                this.documentService.getAllDocumentsOfWorkOrderByExtraId({extraId: this.extraId}).pipe(takeUntilDestroyed(this))
                    .subscribe((res: DocumentFile[]) => {
                        this.loading = false;
                        if (res && res.length) {
                            this.documentList = res;

                        }
                    }, error => {
                        this.loading = false;

                    });
            }
        }, 100);
    }

    trimName() {
        this.showName = this.showName.trim();
    }

    fileType(fileName: string) {
        return fileName.split('.').pop();
    }

    forScheduleForDelete: boolean;

    showModalDelete(item: DocumentFile, i) {
        this.selectedItemForDelete.loading = false;

        this.selectedItemForDelete.id = item.id;
        this.selectedItemForDelete.title = ' آیا    ' + item.showName + ' حذف  شود؟ ';
        this.selectedItemForDelete.index = i;
        this.forScheduleForDelete = item.forSchedule;
        setTimeout(e => {
            ModalUtil.showModal('modalId' + this.selectedItemForDelete.id);
        }, 10);
    }

    stringLength(value, id) {
        if (!isNullOrUndefined(value)) {
            value = value.trim();
            if (value.length === 0) {
                $('#' + id).addClass('is-invalid').removeClass('is-valid');
                $('#form').addClass('ng-invalid').removeClass('ng-valid');
                // this.disabledButton = true;
                return false;
            } else {
                $('#' + id).addClass('is-valid').removeClass('is-invalid');
                $('#form').addClass('ng-valid').removeClass('ng-invalid');
                // this.disabledButton = false;

                return true;

            }
        } else if (isNullOrUndefined(value)) {
            $('#' + id).addClass('is-invalid').removeClass('is-valid');
            $('#form').addClass('ng-invalid').removeClass('ng-valid');
            // this.disabledButton = false;

            // return false;
            return true;
        }
    }


    onChangeUploader(input) {
        if (input.files.length > 0) {
            this.files = [];
            const fe = input.files[0].name.split('.').pop();
            if (this.ext.includes(fe) === false) {
                DefaultNotify.notifyDanger('نوع فایل انتخابی مورد قبول نمی باشد', '', NotiConfig.notifyConfig);
                return;
            }
        }
        if (input.files.length > 0) {
            this.files = [];
            for (const i of input.files) {
                if (i.size < 100000000) {
                    const file: FileModel = new FileModel();
                    const f = i.type.split('/');
                    file.extraId = this.extraId;
                    file.name = i.name;
                    file.type = f[0];
                    file.lastModified = i.lastModified;
                    this.fileModel.push(file);
                    this.onUploadFile(i);
                    ModalUtil.hideModal(this.modalId);
                } else {
                    DefaultNotify.notifyWarning('حجم فایل ' + i.name + 'نباید بیشتر از ۱۰۰ مگابایت باشد.', '', NotiConfig.notifyConfig);
                }
            }
            if (this.files.length > 0) {
            }
        }
    }

    onUploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);
        this.uploadLoading = true;
        this.finishedUpload.emit(false);
        if (isNullOrUndefined(this.extraId)) {
            this.extraId = null;
        }

        // =================ثبت کردن در ریپاسیتوری
        if ((!this.existedAlreadySaveForWAR)) {
            this.workOrderRepositoryService.uploadDocumentFileInFirstTime(formData, this.workOrderId, this.showName, this.activityInstanceId, this.activityLevelId, this.numberOfParticipation)
                .pipe(takeUntilDestroyed(this)).subscribe((resOne: any) => {
                this.uploadLoading = false;
                if (resOne) {
                    DefaultNotify.notifySuccess('با موفقیت آپلود شد.', '', NotiConfig.notifyConfig);
                    this.documentList.push(resOne);
                    this.documents.emit(this.documentList);
                    this.formData.emit(formData);
                    this.finishedUpload.emit(true);
                    DataService.setExistedAlreadySaveForWAR(true);
                    // this.workOrderAndFormRepository.id = resOne;
                } else {
                    DefaultNotify.notifyDanger('آپلود انجام نشد,دوباره تلاش کنید.', '', NotiConfig.notifyConfig);
                }
            });
        } else if (this.existedAlreadySaveForWAR) {
            this.workOrderRepositoryService.uploadDocumentFileAfterFirstTime(formData, this.workOrderId, this.showName, this.activityInstanceId, this.activityLevelId, this.numberOfParticipation).pipe(takeUntilDestroyed(this)).subscribe((resTow: any) => {
                this.uploadLoading = false;
                if (resTow) {
                    DefaultNotify.notifySuccess('با موفقیت ذخیره شد.', '', NotiConfig.notifyConfig);
                    this.documentList.push(resTow);
                    this.documents.emit(this.documentList);
                    this.formData.emit(formData);
                    this.finishedUpload.emit(true);
                    DataService.setExistedAlreadySaveForWAR(true);
                    // this.workOrderAndFormRepository.id = resOne;
                } else {
                    DefaultNotify.notifyDanger('آپلود انجام نشد,دوباره تلاش کنید.', '', NotiConfig.notifyConfig);
                }
            });
        }
    }


    deleteItem(event) {
        if (event) {
            this.selectedItemForDelete.loading = true;
            this.workOrderRepositoryService.deleteDocumentFileId({
                documentFileId: this.selectedItemForDelete.id,
                activityInstanceId: this.activityInstanceId,
                activityLevelId: this.activityLevelId,
                workOrderId: this.workOrderId,
                numberOfParticipation: this.numberOfParticipation,
                forSchedule: this.forScheduleForDelete
            })
                .pipe(takeUntilDestroyed(this)).subscribe((res: any) => {
                if (res.message) {
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
                    DefaultNotify.notifyDanger(res.message, '', NotiConfig.notifyConfig);
                } else if (!res.message) {
                    ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);

                    this.documentList = this.documentList.filter(doc => doc.id !== this.selectedItemForDelete.id);
                    this.documents.emit(this.documentList);
                    DefaultNotify.notifySuccess('با موفقیت حذف شد.', '', NotiConfig.notifyConfig);

                } else {
                    DefaultNotify.notifyDanger(res.message, '', NotiConfig.notifyConfig);
                }
            }, error => {
            });

        } else {
            ModalUtil.hideModal('modalId' + this.selectedItemForDelete.id);
        }
    }

    downloadFile(item: DocumentFile) {
        this.downloadService.downloadFile({documentId: item.id}).pipe(takeUntilDestroyed(this))
            .subscribe((res: any) => {
                if (!isNullOrUndefined(res)) {
                    FileSaver.saveAs(res, item.fileName);
                }
            });
    }

    ngOnDestroy(): void {
    }

    showModalAddFile() {
        this.showName = '';
        ModalUtil.showModal(this.modalId);
    }

    nextOrPrev(item) {
        if (item === 'next') {
            this.nextCarousel.emit(true);
        }
        if (item === 'prev') {
            this.nextCarousel.emit(false);
        }
    }

//  ||
//  ||
//  ||
//  ||
//  \/
    ngOnChanges(changes: SimpleChanges): void {
        // if (!isNullOrUndefined(changes.fileDTO)) {
        //   this.documentList = this.fileDTO;
        // }
    }

}
