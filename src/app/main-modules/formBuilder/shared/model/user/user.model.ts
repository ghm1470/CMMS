import {FileModel} from '../file/file-model';

export class User {
  activated?: boolean;
  authorities?: string[];
  email?: string;
  firstName?: string;
  photo: FileModel;
  webPhoto: string;
  langKey?: string;
  lastName?: string;
  login?: string;
  phone?: string;
  sub?: string;
}
