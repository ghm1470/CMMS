import {Component, OnInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {GATE_WAY_URL} from '../../shared/profile/gateway-config-url';
import {isNullOrUndefined} from 'util';
import {Attachment} from '../../../main-modules/formBuilder/shared/model/file/Attachment';
import {Toolkit} from '../../../main-modules/formBuilder/shared/utility/toolkit';

declare var $: any;

@Component({
  selector: 'app-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.css']
})
export class AttachmentComponent implements OnInit, OnChanges {

  uploading = false;
  url: string;
  newFile = new Attachment();
  fileType: string;
  uploadingFileList: Array<Attachment> = [];
  @Input() attachmentList: Array<Attachment>;
  @Input() limitation: number;
  @Output() outputAttachmentList = new EventEmitter<Attachment[]>();
  MyToolkit = Toolkit;

  constructor(
    // private  attachmentService: AttachmentService
  ) {
    this.url = GATE_WAY_URL;
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.uploadingFileList = [];
    if (!isNullOrUndefined(this.attachmentList)) {
      this.uploadingFileList = JSON.parse(JSON.stringify(this.attachmentList));
      for (let i = 0; i < this.attachmentList.length; i++) {
        const parts = this.attachmentList[i].path.split('/');
        this.uploadingFileList[i].name = parts[parts.length - 1];
      }
    }
  }

  onChangeUploader(input) {
    // if (input.files.length > 0) {
    //   if (input.files.length <= this.limitation) {
    //
    //
    //       for (const i of input.files) {
    //         if (this.uploadingFileList.length <= this.limitation - 1 ) {
    //         if (i.size < 1000000) {
    //           const file: FileModel = new FileModel();
    //           const f = i.type.split('/');
    //           file.name = i.name;
    //           file.type = f[0];
    //           file.lastModified = i.lastModified;
    //
    //           if (file.type === 'application') {
    //             const fn = file.name.split('.');
    //             const fnL = fn.length;
    //             const fnT = fn[fnL - 1];
    //             if (fnT === 'pdf') {
    //               this.onUploadFile(i);
    //             } else {
    //               swal({
    //                 type: 'warning',
    //                 title: ' نوع فایل ' + fn[0] + ' باید  pdf باشد. ',
    //                 confirmButtonText: 'تایید!'
    //               });
    //             }
    //           } else {
    //             swal({
    //               type: 'warning',
    //               title: ' فابل انتخاب شده باید  pdf باشد.',
    //               confirmButtonText: 'تایید!'
    //             });
    //           }
    //         } else {
    //           swal({
    //             type: 'warning',
    //             title: 'حجم فایل ' + i.name + ' نباید بیشتر از ۱ مگابایت باشد.',
    //             confirmButtonText: 'نایید!'
    //           });
    //         }
    //       }else {
    //           swal({
    //             type: 'warning',
    //             title: 'تعداد فایل های انتخابی نباید بیشتر از ' + this.limitation + ' فایل باشد. ',
    //             confirmButtonText: 'نایید!'
    //           });
    //         }
    //     }
    //   } else {
    //     swal({
    //       type: 'warning',
    //       title: 'تعداد فایل های انتخابی نباید بیشتر از ' + this.limitation + ' فایل باشد. ',
    //       confirmButtonText: 'نایید!'
    //     });
    //   }
    // }
  }

  onUploadFile(file) {
    this.uploading = true;
    const formData = new FormData();
    formData.append('file', file);
    let y: any;
    y = file.length;
    formData.append('count', y);
    // this.attachmentService.uploadFile(formData).subscribe((res) => {
    //   if (res.flag) {
    //     this.newFile = res.data;
    //     const parts = this.newFile.path.split('/');
    //     this.newFile.name = parts[parts.length - 1];
    //     this.uploadingFileList.push(this.newFile);
    //     this.uploading = false;
    //     this.outputAttachmentList.emit(this.uploadingFileList);
    //   }
    // });
  }

  del(file, i) {
    // this.attachmentService.delete(file).subscribe(res => {
    //   if (res.flag) {
    //     this.uploadingFileList.splice(i, 1);
    //     this.outputAttachmentList.emit(this.uploadingFileList);
    //   }
    // });
  }

}
