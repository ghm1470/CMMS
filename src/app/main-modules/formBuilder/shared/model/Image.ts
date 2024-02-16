import {BasicElement} from '../../fb-model/element/basic-element';
import {ImageStatus} from './ImageStatus';


export class Image {
    id: string;
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
    subQuestionList?: Array<BasicElement> = [];
    src: string;
    thumb: string;
    imageShow: string;
}
