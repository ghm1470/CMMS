import {Group} from './Group';
import {Field} from './Field';
import {GradeEnum} from '../../enumeration/enum/gradeenum';


export class Grade {
  id: string;
  name: GradeEnum;
  listField: Field[];

}
