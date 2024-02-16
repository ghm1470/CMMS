import {Post} from '../post';
import {ActivityLevel} from '../../../../activity/model/activityLevel';
import {MyDate} from '../MyDate';


export class History {
  id: string;
  sender: Post;
  receiver = new ActivityLevel();
  actionType: string;
  description: string;
  creationDate: MyDate;
}
