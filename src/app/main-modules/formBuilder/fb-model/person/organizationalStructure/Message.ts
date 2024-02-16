import {Person} from '../Person';

export class Message {
  id: string;
  subject: string;
  content: string;
  sender: Person;
  audienceList: Person[];
  parentMessage: Message;
  masterMessage: Message;
  attachedFile: File;
  liked: number;
  disLiked: number;
}
