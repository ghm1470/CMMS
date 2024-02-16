import {College} from "../organizationalStructure/College";
import {Group} from "../organizationalStructure/Group";
import {GradeEnum} from "../../enumeration/enum/gradeenum";
import {Field} from "../organizationalStructure/Field";
import {Gender} from "../../enumeration/enum/Gender";
import {SemesterOfArrival} from "../SemesterOfArrival";


export class Condition {
    id: string;
    collegePermision: boolean;
    college: College;
    groupPermision: boolean;
    group: Group;
    gradePermision: boolean;
    grade: GradeEnum;
    fieldPermision: boolean;
    field: Field;
    genderPermision: boolean;
    gender: Gender;
    semesterOfArrivalsPermision: boolean;
    semesterOfArrival: SemesterOfArrival;



}
