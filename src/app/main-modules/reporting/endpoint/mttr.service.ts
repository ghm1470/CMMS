import {Injectable} from '@angular/core';
import {ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient} from '@angular/common/http';
import {Paging} from '@angular-boot/util';
import {ReportAssetDto} from "../model/report-assetDTO";
import {MtbfDTO} from "../model/mtbfDTO";
import {MttrDTO} from "../model/mttrDTO";

@Injectable({
    providedIn: 'root'
})

export class MttrService extends ServiceBase2 {

    constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig
    ) {
        super();
        this._objectName = 'work-order';
        this.prefixMatches = this.getMatches(this._prefix);
    }

// }
    mttrCalculation(mtbfDTO: MttrDTO.MttrCalculationDto) {
        const suffixPath = 'mttr-calculation';
        return super.postService(mtbfDTO, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }


}
