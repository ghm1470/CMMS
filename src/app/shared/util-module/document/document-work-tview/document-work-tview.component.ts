import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {ActionMode, DefaultNotify, isNullOrUndefined, ModalSize} from '@angular-boot/util';
import {FileModel} from '../../../model/fileModel';
import {ModalUtil} from '@angular-boot/widgets';
import {WorkTableDto} from '../../../../main-modules/worktable/model/workTable';
import {UploadService} from '../../../service/upload.service';
import {DocumentService} from '../endPoint/document.service';
import {WorkOrderRepositoryService} from '../../../../main-modules/workOrder/endpoint/work-order-repository.service';
import {DownloadService} from '../../../service/download.service';
import {DataService} from '../../../service/data.service';
import {takeUntilDestroyed} from '@angular-boot/core';
import * as FileSaver from 'file-saver';
import DocumentFile = CompanyDto.DocumentFile;
import {CompanyDto} from '../../../../main-modules/company/model/dto/companyDto';
import {SendInformationNumberOfTabs} from '../../../../main-modules/worktable/feature/show-the-trend-here/show-the-form-of-previous-steps/show-the-form-of-previous-steps.component';

declare var $: any;
@Component({
  selector: 'app-document-work-tview',
  templateUrl: './document-work-tview.component.html',
  styleUrls: ['./document-work-tview.component.scss']
})
export class DocumentWorkTViewComponent implements OnInit, OnDestroy, OnChanges {
  actionMode = ActionMode;
  @Input() documentList: DocumentFile[] = [];
  @Output() nextCarousel = new EventEmitter<boolean>();
  @Input() sendInformationNumberOfTabs = new SendInformationNumberOfTabs();
  files: Array<File> = [];
  fileModel: Array<FileModel> = [];
  modalId = ModalUtil.generateModalId();
  MyModalSize = ModalSize;
  showName: string;
  workOrderAndFormRepository: WorkTableDto.ActivitySampleWorkOrderAndFormRepository;
  loading = false;

  constructor(protected uploadService: UploadService,
              protected workOrderRepositoryService: WorkOrderRepositoryService,
              protected downloadService: DownloadService) {
  }

  ngOnInit() {

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

  nextOrPrev(item) {
    if (item === 'next') {
      this.nextCarousel.emit(true);
    }
    if (item === 'prev') {
      this.nextCarousel.emit(false);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.documentList) {
      if (isNullOrUndefined(this.documentList)) {
        this.documentList = [];
      }
    }
  }
}
