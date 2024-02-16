import {Injectable} from '@angular/core';
import {ResponseContentType, ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient} from '@angular/common/http';
import {Paging} from '@angular-boot/util';
import {WorkRequestDto} from '../model/work-request-dto';

@Injectable({
    providedIn: 'root'
})
export class TechnicianAssessmentService extends ServiceBase2 {

    constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig
    ) {
        super();
        this._objectName = 'technician-assessment';
        this.prefixMatches = this.getMatches(this._prefix);
    }


    saveAssessment(item: WorkRequestDto.SaveAssessment[]) {
        const suffixPath =
            'save';
        return super.postService(item, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }

    averagePointOfPersonnel(query: { userId?: string }) {
        const suffixPath =
            'get-all-average-point-of-personnel';
        return super.getService({
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }
}
