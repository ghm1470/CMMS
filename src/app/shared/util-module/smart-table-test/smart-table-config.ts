class Paging {
  page?: number;
  itemsPerPage?: number;
  maxSize?: number;
  numPages?: number;
  length?: number;
  firstText?: string;
  previousText?: string;
  nextText?: string;
  lastText?: string;
}
class CurPage {
  Class: string = 'btn btn-default';
}
class AllPage {
  Class: string = 'btn btn-default';
}
class Export {
  stripHtml?: boolean = true;
  curPage?: CurPage;
  allPage?: AllPage;
}
class Sorting {
  columns?: Column[] = [];
}
class Filtering {
  filterString: any = '';
  columnName?: string;
  placeholder?: string;
}
export class Column {
title?: string;
name?: string;
filtering?: Filtering;
sort?: string;
className?: string[];
validationForShow?: boolean;
}
export class Table {
  columns: Column[];
  rows?: any[] = [];
  className?: string[];
  id?: string;
}
export interface SmartTableConfigI {
  paging?: Paging;
  export?: Export;
  table: Table;
  filtering?: Filtering;
  data: any[];
}
export class SmartTableConfig implements SmartTableConfigI {
  paging?: Paging;
  export?: Export;
  table: Table;
  filtering?: Filtering;
  data: any[];
  public static getInstance(clone: SmartTableConfig) {
    let tmp = new SmartTableConfig();
    tmp.paging = clone.paging;
    tmp.export = clone.export;
    tmp.table = clone.table;
    tmp.filtering = clone.filtering;
    tmp.data = clone.data;
    return tmp as SmartTableConfigI;
  }
}
