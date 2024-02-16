import {BasicElement} from './basic-element';
import {Image} from '../../shared/model/Image';

export class CheckBox extends BasicElement {
  optionList: Array<Image>;
  minItemSelectable = 1;
  maxItemSelectable = 1;
}
