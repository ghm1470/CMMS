import {TextFieldType} from '../enumeration/text-field-type';
import {BasicElement} from './basic-element';

export class TextField extends BasicElement {
  placeHolder: string;
  minLength = 1;
  maxLength = 15;
  textFieldType: TextFieldType;
}

