import {Injectable} from '@angular/core';
import {ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient} from '@angular/common/http';
import {Paging} from '@angular-boot/util';
import {ReportAssetDto} from "../model/report-assetDTO";
import {MtbfDTO} from "../model/mtbfDTO";
import {KpiTableDTO} from "../model/kpi-table-DTO";

@Injectable({
    providedIn: 'root'
})

export class KpiTableService extends ServiceBase2 {

    constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig
    ) {
        super();
        this._objectName = 'work-order';
        this.prefixMatches = this.getMatches(this._prefix);
    }

// }
    mtbfTable(kpiTableDTO: KpiTableDTO.GetDto) {
        const suffixPath = 'mtbf-table';
        return super.postService(kpiTableDTO, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }

    mttrTable(kpiTableDTO: KpiTableDTO.GetDto) {
        const suffixPath = 'mttr-table';
        return super.postService(kpiTableDTO, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }
    mdtTable(kpiTableDTO: KpiTableDTO.GetDto) {
        const suffixPath = 'mdt-table';
        return super.postService(kpiTableDTO, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }

}
