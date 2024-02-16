import {Component, Input, OnChanges, OnInit, TemplateRef} from '@angular/core';
import {SmartTableConfig} from './smart-table-config';

@Component({
  selector: 'app-smart-table-test',
  templateUrl: './smart-table-test.component.html',
  styleUrls: ['./smart-table-test.component.css']
})
export class SmartTableTestComponent implements OnInit, OnChanges {
  // @Input('columns') public columns: Array<any> = [];
  // @Input('data') public data: any[];
  @Input('config') public config: SmartTableConfig = new SmartTableConfig();
  @Input('expanderTemplate') expanderTemplate: TemplateRef<any>;
  @Input('rowTemplate') rowTemplate: TemplateRef<any>;

//  public rows: any[] = [];

  trNumber = 50000;

  public allPageData: any[];
  public curPageData: any[];


//  private data: Array<any> = TableData;

  public constructor() {
    this.config.data = [];
  }


  public ngOnInit(): void {
    let defaultConfig = {
      data: [],
      paging: {
        page: 1,
        itemsPerPage: this.trNumber,
        maxSize: 5,
        numPages: 1,
        length: 0,
        firstText: 'اولین',
        previousText: 'قبلی',
        nextText: 'بعدی',
        lastText: 'آخرین',

      },
      export: {
        stripHtml: true,
        curPage: {
          Class: 'btn btn-default'
        },
        allPage: {
          Class: 'btn btn-default'
        }
      },
      table: {
        rows: [],
        columns: [],
        className: ['table', 'table-striped', 'table-bordered']
      },
      filtering: {filterString: ''},
    };

    // if ((this.config.paging !== undefined)) {
    if (this.config.paging) {
      let tmpConfig = this.config.paging;
      this.config.paging = defaultConfig.paging;
      for (let item in tmpConfig) {
        this.config.paging[item] = tmpConfig[item];
      }
      this.config.paging.length = this.config.data.length;
    }
    if (this.config.export) {
      let tmpConfig = this.config.export;
      this.config.export = defaultConfig.export;
      for (let item in tmpConfig) {
        this.config.export[item] = tmpConfig[item];
      }
    }
    if (this.config.table) {
      let tmpConfig = this.config.table;
      this.config.table = defaultConfig.table;
      for (let item in tmpConfig) {
        this.config.table[item] = tmpConfig[item];
      }
    }
    if (this.config.filtering) {
      let tmpConfig = this.config.filtering;
      this.config.filtering = defaultConfig.filtering;
      for (let item in tmpConfig) {
        this.config.filtering[item] = tmpConfig[item];
      }
    }
    if (!this.config.data) {
      this.config.data = [];
    }
    this.onChangeTable(this.config);
  }

  ngOnChanges() {
    this.onChangeTable(this.config);
    if (!!this.config.paging.page) {
      // this.setPageFromRoute = true;
      this.config.paging.page = this.config.paging.page; // binding value does not convert type string to type number automatically, so You must do it manually
    }
  }


  public changePage(page: any, data: Array<any> = this.config.data): Array<any> {
    let start = (page.page - 1) * page.itemsPerPage;
    let end = page.itemsPerPage > -1 ? (start + page.itemsPerPage) : data.length;
    return data.slice(start, end);
  }

  public changeSort(data: any, table: any): any {
    if (!table) {
      return data;
    }

    let columns = table.columns || [];
    let columnName: string = void 0;
    let sort: string = void 0;

    for (let i = 0; i < columns.length; i++) {
      if (columns[i].sort !== '' && columns[i].sort !== false && columns[i].sort !== undefined) {
        columnName = columns[i].name;
        sort = columns[i].sort;
      }
    }

    if (!columnName) {
      return data;
    }

    // simple sorting
    return data.sort((previous: any, current: any) => {
      if (previous[columnName] > current[columnName]) {
        return sort === 'desc' ? -1 : 1;
      } else if (previous[columnName] < current[columnName]) {
        return sort === 'asc' ? -1 : 1;
      }
      return 0;
    });
  }

  public changeFilter(data: any): any {
    let filteredData: Array<any> = data;
    this.config.table.columns.forEach((column: any) => {
      if (column.filtering) {
        filteredData = filteredData.filter((item: any) => {
          try {
            return item[column.name].match(column.filtering.filterString);
          } catch (e) {
            // No content response..
            return 'نامشخص';
          }
          // return item[column.name].match(column.filtering.filterString);
        });
      }
    });
    if (!this.config.filtering) {
      return filteredData;
    }

    if (this.config.filtering.columnName) {
      return filteredData.filter((item: any) =>
        item[this.config.filtering.columnName].match(this.config.filtering.filterString)
      );
    }

    let tempArray: Array<any> = [];
    filteredData.forEach((item: any) => {
      let flag = false;
      this.config.table.columns.forEach((column: any) => {
        if (column.name !== undefined && column.name.length > 0) {
          try {
            if (item[column.name].toString().match(this.config.filtering.filterString)) {
              flag = true;
            }
          } catch (e) {
            flag = false;
          }
        }
      });
      if (flag) {
        tempArray.push(item);
      }
    });
    filteredData = tempArray;

    return filteredData;
  }

  public onChangeTable(config: SmartTableConfig, page: any = {}): any {
    if (config.paging) {
      page = {
        page: this.config.paging.page,
        itemsPerPage: this.config.paging.itemsPerPage
      };
    }
    if (config.filtering) {
      Object.assign(this.config.filtering, config.filtering);
    }
    if (config.table) {
      Object.assign(this.config.table, config.table);
    }
    let filteredData = this.changeFilter(this.config.data);
    let sortedData = this.changeSort(filteredData, this.config.table);
    this.allPageData = sortedData;
    this.curPageData = this.changePage(page, sortedData);
    this.config.table.rows = page && config.paging ? this.changePage(page, sortedData) : sortedData;
    this.config.paging.length = sortedData.length;
  }

  // public onCellClick(data: any): any {
  // }

  // checkAdmin() {
  //   const boolean1 =  Config.checkedAdmin('provinceAdmin');
  //   const boolean2 =  Config.checkedAdmin('country');
  //   const boolean3 =  Config.checkedAdmin('reports');
  //   if (boolean1 && boolean2 && boolean3) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

}
