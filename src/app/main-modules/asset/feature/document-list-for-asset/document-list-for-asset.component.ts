import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FileModel} from '../../../../shared/model/fileModel';
import {DefaultNotify, isNullOrUndefined, Toolkit2} from '@angular-boot/util';
import {takeUntilDestroyed} from '@angular-boot/core';
import * as FileSaver from 'file-saver';
import {UploadService} from '../../../../shared/service/upload.service';
import {AssetService} from '../../endpoint/asset.service';
import {CompanyDto} from '../../../company/model/dto/companyDto';
import DocumentFile = CompanyDto.DocumentFile;
import {DownloadService} from '../../../../shared/service/download.service';
import {NotiConfig} from "../../../../shared/tools/notifyConfig";

@Component({
  selector: 'app-document-list-for-asset',
  templateUrl: './document-list-for-asset.component.html',
  styleUrls: ['./document-list-for-asset.component.scss']
})
export class DocumentListForAssetComponent implements OnInit, OnDestroy {

  @Input() assetId: string;
  files: Array<File> = [];
  fileModel: Array<FileModel> = [];
  documentList: DocumentFile[] = [];
  toolKit2 = Toolkit2;
  constructor(public uploadService: UploadService,
              public assetService: AssetService,
              public downloadService: DownloadService) { }

  ngOnInit() {
    this.assetService.getDocumentListByAssetId({assetId: this.assetId}).pipe(takeUntilDestroyed(this))
      .subscribe( (res: DocumentFile[]) => {

        if (res && res.length) {
          this.documentList = res;
        }
      });
  }

  onChangeUploader(input) {
    if (input.files.length > 0) {
      this.files = [];
      for (const i of input.files) {
        if (i.size < 100000000) {
          const file: FileModel = new FileModel();
          const f = i.type.split('/');
          file.name = i.name;
          file.type = f[0];
          file.lastModified = i.lastModified;
          this.fileModel.push(file);
          this.onUploadFile(i);
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
    this.uploadService.uploadFile(formData).pipe(takeUntilDestroyed(this))
      .subscribe((data: any) => {
        if (data) {
          this.documentList.push(data);
        }
      });
  }

  deleteItem(id: string) {
    this.documentList = this.documentList.filter(doc => doc.id !== id);
  }

  downloadFile(item: DocumentFile) {
    this.downloadService.downloadFile({documentId: item.id}).pipe(takeUntilDestroyed(this))
      .subscribe( (res: any) => {

        if (!isNullOrUndefined(res)) {
          FileSaver.saveAs(res, item.fileName);
        }
      });
  }

  updateAssetDocumentList() {
    this.assetService.updateAssetDocumentList(this.documentList, {assetId: this.assetId})
      .pipe(takeUntilDestroyed(this)).subscribe( (res: any) => {

    });
  }

  ngOnDestroy(): void {
  }
}
