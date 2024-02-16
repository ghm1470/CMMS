import {ElementType} from './enum/element-type';

export class FormData {
    id: string;
    formId: string;
    systemCreationDate: any;
    answerList: Array<QuestionAnswer> = [];
}

export class QuestionAnswer {
    questionId: string;
    questionElementType: ElementType;
    answerIdList: Array<any> = []; // Answers of all questions are array of string except matrix.
}

export class DateInputObject {
    id: string;
    date: any;
}
