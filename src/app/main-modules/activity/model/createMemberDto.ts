import {Post} from './post/post';
import {Gender} from '../../formBuilder/fb-model/enumeration/enum/Gender';

export class CreateMemberDto {
  firstName: string;
  lastName: string;
  identityId: string;
  email: string;
  gender: Gender;
  phone: string;
  employeeCode: string;
  password: string;
  parkId: string;
  post: Post;
  userId: string;
}
