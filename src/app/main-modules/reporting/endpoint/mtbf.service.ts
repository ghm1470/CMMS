import {Injectable} from '@angular/core';
import {ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient} from '@angular/common/http';
import {Paging} from '@angular-boot/util';
import {ReportAssetDto} from "../model/report-assetDTO";
import {MtbfDTO} from "../model/mtbfDTO";

@Injectable({
    providedIn: 'root'
})

export class MtbfService extends ServiceBase2 {

    constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig
    ) {
        super();
        this._objectName = 'work-order';
        this.prefixMatches = this.getMatches(this._prefix);
    }

// }
    mtbfCalculation( mtbfDTO: MtbfDTO.MtbfCalculationDto) {
        const suffixPath = 'mtbf-calculation';
        return super.postService(mtbfDTO, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }


}
