import {Injectable} from '@angular/core';
import {ResponseContentType, ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient} from '@angular/common/http';
import {Paging} from '@angular-boot/util';
import {WorkRequestDto} from "../../../submitWorkRequest/model/work-request-dto";
import {Budget} from "../model/dto/budget";
import {BudgetSearch} from "../feature/list/budget-list.component";

@Injectable({
  providedIn: 'root'
})
export class BudgetService extends ServiceBase2 {

  constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig
  ) {
    super();
    this._objectName = 'budget';
    this.prefixMatches = this.getMatches(this._prefix);
  }

  create(item) {
    const suffixPath = 'save';
    return super.postService(item, {
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
    });
  }

  update(item, query: { budgetId: string }) {
    const suffixPath = 'update';
    return super.putService(item, {
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }

  getAll() {
    const suffixPath = 'get-all';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
    });
  }

  getAllByPagination(query: { paging: Paging, totalElements: any, term: string }) {
    const suffixPath = 'get-all-by-pagination';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }

  getAllByFilterAndPagination(item: BudgetSearch, query: { paging: Paging, totalElements: any, term?: string }) {
    const suffixPath =
      'get-all-by-pagination';
    return super.postService(item, {
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),

      urlQueryObject: query
    });
  }

  delete(query: { budgetId: string }) {
    return super.deleteService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(null, {}),
      urlQueryObject: query,
      responseContentType: ResponseContentType.Text
    });
  }

  getOne(query: { id: string }) {
    const suffixPath =
      'get-one';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }

  checkBudgetCode(query: { code: string }) {
    const suffixPath = 'check-if-code-is-unique';
    return super.getService({
      needToken: true,
      objectPrefix: this.getPrefix({}),
      objectSuffix: this.replaceParams(suffixPath, {}),
      urlQueryObject: query
    });
  }

}
