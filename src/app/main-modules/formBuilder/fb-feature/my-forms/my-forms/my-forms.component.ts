import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormService} from '../../../fb-service/form.service';
import {Router} from '@angular/router';
import {ResourceRequest} from '../../../shared/model/rest/request/resource-request.model';
import {Form} from '../../../fb-model/form/form';
import swal from 'sweetalert2';
import {LanguageService} from '../../../shared/language-data-service/language.service';
import {FormStatus} from '../../../fb-model/enumeration/form-status';

declare var $: any;

@Component({
  selector: 'app-my-forms',
  templateUrl: './my-forms.component.html',
  styleUrls: ['./my-forms.component.css']
})
export class MyFormsComponent implements OnInit, AfterViewInit {

  //
  // forms: Array<any> = [];
  // data: any = null;
  // MyFormStatus = FormStatus;
  //
  // constructor(private formService: FormService,
  //             private languageDataService: LanguageService,
  //             private router: Router) {
  // }
  //
  ngOnInit(): void {}
  //   const request = new ResourceRequest();
  //   request.addIncloud('id');
  //   request.addIncloud('title');
  //   request.addIncloud('systemCreationDate');
  //   // this.formService.get(request).subscribe((myForms: Array<Form>) => {
  //   //   if (myForms.length >= 0) {
  //   //     this.forms = myForms;
  //   //   }
  //   // });
  //   this.languageDataService.getLanguageData().subscribe(res => {
  //     this.data = res;
  //   });
  //
  // }
  //
  ngAfterViewInit(): void {}
  //   $('.rolldown-list li').each(function () {
  //     const delay = ($(this).index() / 4) + 's';
  //     $(this).css({
  //       webkitAnimationDelay: delay,
  //       mozAnimationDelay: delay,
  //       animationDelay: delay
  //     });
  //   });
  // }
  //
  // deleteForm(id: string) {
  //   // swal({
  //   //   text: 'مطمئن هستید؟',
  //   //   type: 'warning',
  //   //   showCancelButton: true,
  //   //   confirmButtonColor: '#1EE8A8',
  //   //   cancelButtonColor: '#FA207F',
  //   //   confirmButtonText: 'بله',
  //   //   cancelButtonText: 'خیر'
  //   // }).then(() => {
  //   //   this.formService.delete([id]).subscribe(deleteRes => {
  //   //     if (deleteRes > 0) {
  //   //       swal({
  //   //         title: 'حذف با موفقیت انجام شد.',
  //   //         text: '',
  //   //         type: 'success',
  //   //         confirmButtonColor: '#1EE8A8',
  //   //       });
  //   //       for (let i = 0; i < this.forms.length; i++) {
  //   //         if (this.forms[i].id === id) {
  //   //           this.forms.splice(i, 1);
  //   //         }
  //   //       }
  //   //     } else {
  //   //       swal({
  //   //         title: 'عملیات انجام نشد!',
  //   //         text: 'دوباره تلاش کنید.',
  //   //         type: 'error',
  //   //         confirmButtonColor: '#1EE8A8',
  //   //       });
  //   //     }
  //   //   });
  //   // }, (dismiss) => {
  //   // });
  // }
  //
  // editingPage(formId) {
  //   this.router.navigateByUrl('/adminMain/formCreate/' + formId);
  // }
  //

}
