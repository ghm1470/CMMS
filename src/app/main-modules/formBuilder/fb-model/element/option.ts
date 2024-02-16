import {BasicElement} from './basic-element';
import {FileModel} from '../../shared/model/file/file-model';

export class Option {
  id: string;
  caption: string;
  webPicture: string = null;
  picture: FileModel;
  subQuestionList: Array<BasicElement> = [];
}
