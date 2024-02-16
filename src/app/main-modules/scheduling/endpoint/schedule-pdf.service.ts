import {Injectable} from '@angular/core';
import {ResponseContentType, ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient} from '@angular/common/http';
import {ScheduleDto} from '../model/scheduleDto';

@Injectable({
    providedIn: 'root'
})

export class SchedulePdfService extends ServiceBase2 {

    constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig) {
        super();
        this._objectName = 'pdf';
        this.prefixMatches = this.getMatches(this._prefix);
    }


    Pdf(entity: ScheduleDto.GetPageSearchDto) {
        const suffixPath = 'download/work-order-schedule';
        return super.postService(entity, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            responseContentType: ResponseContentType.Blob

        });
    }


}
