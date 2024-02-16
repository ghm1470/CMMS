import {ElementType} from './enum/element-type';
import {Option} from './option';

export class Element {
    id: string;
    questionTitle: string;
    guide: string;
    required = false;
    placeHolder: string;
    maxLength = 15;
    minLength = 1;
    newElementType: ElementType;
    maxItemSelectable: number;
    minItemSelectable: number;
    newOptionList: Option[] = [];
}
