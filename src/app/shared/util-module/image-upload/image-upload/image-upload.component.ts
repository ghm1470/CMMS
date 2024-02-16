
import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {GATE_WAY_URL} from '../../../shared/profile/gateway-config-url';
import {isNullOrUndefined} from 'util';
import {Toolkit} from '../../../../main-modules/formBuilder/shared/utility/toolkit';
import {ImageStatus} from '../../../../main-modules/formBuilder/fb-model/enumeration/enum/ImageStatus';
import {Image} from '../../../../main-modules/formBuilder/shared/model/Image';


@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent implements OnInit, OnChanges {

  data: any = null;
  hasImage = false;
  MyToolkit = Toolkit;
  MyImageStatus = ImageStatus;
  url = GATE_WAY_URL;
  // imageList: Array<Image> = [];
  @Input() fileType: any;
  @Input() image;
  @Input() imageList: Image [] = [];
  @Input() multiple: boolean;
  @Input() limit = false;
  @Input() imageHasWide = false;
  @Input() limitationCount: number;
  @Output() returnPhoto = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit() {
    // this.languageDataService.getLanguageData().subscribe(res => {
    //   this.data = res;
    // });
  }

  ngOnChanges() {

  }

  setImage(event) {
    // let sizeOk;
    // if (this.imageHasWide) {
    //   const u = URL.createObjectURL(event.target.files[0]);
    //   const img = new Image;
    //   img.src = u;
    //   const slef = this;
    //   img.onload = function () {
    //     // alert(img.width);
    //     if (img.width < 1360 || img.height < 728) {
    //       swal({
    //         title: 'عملیات انجام نشد!',
    //         text: 'سایز عکس مناسب نیست. راهنما را مطالعه کنید',
    //         type: 'error',
    //         confirmButtonColor: '#04383c',
    //       });
    //       sizeOk = false;
    //     } else {
    //       sizeOk = true;
    //     }
    //   };
    // }
    //
    // setTimeout(() => {
    //   if (!sizeOk) {
    //     return;
    //   }
    //
    //   const reader = new FileReader();
    //   // this.image.imageStatus = this.imageStatus;
    //   if (event.target.files.length > 0) {
    //     reader.readAsDataURL(event.target.files[0]);
    //     const that = this;
    //     reader.onload = function () {
    //       if (!isNullOrUndefined(that.fileType) && event.target.files[0].type !== that.fileType) {
    //         swal({
    //           title: 'عملیات انجام نشد!',
    //           text: 'فرمت عکس انتخابی صحیح نیست.',
    //           type: 'error',
    //           confirmButtonColor: '#04383c',
    //         });
    //       } else if (that.fileType == null && event.target.files[0].type !== 'image/jpeg'
    //         && event.target.files[0].type !== 'image/jpg' && event.target.files[0].type !== 'image/png') {
    //         swal({
    //           title: 'عملیات انجام نشد!',
    //           text: 'فرمت عکس انتخابی صحیح نیست.',
    //           type: 'error',
    //           confirmButtonColor: '#04383c',
    //         });
    //       } else if (event.target.files[0].size > 1024 * 1024) {
    //         swal({
    //           title: 'عملیات انجام نشد!',
    //           text: 'حجم عکس انتخابی نباید بیشتر از ۱ مگابایت باشد.',
    //           type: 'error',
    //           confirmButtonColor: '#04383c',
    //         });
    //       } else {
    //         const x = reader.result;
    //         const n = x.search(';base64,');
    //         that.image.extension = '.' + x.substring(11, n);
    //         that.image.imageData = x.substring(n + 8, x.length);
    //         that.image.imageShow = x;
    //         if (that.image.imageStatus === ImageStatus.SAVED_IMAGE || that.image.imageStatus === ImageStatus.DELETE_IMAGE) {
    //           that.image.imageStatus = ImageStatus.UPDATE_IMAGE;
    //         } else if (that.image.imageStatus === ImageStatus.WITHOUT_IMAGE) {
    //           that.image.imageStatus = ImageStatus.NEW_IMAGE;
    //         }
    //         that.returnPhoto.emit(that.image);
    //       }
    //
    //     };
    //   }
    // }, 1000);


  }

  deleteImage() {
    // this.image = new Image();
    if (!isNullOrUndefined(this.image.path)) {
      this.image.imageStatus = ImageStatus.DELETE_IMAGE;
    } else {
      this.image.imageStatus = ImageStatus.WITHOUT_IMAGE;
    }
    this.returnPhoto.emit(this.image);
  }

  setMultipleImage(event) {
    // if (event.target.files.length > 0) {
    //   // alert(event.target.files.length);
    //   if (event.target.files.length > (this.limitationCount)) {
    //     swal({
    //       type: 'warning',
    //       title: 'تعداد فایل نباید بیشتر از ' + this.limitationCount + ' باشد',
    //       confirmButtonText: 'نایید!'
    //     });
    //     return;
    //   }
    //   for (let i = 0; i < event.target.files.length; i++) {
    //     // alert(i);
    //     if (!this.limit) {
    //       const reader = new FileReader();
    //       reader.readAsDataURL(event.target.files[i]);
    //       const that = this;
    //       reader.onload = function () {
    //         if (!isNullOrUndefined(that.fileType) && event.target.files[i].type !== that.fileType) {
    //           swal({
    //             title: 'عملیات انجام نشد!',
    //             text: 'فرمت عکس انتخابی صحیح نیست.',
    //             type: 'error',
    //             confirmButtonColor: '#04383c',
    //           });
    //         } else if (that.fileType == null && event.target.files[i].type !== 'image/jpeg'
    //           && event.target.files[i].type !== 'image/jpg' && event.target.files[i].type !== 'image/png') {
    //           swal({
    //             title: 'عملیات انجام نشد!',
    //             text: 'فرمت عکس انتخابی صحیح نیست.',
    //             type: 'error',
    //             confirmButtonColor: '#04383c',
    //           });
    //         } else if (event.target.files[i].size > 1024 * 1024) {
    //           swal({
    //             title: 'عملیات انجام نشد!',
    //             text: 'حجم عکس انتخابی نباید بیشتر از ۱ مگابایت باشد.',
    //             type: 'error',
    //             confirmButtonColor: '#04383c',
    //           });
    //         } else {
    //           const x = reader.result;
    //           const n = x.search(';base64,');
    //           const image = new Image2();
    //           image.extension = '.' + x.substring(11, n);
    //           image.imageData = x.substring(n + 8, x.length);
    //           image.imageShow = x;
    //           if (image.imageStatus === ImageStatus.SAVED_IMAGE || image.imageStatus === ImageStatus.DELETE_IMAGE) {
    //             image.imageStatus = ImageStatus.UPDATE_IMAGE;
    //           } else if (image.imageStatus === ImageStatus.WITHOUT_IMAGE) {
    //             image.imageStatus = ImageStatus.NEW_IMAGE;
    //           }
    //           that.imageList.push(image);
    //         }
    //         if (i + 1 == event.target.files.length) {
    //           that.returnPhoto.emit(that.imageList);
    //         }
    //       };
    //     } else {
    //       if (this.imageList.length <= this.limitationCount - 1) {
    //         const reader = new FileReader();
    //         reader.readAsDataURL(event.target.files[i]);
    //         const that = this;
    //         reader.onload = function () {
    //           if (!isNullOrUndefined(that.fileType) && event.target.files[i].type !== that.fileType) {
    //             swal({
    //               title: 'عملیات انجام نشد!',
    //               text: 'فرمت عکس انتخابی صحیح نیست.',
    //               type: 'error',
    //               confirmButtonColor: '#04383c',
    //             });
    //           } else if (that.fileType == null && event.target.files[i].type !== 'image/jpeg'
    //             && event.target.files[i].type !== 'image/jpg' && event.target.files[i].type !== 'image/png') {
    //             swal({
    //               title: 'عملیات انجام نشد!',
    //               text: 'فرمت عکس انتخابی صحیح نیست.',
    //               type: 'error',
    //               confirmButtonColor: '#04383c',
    //             });
    //           } else if (event.target.files[i].size > 1024 * 1024) {
    //             swal({
    //               title: 'عملیات انجام نشد!',
    //               text: 'حجم عکس انتخابی نباید بیشتر از ۱ مگابایت باشد.',
    //               type: 'error',
    //               confirmButtonColor: '#04383c',
    //             });
    //           } else {
    //             const x = reader.result;
    //             const n = x.search(';base64,');
    //             const image = new Image2();
    //             image.extension = '.' + x.substring(11, n);
    //             image.imageData = x.substring(n + 8, x.length);
    //             image.imageShow = x;
    //             if (image.imageStatus === ImageStatus.SAVED_IMAGE || image.imageStatus === ImageStatus.DELETE_IMAGE) {
    //               image.imageStatus = ImageStatus.UPDATE_IMAGE;
    //             } else if (image.imageStatus === ImageStatus.WITHOUT_IMAGE) {
    //               image.imageStatus = ImageStatus.NEW_IMAGE;
    //             }
    //             that.imageList.push(image);
    //           }
    //           if (i + 1 == event.target.files.length) {
    //             that.returnPhoto.emit(that.imageList);
    //           }
    //         };
    //       } else {
    //         swal({
    //           type: 'warning',
    //           title: 'تعداد فایل نباید بیشتر از ' + this.limitationCount + ' باشد',
    //           confirmButtonText: 'نایید!'
    //         });
    //       }
    //     }
    //   }
    //
    //
    // }
  }

  deleteImageFormList(index) {
    if (!isNullOrUndefined(this.imageList[index].id)) {
      this.imageList.splice(index, 1);
      this.returnPhoto.emit(this.imageList);
    } else {
      this.imageList[index].imageStatus = ImageStatus.DELETE_IMAGE;
      this.returnPhoto.emit(this.imageList);
    }
  }
}
