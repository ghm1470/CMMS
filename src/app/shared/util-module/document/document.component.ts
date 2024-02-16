import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FileModel} from '../../model/fileModel';
import {UploadService} from '../../service/upload.service';
import {DownloadService} from '../../service/download.service';
import {takeUntilDestroyed} from '@angular-boot/core';
import {ActionMode, DefaultNotify, isNullOrUndefined, ModalSize} from '@angular-boot/util';
import * as FileSaver from 'file-saver';
import {CompanyDto} from '../../../main-modules/company/model/dto/companyDto';
import DocumentFile = CompanyDto.DocumentFile;
import {DocumentService} from './endPoint/document.service';
import {ModalUtil} from '@angular-boot/widgets';
import {DataService} from '../../service/data.service';
import {WorkTableDto} from '../../../main-modules/worktable/model/workTable';
import {WorkOrderRepositoryService} from '../../../main-modules/workOrder/endpoint/work-order-repository.service';
import {DeleteModel} from '../../conferm-delete/model/delete-model';
import {NgForm} from '@angular/forms';
import {NotiConfig} from "../../tools/notifyConfig";

declare var $: any;

@Component({
    selector: 'app-document',
    templateUrl: './document.component.html',
    styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit, OnDestroy {
    @Input() mode: ActionMode;
    @Input() formStatus: string;
    actionMode = ActionMode;
    @Input() extraId: string;
    @Output() documents = new EventEmitter<any>();
    @Output() formData = new EventEmitter<any>();
    @Output() finishedUpload = new EventEmitter<boolean>();
    @Output() nextCarousel = new EventEmitter<boolean>();
    documentList: DocumentFile[] = [];
    files: Array<File> = [];
    fileModel: Array<FileModel> = [];
    modalId = ModalUtil.generateModalId();
    MyModalSize = ModalSize;
    showName: string;
    workOrderAndFormRepository: WorkTableDto.ActivitySampleWorkOrderAndFormRepository;
    loading = false;
    uploadLoading = false;
    selectedItemForDelete = new DeleteModel();
    @ViewChild('showNameForm', {static: false}) showNameForm: NgForm;

    ext: string[] = ['zip', 'rar', 'tar', 'zip'
        , 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'odt', 'fodt', 'ZIP', 'RAR', 'TAR', '7ZIP'
        , 'jpg', 'jpeg', 'webp', 'psd', 'tiff', 'JPG', 'JPEG', 'webp', 'PSD', 'TIFF'
        , 'DOC', 'DOCX', 'XLS', 'XLSX', 'PPT', 'PPTX', 'PDF', 'ODT', 'FODT'];


    constructor(protected uploadService: UploadService,
                protected documentService: DocumentService,
                protected workOrderRepositoryService: WorkOrderRepositoryService,
                protected downloadService: DownloadService) {
    }

    ngOnInit() {
        setTimeout(() => {
            if (this.extraId) {
                this.loading = true;

                this.documentService.getAll({extraId: this.extraId}).pipe(takeUntilDestroyed(this))
                    .subscribe((res: DocumentFile[]) => {
                        this.loading = false;

                        if (res && res.length) {
                            this.documentList = res;
                        }
                    });
            }
        }, 100);
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
                DefaultNotify.notifyDanger('نوع فایل انتخابیضضضضضضضضضضضضضضضضض مورد قبول نمی باشد', '', NotiConfig.notifyConfig);
                return;
            }
        }
        if (input.files.length > 0) {
            this.files = [];
            for (const i of input.files) {
                if (i.size < 10000000) {
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
                    DefaultNotify.notifyWarning('حجم فایل ' + i.name + 'نباید بیشتر از ۱۰ مگابایت باشد.', '', NotiConfig.notifyConfig);
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


        this.uploadService.uploadForSchedule(formData, this.extraId, this.showName).pipe(takeUntilDestroyed(this))
            .subscribe((data: any) => {
                this.uploadLoading = false;
                if (data) {
                    DefaultNotify.notifySuccess('با موفقیت آپلود شد.', '', NotiConfig.notifyConfig);
                    this.documentList.push(data);


                    this.documents.emit(this.documentList);
                    this.formData.emit(formData);
                    this.finishedUpload.emit(true);

                    // =================================================================
                    if (!isNullOrUndefined(this.workOrderAndFormRepository)) {
                        this.workOrderAndFormRepository.documentList = this.documentList;
                        DataService.setWAFRepository(this.workOrderAndFormRepository);
                        if (!isNullOrUndefined(this.workOrderAndFormRepository.id)) {
                            this.workOrderRepositoryService.update(this.workOrderAndFormRepository).pipe(takeUntilDestroyed(this)).subscribe(resTree => {
                                if (resTree) {
                                    DataService.setWAFRepository(this.workOrderAndFormRepository);
                                }
                            });
                        } else if (isNullOrUndefined(this.workOrderAndFormRepository.id)) {
                            this.workOrderRepositoryService.create(this.workOrderAndFormRepository).pipe(takeUntilDestroyed(this)).subscribe(resTow => {
                                if (resTow) {
                                    this.workOrderAndFormRepository.id = resTow;
                                    DataService.setWAFRepository(this.workOrderAndFormRepository);
                                }
                            });
                        }
                    }
                    // =================================================================
                } else {
                    DefaultNotify.notifyDanger('آپلود انجام نشد,دوباره تلاش کنید.', '', NotiConfig.notifyConfig);
                }
            });
    }

    deleteItem(event) {
        if (event) {
            this.selectedItemForDelete.loading = true;
            this.documentService.deleteSchedule({
                documentId: this.selectedItemForDelete.id,
                scheduleMaintenanceId: this.extraId
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


    showModalDelete(item, i) {
        this.selectedItemForDelete.loading = false;

        this.selectedItemForDelete.id = item.id;
        this.selectedItemForDelete.title = ' آیا    ' + item.showName + ' حذف  شود؟ ';
        this.selectedItemForDelete.index = i;
        setTimeout(e => {
            ModalUtil.showModal('modalId' + this.selectedItemForDelete.id);
        }, 10);
    }

// =======================

    downloadFile(item: DocumentFile) {
        this.downloadService.downloadFile({documentId: item.id}).pipe(takeUntilDestroyed(this))
            .subscribe((res: any) => {
                if (!isNullOrUndefined(res)) {
                    FileSaver.saveAs(res, item.fileName);
                }
            });
    }

    ngOnDestroy()
        :
        void {
    }

    showModalAddFile() {
        this.showName = '';
        this.showNameForm.reset();

        ModalUtil.showModal(this.modalId);
    }

    nextOrPrev() {
        this.nextCarousel.emit(false);
    }


    trimName() {
        this.showName = this.showName.trim();
    }

    fileType(fileName: string) {

        return fileName.split('.').pop();
    }
}
