/**
 * Created by Zar on 3/9/2017.
 */
export class FormAnalysis {
  id: string;
  title: string;
  description: string;
  elements: Array<FormAnswers>;
}

export class FormAnswers {
  question: any;
  answers: Array<FilteringAnswers> = [];
  totalAnswer: number;
}

export class FilteringAnswers {
  filteringValue: string;
  filteringAnswers: Array<any> = [];
}
