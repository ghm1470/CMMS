export interface FormCategoryInterface {
  create(item);
  getAll();
  getOne( itemId );
  deleteOne( itemId );
  update(item: Object, itemId?: string);
}
