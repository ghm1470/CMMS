import {FileStatus} from './FileStatus';

export class Attachment {
  extension: string;
  path: string;
  size: number;
  caption: string;
  fileStatus: FileStatus;
  fileData: string;
  name: string;
}
