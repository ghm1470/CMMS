// /**
//  * Created by Zar on 7/15/2017.
//  */
//
// import {Component, Input, Output, EventEmitter, Renderer2, OnInit} from '@angular/core';
// import {FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
// import swal from 'sweetalert2';
// import {QuestionEmitterHelper} from '../../../../../fb-model/helper/questionEmitterHelper';
// import {StarRating} from '../../../../../fb-model/element/star-rating';
// import {Form} from '../../../../../fb-model/form/form';
// import {LanguageService} from '../../../../../shared/language-data-service/language.service';
// import {CacheService} from '../../../../../shared/cache-service/cache.service';
// import {CacheType} from '../../../../../shared/cache-service/cache-type.enum';
// import {FORM} from '../../../../../fb-model/constants/storage-keys';
// import {FormService} from '../../../../../fb-service/form.service';
// import {ImageUploadClass} from '../../../../../shared/model/file/fileUploadClass';
// import {Image} from '../../../../../shared/model/Image';
// import {ImageStatus} from '../../../../../shared/model/ImageStatus';
// import {Toolkit} from "../../../../../shared/utility/toolkit";
//
// @Component({
//   selector: 'StarRatingEdit',
//   templateUrl: './starRatingEdit.component.html'
// })
//
// export class StarRatingEditComponent implements OnInit {
//
//   @Input() editingItem: QuestionEmitterHelper;
//   @Output() onUpdate = new EventEmitter();
//
//   starRatingForm: FormGroup;
//   starRating = new StarRating();
//   form = new Form();
//   data: any = null;
//   saveButton = false;
//   MyImageStatus = ImageStatus;
//
//   constructor(fb: FormBuilder,
//               private formService: FormService,
//               private cacheService: CacheService,
//               private languageDataService: LanguageService,
//               renderer: Renderer2) {
//     this.starRatingForm = fb.group({
//       label: new FormControl(null, Validators.required),
//       helpText: new FormControl(null, Validators.required),
//       count: new FormControl(null, [Validators.required, Validators.pattern('([1-9]|1[01])')]),
//       initialRate: new FormControl(null, [Validators.required, Validators.pattern('([0-9]|1[01])')]),
//       id: false,
//       required: false,
//     });
//     languageDataService.renderer = renderer;
//   }
//
//   ngOnInit() {
//     this.languageDataService.getLanguageData().subscribe(res => {
//       this.data = res;
//     });
//     this.starRating = JSON.parse(JSON.stringify(this.editingItem.item));
//     this.cacheService.getItem(FORM, CacheType.SESSION_STORAGE).subscribe(res => {
//       this.form = res;
//     });
//   }
//
//   save() {
//     this.saveButton = true;
//     if (this.starRatingForm.controls['count'].valid && this.starRatingForm.controls['initialRate'].valid
//       && this.starRating.label != '' && this.starRating.helpText != '') {
//       this.form.elementList[this.editingItem.index] = this.starRating;
//       this.saveOnStorage();
//       this.onUpdate.emit(true);
//     }
//   }
//
//   close() {
//     if (this.editingItem.newElement) {
//       this.form.elementList.splice(this.editingItem.index, 1);
//       this.saveOnStorage();
//       this.onUpdate.emit(null);
//     } else if (!this.editingItem.newElement) {
//       if (confirm(this.data.publicMessage.deleteMessage)) {
//         this.form.elementList[this.editingItem.index] = this.editingItem.item;
//         this.saveOnStorage();
//         this.onUpdate.emit(true);
//         }
//     }
//   }
//
//   settingQuestionImage(event) {
//     const setPicture = new ImageUploadClass(this.formService);
//     setPicture.setPicture(event, this.starRating.picture).subscribe((res: Image) => {
//       if (res != null) {
//         this.starRating.picture = res;
//         this.form.elementList[this.editingItem.index] = this.starRating;
//         this.saveOnStorage();
//       }
//     });
//   }
//
//   deleteQuestionImage() {
//     const setPicture = new ImageUploadClass(this.formService);
//     setPicture.deletePicture(this.starRating.picture).subscribe((res: Image) => {
//       if (res != null) {
//         this.starRating.picture = res;
//         this.form.elementList[this.editingItem.index] = this.starRating;
//         this.saveOnStorage();
//       }
//     });
//   }
//
//   onChangeStatus(value) {
//     this.starRating.colorStatus = value;
//   }
//
//   onChangeDirection(value) {
//     this.starRating.direction = value;
//   }
//
//   changeStarCount(value) {
//     this.starRating.starCount = +Toolkit.Fa2En(value);
//     if (value < this.starRating.initialRate) {
//       this.starRating.initialRate = value;
//     }
//   }
//
//   setInitial(value) {
//     this.starRating.initialRate = +Toolkit.Fa2En(value);
//     if (value > this.starRating.starCount) {
//       this.starRating.initialRate = this.starRating.starCount;
//     }
//   }
//
//   changeLabel(value) {
//     this.starRating.label = value;
//   }
//
//   changeHelpText(value) {
//     this.starRating.helpText = value;
//   }
//
//   saveOnStorage() {
//     this.cacheService.setItem(FORM, this.form, CacheType.SESSION_STORAGE);
//   }
// }
