import {ResourseKeyword} from "./resourse.keyword.enume";

export class State {
  keyword?: ResourseKeyword;
  message?: string;

  constructor(keyword: ResourseKeyword,
              message: string) {
    this.keyword = keyword;
    this.message = message;
  }
}
