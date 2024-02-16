import {GeneralDomain} from './generalDomain';
import {LightPerson} from './light-person';
import {Status} from '../enumeration/enum/Status';
import {Privilege} from './Security/Privilege';
import {PostCategory} from './post-category';


export class Post extends GeneralDomain {
  title: string;
  orgId: string;
  orgTitle: string;
  postCategory: PostCategory = new PostCategory();
  lightPersonList: Array<LightPerson> = [];
  status: Status;
  privilegeList: Array<Privilege> = [];
}
