import {
  AfterViewInit, Component, Input, OnInit, TemplateRef,
  Output, EventEmitter, OnChanges
} from '@angular/core';

import {Table} from '../smart-table-config';



@Component({
  selector: 'pro-table',
  templateUrl: './pro-table.component.html',
  styleUrls: ['./pro-table.component.css'],
})
export class ProTableComponent implements OnInit , AfterViewInit, OnChanges {

  // @Input() data:  any[];
  // @Input() columns: Column;
  @Input() config: Table;
  @Input() expanderTemplate: TemplateRef<any>;
  @Input() rowTemplate: TemplateRef<any>;
  @Output() tableChanged = new EventEmitter<any>();
  @Output() cellClicked = new EventEmitter<any>();


//  @ViewChildren('dtrow', { read: ViewContainerRef }) viewChildren: QueryList<ViewContainerRef>;

 // @ViewChild('holder',{ read: ViewContainerRef }) holder: ViewContainerRef;

  // factory;

  public isRowExpanded: boolean [] = [];

  constructor(
//    private resolver: ComponentFactoryResolver
  ) {  }

  toggleRow(event, i) {
    this.isRowExpanded[i] = this.isRowExpanded[i] ? false : true;
  }

  onCellClicked() {
    this.cellClicked.emit();
  }

  onTableChanged() {
    this.tableChanged.emit();
  }

  filterChanged(e) {
    this.onTableChanged();
  }

  trySort(i) {
    if (this.config.columns[i].sort !== undefined) {
      switch (this.config.columns[i].sort) {
        case 'asc':
          this.config.columns[i].sort = 'desc';
          break;
        case 'desc':
          this.config.columns[i].sort = '';
          break;
        default:
          this.resetColSorts();
          this.config.columns[i].sort = 'asc';
      }
      this.onTableChanged();
    }
  }

  resetColSorts() {
    for (let i in this.config.columns) {
      if (this.config.columns[i].sort !== undefined) {
        this.config.columns[i].sort = '';
      }
    }
  }

  ngAfterViewInit() {
  }

  ngOnInit() {
  }

  ngOnChanges() {
  }

}
