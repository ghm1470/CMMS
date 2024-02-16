import {Injectable} from '@angular/core';
import {ServiceBase2, ServiceConfig} from '@angular-boot/core';
import {HttpClient} from '@angular/common/http';
import {MdtDTO} from '../model/mdtDTO';

@Injectable({
    providedIn: 'root'
})

export class MdtService extends ServiceBase2 {

    constructor(public _HttpClient: HttpClient, public _ServiceConfig: ServiceConfig
    ) {
        super();
        this._objectName = 'work-order';
        this.prefixMatches = this.getMatches(this._prefix);
    }

// }
    mdtCalculation(mdtDTO: MdtDTO.MdtCalculationDto) {
        const suffixPath = 'mdt-calculation';
        return super.postService(mdtDTO, {
            needToken: true,
            objectPrefix: this.getPrefix({}),
            objectSuffix: this.replaceParams(suffixPath, {}),
        });
    }


}
