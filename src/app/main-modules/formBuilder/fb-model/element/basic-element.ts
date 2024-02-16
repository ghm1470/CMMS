import {ElementType} from '../enumeration/element-type';
import {Image} from "../../shared/model/Image";
import {TextFieldType} from '../enumeration/text-field-type';

export const ELEMENT_PICTURE = 'ELEMENT_PIC';
export const OPTION_PICTURE = 'OPTION_PIC';

export class BasicElement {
  id: string;
  label: string;
  helpText: string;
  required = false;
  picture: Image = new Image();
  elementType: ElementType;
  parentElement: ParentElement = {elementId: '0', optionId: '0'};
  index: number;
  score: number;
  minLength?: number;
  maxLength?: number;
  placeHolder: string;
  textFieldType: TextFieldType;
  optionList: any[] = [];
}


export class ParentElement {
  elementId: string;
  optionId: string;
}
