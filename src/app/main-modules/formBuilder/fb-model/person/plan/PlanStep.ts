import {Person} from "../Person";

export class PlanStep {

  title: string;
  comment: string;
  Receipt: string;//زمان دریافت
  Posttime: string;//زمان ارسال یا ارجاع
  sender: Person;
  Receiver: Person;
}
