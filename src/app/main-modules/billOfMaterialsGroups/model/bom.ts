

export namespace BOM {

  export class Create {
    bomGroupName: string;
    code: string;
    id: string;
  }

  export class BOMAsset {
    assetName: string;
    assetCode: string;
    assetId: string;
    assetQuantity: number;
  }

  export class BOMPart {
    partName: string;
    partCode: string;
    partId: string;
    partQuantity: number;
  }
  export class ALLPart {
    id: string;
    name: string;
    partCode: string;
    partQuantity: number;
  }
  export class BOMPartListCreate {
    partId: string;
    partQuantity: number;
  }
  export class BOMAssetListCreate {
    assetId: string;
    assetQuantity: number;
  }

  export class BOMAssetNameDTO {
    assetName: string;
    assetCode: string;
    assetId: string;
    numberOfAssets: number;
  }

  export class BOMPartNameDTO {
    partName: string;
    partCode: string;
    partId: string;
    numberOfParts: number;
  }

  export class BOMWithAssetAndPartDTO {
    bomGroupName: string;
    bomPartList: BOMPart[] = [];
    bomAssetList: BOMAsset[] = [];

  }
}
