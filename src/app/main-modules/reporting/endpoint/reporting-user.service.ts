import {Injectable} from '@angular/core';
import {ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient} from '@angular/common/http';
import {Paging} from '@angular-boot/util';
import {ReportUserDto} from "../model/report-userDTO";

@Injectable({
    providedIn: 'root'
})

export class ReportingUserService extends ServiceBase2 {

    constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig
    ) {
        super();
        this._objectName = 'work-order';
        this.prefixMatches = this.getMatches(this._prefix);
    }


    personnelFunction(query: { paging: Paging, totalElements: any }, dto: ReportUserDto.TotalWorkedTimeOfPersonnel) {
        const suffixPath = 'personnel-function';
        return super.postService(dto, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }
    TotalWorkedTimeOfPersonnel(dto: ReportUserDto.TotalWorkedTimeOfPersonnel) {
        const suffixPath = 'total-worked-time-of-personnel';
        return super.postService(dto, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }


}
