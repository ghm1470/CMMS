import {Element} from './element';

export class Form {
    id: string;
    title: string;
    formCategoryTitle: string;
    formCategoryId: string;
    description: string;
    newElementList: Element[] = [];
}
