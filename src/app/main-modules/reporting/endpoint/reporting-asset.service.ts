import {Injectable} from '@angular/core';
import {ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient} from '@angular/common/http';
import {Paging} from '@angular-boot/util';
import {ReportAssetDto} from "../model/report-assetDTO";

@Injectable({
    providedIn: 'root'
})

export class ReportingAssetService extends ServiceBase2 {

    constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig
    ) {
        super();
        this._objectName = 'work-order';
        this.prefixMatches = this.getMatches(this._prefix);
    }


    usedPartOfWOrkOrder(query: { paging: Paging, totalElements: any }, dto: ReportAssetDto.UsedPartOfWorkOrderGetPageDto) {
        const suffixPath = 'used-part-of-work-order';
        return super.postService(dto, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
            urlQueryObject: query
        });
    }
    countUsedPartOfWorkOrder( dto: ReportAssetDto.UsedPartOfWorkOrderGetPageDto) {
        const suffixPath = 'count-used-part-of-work-order';
        return super.postService(dto, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }


}
