import {Injectable} from '@angular/core';
import {Image} from '../shared/model/Image';
import {ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient} from '@angular/common/http';
import {Paging} from '@angular-boot/util';
import {WorkOrderDto} from '../../workOrder/model/dto/workOrderDto';
import {FormSearchInputDTO} from '../form-builder.component';

@Injectable({
    providedIn: 'root'
})
export class FormService extends ServiceBase2 {

    constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig) {
        super();
        this._objectName = 'form';
        this.prefixMatches = this.getMatches(this._prefix);
    }

    uploadImage(item: Image) {
        const suffixPath = 'picture';
        return super.postService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }

    create(item) {
        const suffixPath = 'create';
        return super.postService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(null, {}),
        });
    }

    checkIfTitleIsUnique(title: string) {
        const suffixPath =
            'check-if-title-is-unique';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: {title}

        });
    }

    getFormsByCategory(categoryId: string) {
        const suffixPath =
            'list-form-by-category/' + categoryId;
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }

    getFormTitleAndCategory(formId: string) {
        const suffixPath =
            'one-light-form/' + formId;
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }

    getFormCategoryByFormId(formId: string) {
        const suffixPath =
            'get-form-category-id/' + formId;
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }

    checkEditable(formId: string) {
        const suffixPath =
            'check-editable/' + formId;
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }

    getSelectedForm() {
        const suffixPath =
            'get-isSelected-formId';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }

    checkUsingForm(fId: string) {
        const suffixPath =
            'if-form-used-in-activity';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: {formId: fId}
        });
    }

    getAllLimit(pId?: string) {
        const suffixPath =
            'get-all-limit';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: {companyId: pId}
        });
    }

    getAllByPagination(item: FormSearchInputDTO, query: { paging: Paging, totalElements: any }) {
        const suffixPath = 'get-all-list-with-pagination';
        return super.postService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getOneForm(id) {
        const suffixPath = 'get-one';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: {formId: id}
        });
    }

    deleteForm(formId) {
        return super.deleteService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(null, {}),
            urlQueryObject: {id: formId}
        });
    }

}
