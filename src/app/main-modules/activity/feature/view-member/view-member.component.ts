// import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
// import {isNullOrUndefined} from 'util';
// import {ActivityBaseComponent} from '../shared/activity-base-component';
// import {GATE_WAY_URL} from '../../../../shared/profile/gateway-config-url';
// import {Post} from '../../model/post/post';
// import {UserService} from '../../../reporting/endpoint/user.service';
// import {untilDestroyed} from '../../../../shared/util-modules/helpers/take-until-destroy';
// import {CreateMemberDto} from '../../model/createMemberDto';
//
// @Component({
//   selector: 'app-view-member',
//   templateUrl: './view-member.component.html',
//   styleUrls: ['./view-member.component.scss']
// })
// export class ViewMemberComponent extends ActivityBaseComponent implements OnInit, OnDestroy {
//
//   url = GATE_WAY_URL;
//   userId: string;
//   public user: CreateMemberDto = {
//     post: {} as Post
//   } as CreateMemberDto;
//
//   constructor(
//     injector: Injector,
//     private userService: UserService) {
//     super(injector);
//     // this.user['contact'] = {mobilePhone: []} as any as Contact;
//   }
//
//   ngOnInit() {
//     this.route.params.pipe(untilDestroyed(this))
//       .subscribe(param => {
//         this.userId = param.id;
//         if (!isNullOrUndefined(this.userId)) {
//           this.userService.getOneEmployee(this.userId)
//             .pipe(untilDestroyed(this))
//             .subscribe((res: any) => {
//               this.user = res;
//               this.user.userId = this.userId;
//             });
//         }
//       });
//   }
// }
