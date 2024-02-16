import {BasicElement} from './basic-element';
import {FileUploadType} from '../enumeration/file-upload-type';

export class FileAttach extends BasicElement {
  // attachedFileList: Array<Attachment>;
  fileCountLimitation: number;
  fileType: FileUploadType;
}
