import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ModalUtil} from "@angular-boot/widgets";
import {ActionMode, DefaultNotify, isNullOrUndefined, ModalSize} from "@angular-boot/util";
import {FileModel} from "../../../shared/model/fileModel";
import {NotiConfig} from "../../../shared/tools/notifyConfig";

declare var $: any;

@Component({
  selector: 'app-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.scss']
})
export class UploadDocumentComponent implements OnInit, OnChanges {
  @Input() id: any;
  @Input() mode: ActionMode;
  actionMode = ActionMode;

  modalId = ModalUtil.generateModalId();
  MyModalSize = ModalSize;
  showName: string;

  files: Array<File> = [];
  fileModel: Array<FileModel> = [];
  uploading = false;

  constructor() {
  }

  ngOnInit() {
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

  //
  openModal() {
    // if (this.id){
    ModalUtil.showModal(this.modalId)
    // }

  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (this.id) {
    //   ModalUtil.showModal('modalId');
    //
    // }

  }

  selectFiles(input) {
    if (input.files.length > 0) {
      this.uploading = true;
      this.files = [];
      for (const i of input.files) {
        if (i.size < 100000000) {
          const file: FileModel = new FileModel();
          const f = i.type.split('/');
          const c = f.length;
          file.name = i.name;
          file.type = f[(c - 1)];
          file.lastModified = i.lastModified;
          this.fileModel.push(file);
          // this.onUploadFile(i);
          // ModalUtil.hideModal(this.modalId);
        } else {
          DefaultNotify.notifyWarning('حجم فایل ' + i.name + 'نباید بیشتر از ۱۰۰ مگابایت باشد.', '', NotiConfig.notifyConfig);
        }
      }
      if (this.files.length > 0) {
      }
    }


  }

  loadingBarMethoud() {
    // $('button').parent().addClass('active');
    $('#parentOfButton').addClass('active');
  }
}
