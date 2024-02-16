import {Address} from './addressing/Address';
import {Contact} from './Contact';
import {Post} from './post';
import {Image} from '../../shared/model/Image';
import {Country} from './addressing/Country';
import {Educational} from './Educational';
import {Status} from './Status';
import {UserAccount} from './Security/UserAccount';
import {BankAccount} from './finance/bankAccount';
import {HomeOwnerShip} from './homeOwnerShip';
import {MaritalStatus} from './maritalStatus';
import {NumberOfChildren} from './numberOfChildren';
import {Gender} from '../enumeration/enum/Gender';

export class Person {
  id: string;
  externalSamaSamaneId: string;
  // identification
  firstNameFa: string;
  firstNameEn: string;
  lastNameFa: string;
  lastNameEn: string;
  fatherNameFa: string;
  fatherNameEn: string;
  nationalCode: string;
  identificationNumber: string;
  identificationSerialNumber: string;
  birthDate: string;
  gender: Gender;
  maritalStatus: MaritalStatus;
  numberOfChildren: NumberOfChildren;
  photo: Image;
  nationality: Country;
  signature: Image;

  // address
  address: Address;

  // contact
  contact: Contact;

  // job
  job: string;
  incomeLevel: string;
  homeOwnerShip: HomeOwnerShip;
  bankAccount: BankAccount;

  // account
  userType: any;
  userAccount: UserAccount;

  // education
  educational: Educational;

  // userType && postList
  postList: Array<Post> = [];

  // score
  score: number;
  credit: number;
  // transactions: Array<Transaction>;

  status: Status;

  email: string;

  // فرم سوابق فرهنگی
  formDataId: string;

  // verification code for voting
  electionToken: string;
  numberOfSentToken: number;

}
