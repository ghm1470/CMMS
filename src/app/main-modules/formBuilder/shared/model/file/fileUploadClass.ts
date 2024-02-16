import {BehaviorSubject} from 'rxjs';
import {Observable} from 'rxjs';
import {FormService} from '../../../fb-service/form.service';
import {Image} from '../Image';
import {ImageStatus} from '../ImageStatus';

export class ImageUploadClass {

    constructor(private formService: FormService) {
    }

    setPicture(event: any, image: Image): Observable<Image> {
        const reader = new FileReader();
        const picture = new BehaviorSubject<Image>(null);
        if (event.target.files.length > 0) {
            reader.readAsDataURL(event.target.files[0]);
            const that = this;
            reader.onload = function() {
                if (event.target.files[0].size > 102400) {
                } else {
                    let x ;
                    const n = x.search(';base64,');
                    image.extension = '.' + x.substring(11, n);
                    image.imageData = x.substring(n + 8, x.length);
                    if (image.imageStatus === ImageStatus.SAVED_IMAGE || image.imageStatus === ImageStatus.DELETE_IMAGE) {
                        image.imageStatus = ImageStatus.UPDATE_IMAGE;
                    } else if (image.imageStatus === ImageStatus.WITHOUT_IMAGE) {
                        image.imageStatus = ImageStatus.NEW_IMAGE;
                    }
                    that.formService.uploadImage(image).subscribe((res: Image) => {
                        res.imageData = x;
                        picture.next(res);
                    });
                }
            };
        }
        return picture.asObservable();
    }

    deletePicture(image: Image): Observable<Image> {
        const picture = new BehaviorSubject<Image>(null);
        if (image.imageStatus === ImageStatus.NEW_IMAGE) {
            image.imageStatus = ImageStatus.WITHOUT_IMAGE;
        } else if (image.imageStatus === ImageStatus.SAVED_IMAGE) {
            image.imageStatus = ImageStatus.DELETE_IMAGE;
        }
        this.formService.uploadImage(image).subscribe((res: Image) => {
            picture.next(res);
        });
        return picture.asObservable();
    }
}
