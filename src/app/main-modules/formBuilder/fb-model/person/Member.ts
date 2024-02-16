import {Person} from "./Person";
import {Status} from "../enumeration/enum/Status";


export class Member {
  person: Person;
  status: Status;
  joinStartDate: string;
  joinEndDate: string;
  confirmedByPersonId: string;
  confirmedDate: string;
}
