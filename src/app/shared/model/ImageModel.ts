import {ImageStatus} from '../../_base/helper/enum/ImageStatus';

export class ImageModel {
    id: any;
    extension: string;
    path: string;
    smallPath: string;
    size: number;
    width: number;
    height: number;
    alt: string;
    caption: string;
    imageData: string;
    imageStatus: ImageStatus = ImageStatus.WITHOUT_IMAGE;
    imageShow: string;
    fileByte: any;
    // subQuestionList?: Array<BasicElement> = [];
}
