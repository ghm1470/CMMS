import {Image} from '../shared/model/Image';

export interface FormInterface {
  create(item);
  getAll();
  getOne( itemId );
  deleteOne( itemId );
  update(item: Object, itemId?: string);
  uploadImage(item: Image);
}
