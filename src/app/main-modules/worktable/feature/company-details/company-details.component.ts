// import {Component, Input, OnInit} from '@angular/core';
// import {Post} from '../../../activity/model/post/post';
// import {AcceptationStep} from '../../../acceptation/modal/acceptation-step';
// import {ACCOUNT_SUB} from '../../../../shared/constants/cacheKey.constants';
// import {UserService} from '../../../reporting/endpoint/user.service';
// import {UserSub} from '../../../../shared/model/user-sub';
// import {AcceptationSecondStepService} from '../../../acceptation/endpoint/acceptation-secend-step.service';
// import {AcceptationThirdStepService} from '../../../acceptation/endpoint/acceptation-third-step.service';
// import {AcceptationFourthStepService} from '../../../acceptation/endpoint/acceptation-fourth-step.service';
// import {AcceptationFifthStepService} from '../../../acceptation/endpoint/acceptation-fifth-step.service';
// import {AcceptationFirstStepService} from '../../../acceptation/endpoint/acceptation-first-step.service';
// import {AcceptationSixthStepService} from '../../../acceptation/endpoint/acceptation-sixth-step.service';
//
// @Component({
//   selector: 'app-company-details',
//   templateUrl: './company-details.component.html',
//   styleUrls: ['./company-details.component.scss']
// })
// export class CompanyDetailsComponent implements OnInit {
//
//   accountForUpdate = new AcceptationStep.FirstStep();
//   secondStepForUpdate = new AcceptationStep.SecondStep();
//   thirdStep = new AcceptationStep.ThirdStep();
//   fourthStepForUpdate = new AcceptationStep.FourthStep();
//   fifthStepForUpdate = new AcceptationStep.FifthStep();
//   sixthStepForUpdate = new AcceptationStep.SixthStep();
//   accountSub: UserSub;
//   lastCertificateLevelList: any [] = [];
//   thirdStepList: AcceptationStep.ThirdStep[] = [];
//   @Input() post: Post = new Post();
//   @Input() companyId: string;
//   firstStepAllow = false;
//   secondStepAllow = false;
//   thirdStepAllow = false;
//   fourthStepAllow = false;
//   fifthStepAllow = false;
//   sixStepAllow = false;
//
//   constructor(private userService: UserService,
//               private acceptationSecondStepService: AcceptationSecondStepService,
//               private acceptationThirdStepService: AcceptationThirdStepService,
//               private acceptationFourthStepService: AcceptationFourthStepService,
//               private acceptationFifthStepService: AcceptationFifthStepService,
//               private acceptationFirstStepService: AcceptationFirstStepService,
//               private acceptationSixthStepService: AcceptationSixthStepService) {
//   }
//
//   ngOnInit() {
//     // if (this.post.firstStep) {
//       this.getAccountSub();
//     // }
//     // if (this.post.secondStep) {
//     //   this.getSecondStep();
//     // }
//     // if (this.post.thirdStep) {
//     //   this.getListMember();
//     // }
//     // if (this.post.fourthStep) {
//     //   this.getFourthStep();
//     // }
//     // if (this.post.fifthStep) {
//     //   this.getFifthStep();
//     // }
//     // if (this.post.sixthStep) {
//     //   this.getSixthStep();
//     // }
//   }
//
//   getAccountSub() {
//     sessionStorage.removeItem(ACCOUNT_SUB);
//     this.userService.getOneByCompanyId(this.companyId).subscribe((res: any) => {
//       
//       if (res) {
//         this.accountSub = res;
//         this.accountForUpdate.responsibility = this.accountSub.responsibility;
//         this.accountForUpdate.fixedPhone = this.accountSub.fixedPhone;
//         this.accountForUpdate.fullAddress = this.accountSub.fullAddress;
//         this.accountForUpdate.exchangePhone = this.accountSub.exchangePhone;
//         this.accountForUpdate.postalCode = this.accountSub.postalCode;
//         this.firstStepAllow = true;
//       }
//     });
//   }
//
//   getSecondStep() {
//     this.acceptationSecondStepService.getSecondStep(
//       {companyId: this.companyId})
//       .subscribe((res: any) => {
//         if (res.companyId) {
//           this.secondStepForUpdate = res;
//           this.secondStepAllow = true;
//         }
//       });
//   }
//
//   getListMember() {
//     this.acceptationThirdStepService.getThirdStep({companyId: this.companyId}).subscribe((res) => {
//       if (res) {
//         this.thirdStepList = res;
//         this.thirdStepAllow = true;
//       }
//     });
//   }
//
//   getFourthStep() {
//     this.acceptationFourthStepService.getFourthStep(
//       {companyId: this.companyId}).subscribe((res: any) => {
//       if (res) {
//         this.fourthStepForUpdate = res;
//         this.fourthStepAllow = true;
//       }
//     });
//   }
//
//   getFifthStep() {
//     this.acceptationFifthStepService.getFifthStep(
//       {companyId: this.companyId}).subscribe((res: any) => {
//       if (res) {
//         this.fifthStepForUpdate = res;
//         this.fifthStepAllow = true;
//       }
//     });
//   }
//
//   getSixthStep() {
//     this.acceptationSixthStepService.getSixthStep(
//       {companyId: this.companyId}).subscribe((res: any) => {
//       if (res) {
//         this.sixthStepForUpdate.motive = res;
//         this.sixStepAllow = true;
//       }
//     });
//   }
//
// }
