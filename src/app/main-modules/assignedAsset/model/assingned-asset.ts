import {PartDto} from '../../part/model/dto/part';
import {AssetDto} from '../../asset/model/dto/assetDto';

export namespace AssignedAsset {
  export class GetAll {
  userId: string;
  assignedAssetList: AssignedAsset[] = [];
  // partList: PartDto.GetAll[] = [];
  // assetList: AssetDto.CreateAsset[] = [];
  }
  export class AssignedAsset {
   id: string;
    name: string;
    code: string;
    type: string;
  }
}
