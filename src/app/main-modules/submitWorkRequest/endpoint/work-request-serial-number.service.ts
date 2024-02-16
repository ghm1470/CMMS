import {Injectable} from '@angular/core';
import {ResponseContentType, ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient} from '@angular/common/http';
import {Paging} from '@angular-boot/util';
import {WorkRequestDto} from '../model/work-request-dto';

@Injectable({
    providedIn: 'root'
})
export class WorkRequestSerialNumberService extends ServiceBase2 {

    constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig
    ) {
        super();
        this._objectName = 'work-request-serial-number';
        this.prefixMatches = this.getMatches(this._prefix);
    }

// خواندن آخرین شماره برگه pm

    workRequestSerialNumber() {
        const suffixPath =
            'give-pm-code';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }


}
