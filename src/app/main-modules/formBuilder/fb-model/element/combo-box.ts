import {BasicElement} from './basic-element';
import {ComboBoxType} from '../enumeration/combo-box-type';

export class ComboBox extends BasicElement {
  placeHolder: string;
  comboOptionList: Array<string>;
  multipleSelect: boolean;
  comboBoxType: ComboBoxType;
}
