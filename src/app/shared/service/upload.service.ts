import {Injectable} from '@angular/core';
import {ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Paging} from '@angular-boot/util';
import {UserDto} from '../../main-modules/user/model/dto/user-dto';

@Injectable({
    providedIn: 'root'
})
export class UploadService extends ServiceBase2 {

    constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig
    ) {
        super();
        this._objectName = 'upload';
        this.prefixMatches = this.getMatches(this._prefix);
    }

    uploadFile(formData) {
        let headers = new HttpHeaders();
        headers = headers.set('Authorization', sessionStorage.getItem('token'));
        return this._HttpClient.post(this._ServiceConfig.getUrl() + '/upload'
            /*Config.getLocalStorageToken()*/, formData, {headers: headers});
    }

    uploadImage(formData) {
        let headers = new HttpHeaders();
        headers = headers.set('Authorization', sessionStorage.getItem('token'));
        return this._HttpClient.post(this._ServiceConfig.getUrl() + '/upload-image', formData, {headers: headers});
    }

    uploadFileWithExtraId(formData, extraId: string, showName?: string) {
        // return super.postService(item, {
        //   needToken: true,
        //   objectPrefix: this.getPrefix({}),
        //   objectSuffix: this.replaceParams(null, {}),
        // });
        let headers = new HttpHeaders();
        headers = headers.set('Authorization', sessionStorage.getItem('token'));
        return this._HttpClient.post(this._ServiceConfig.getUrl() + '/upload-with-extra-id?referenceId=' + extraId + '&showName=' + showName
            /*Config.getLocalStorageToken()*/, formData, {headers: headers});
    }

    uploadForSchedule(formData, extraId: string, showName?: string) {
        // return super.postService(item, {
        //   needToken: true,
        //   objectPrefix: this.getPrefix({}),
        //   objectSuffix: this.replaceParams(null, {}),
        // });
        let headers = new HttpHeaders();
        headers = headers.set('Authorization', sessionStorage.getItem('token'));
        return this._HttpClient.post(this._ServiceConfig.getUrl() + '/upload-with-extra-id-for-schedule?referenceId=' + extraId + '&showName=' + showName
            /*Config.getLocalStorageToken()*/, formData, {headers: headers});
    }





    delete(query: { id: string }) {
        const suffixPath = 'delete';
        return super.deleteService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query,
        });
    }

    update(item, query: { id: string }) {
        const suffixPath = 'update';
        return super.putService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getPage(query: { paging: Paging, totalElements: any, term?: string }) {
        const suffixPath =
            'get-page';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getAllByFilterAndPagination(item: UserDto.GetAllByFilter,
                                query: { paging: Paging, totalElements: any }) {
        const suffixPath =
            'get-all-by-filter-and-pagination';
        return super.postService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

    getList(query: { term, limit }) {
        const suffixPath =
            'get-list';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
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

    checkNationalCode(query: { nationalCode: string }) {
        const suffixPath =
            'check-national-code';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }

}
