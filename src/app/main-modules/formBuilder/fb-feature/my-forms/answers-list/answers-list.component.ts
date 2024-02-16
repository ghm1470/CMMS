import {Component, OnInit} from '@angular/core';
// import {ActivatedRoute, Router} from '@angular/router';
// import {FormDataService} from '../../../fb-service/form-data.service';
// import {FormData} from '../../../fb-model/form/form-data';
// import {ResourceRequest} from '../../../shared/model/rest/request/resource-request.model';
// import {AccountService} from '../../../shared/account-service/account.service';
// import {User} from '../../../shared/model/user/user.model';
// import {ImageUploadClass} from '../../../shared/model/file/fileUploadClass';
// import {UploadService} from '../../../shared/services/upload-service/upload.service';
// import {FormService} from '../../../fb-service/form.service';
// import {Form} from '../../../fb-model/form/form';
// import {StaticFormElement} from '../../../fb-model/constants/staticForm';
// import {LanguageService} from '../../../shared/language-data-service/language.service';

@Component({
  selector: 'app-answers-list',
  templateUrl: './answers-list.component.html',
  styleUrls: ['./answers-list.component.css']
})
export class AnswersListComponent implements OnInit {
  // formId: string;
  // formDataList: Array<FormData> = [];
  // idList: Array<string> = [];
  // personList: Array<User> = [];
  // personImage: Array<User> = [];
  // data: any = null;
  //
  // constructor(private route: ActivatedRoute,
  //             private languageDataService: LanguageService,
  //             private formDataService: FormDataService,
  //             private accountService: AccountService,
  //             private uploadService: UploadService,
  //             private formService: FormService) {}
  //
  ngOnInit() {}
  //   this.languageDataService.getLanguageData().subscribe(res => {
  //     this.data = res;
  //   });
  //   this.route.params.subscribe(params => {
  //     this.formId = params['formId'];
  //     this.formDataService.getOne(this.formId).subscribe((resFormData: Array<FormData>) => {
  //       this.formDataList = [];
  //       this.formDataList = resFormData;
  //       for (const item of this.formDataList) {
  //         this.idList.push(item.creatorId);
  //       }
  //       this.accountService.getUsersInfo(this.idList).subscribe((resUser: Array<User>) => {
  //         this.personList = [];
  //         this.personList = resUser;
  //
  //         for (let i = 0; i < this.personList.length; i++) {
  //           if (this.personList[i].photo != null) {
  //             const imageUpload = new ImageUploadClass(this.uploadService);
  //             imageUpload.getPicture(this.personList[i].photo.id).subscribe(res => {
  //               if (res != null) {
  //                 this.createImageFromBlob(res, i);
  //               }
  //             });
  //           }
  //         }
  //
  //       });
  //     });
  //     this.formService.getOne(this.formId).subscribe((resForm: Form) => {
  //       StaticFormElement.elements = resForm[0].elementList;
  //       StaticFormElement.isSet = true;
  //     });
  //   });
  // }
  //
  // createImageFromBlob(image: Blob, index) {
  //   const reader = new FileReader();
  //   reader.readAsDataURL(image);
  //   const that = this;
  //   reader.onloadend = function () {
  //     let imageToShow = reader.result;
  //     imageToShow = imageToShow.replace('text/xml', 'image/jpeg');
  //     that.personList[index].webPhoto = imageToShow;
  //   };
  // }
  //

}
