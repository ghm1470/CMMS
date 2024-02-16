
export const ENTITYNAME_FORM_DATA = 'formData';

export class FormData {
  id: string;
  formId: string;
  formTitle: string;
  systemCreationDate: string;
  answerList: Array<QuestionAnswer> = [];
  creatorId: string;
  // errorResult = false;
}

export class QuestionAnswer {
  questionId: string;
  questionElementType: string;
  answerIdList: Array<any> = []; // Answers of all questions are array of string except matrix.
}

export class MatrixAnswer {
  questionTitle: string;
  matrixValueList: Array<string> = [];
}
