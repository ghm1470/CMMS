import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Service} from './service';
import {Model} from './model';

@Component({
  selector: 'app-test-pagination',
  templateUrl: './test-pagination.component.html',
  styleUrls: ['./test-pagination.component.scss']
})
export class TestPaginationComponent implements OnInit {
  pageSize = 10;
  pageIndex = 0;
  length = -1;
  term: string;

  entityList: Model.GetPage[] = [];
  loading: boolean;

  constructor(private entityService: Service,
              public router: Router,
              private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.pageIndex) {
        this.pageIndex = params.pageIndex;
        this.pageSize = params.pageSize;
        this.term = params.term;
      }
      this.getPage();

    });
  }

  ngOnInit() {
  }
  getPage() {
    this.loading = true;

    this.entityService.getPage({
      page: this.pageIndex,
      size: this.pageSize,
      term: this.term
    }).subscribe((res: any) => {
      if (res) {
        this.entityList = res.content;
        this.length = res.totalElements;
        this.loading = false;
      }
      
    }, error => {
      this.loading = false;
    });
  }

  search() {
    this.pageIndex = 0;
    this.navigate();
  }

  navigate() {
    this.router.navigate([window.location.hash.split('#/')[1].split('?')[0]], {
      queryParams: {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        term: this.term,
      },
    });

  }

  changePage(event: any) {
    this.length = event.length;
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.navigate();

  }
}
