import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {FormCategory} from '../../../fb-model/form/form-category';
import {ActivatedRoute, Router} from '@angular/router';
import {FormCategoryService} from '../../../fb-service/formCategory.service';

import {Location} from '@angular/common';
import {DataService} from '../../../../../shared/service/data.service';
import {DefaultNotify} from '@angular-boot/util';

@Component({
  selector: 'app-add-form-category',
  templateUrl: './add-form-category.component.html',
  styleUrls: ['./add-form-category.component.css']
})
export class AddFormCategoryComponent implements OnInit {

  @Input() showBackButton = true;
  form: FormGroup;
  formCategory: FormCategory = new FormCategory();
  formCategoryList: Array<FormCategory>;
  hide = false;
  actionButton = false;
  categoryId = '';
  titleField = 'افزودن فرم های سازمانی';

  constructor(fb: FormBuilder,
              private location: Location,
              private router: Router,
              private route: ActivatedRoute,
              private categoryService: FormCategoryService,
              private dataService: DataService) {
    this.form = fb.group({
      title: new FormControl(null, Validators.required),
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params.categoryId;
      this.categoryId = id;
      if (this.categoryId) {
        this.titleField = 'ویرایش فرم های سازمانی';
        this.categoryService.getOne(this.categoryId).subscribe((res: FormCategory) => {
          this.formCategory = res;
        });
      }
    });
  }

  save(formValue) {
    this.actionButton = true;
    let newCategory: FormCategory = new FormCategory();
    newCategory.title = formValue.title;
    if (this.categoryId) {
      newCategory = this.formCategory;
      newCategory.title = formValue.title;
      this.categoryService.update(newCategory).subscribe(res => {
        if (res) {
          DefaultNotify.notifySuccess('ویرایش با موفقیت انجام شد.');
          this.locationBack();
        }
      });
    } else {
      this.categoryService.create(newCategory).subscribe((res: FormCategory) => {
        if (res) {
          this.actionButton = false;
          this.dataService.changeAddCategoryValue(res);
          DefaultNotify.notifySuccess('عملیات با موفقیت انجام شد.');
          formValue.title = '';
          if (this.showBackButton) {
            this.locationBack();
          }
        }
      });
    }
  }

  locationBack() {
    this.location.back();
  }
}
