import {Component, OnInit} from '@angular/core';
import {FormCategoryService} from '../../../fb-service/formCategory.service';
import {FormCategory} from '../../../fb-model/form/form-category';
import {Title} from '@angular/platform-browser';
import {Toolkit} from '../../../shared/utility/toolkit';
import {DefaultNotify} from '@angular-boot/util';

@Component({
  selector: 'app-form-category-list',
  templateUrl: './form-category-list.component.html',
  styleUrls: ['./form-category-list.component.css']
})
export class FormCategoryListComponent implements OnInit {

  categoryList: Array<FormCategory> = [];
  MyToolkit = Toolkit;
  showLoader = true;

  constructor(private categoryService: FormCategoryService, private titleService: Title) {
  }

  ngOnInit() {
    this.titleService.setTitle('فرم های سازمانی');
    this.getAll();
  }

  getAll() {
    this.categoryService.getAll().subscribe((res: FormCategory[]) => {
      this.showLoader = false;
      this.categoryList = res;
    });
  }


  deleteCategory(category, index) {
    const self = this;
    if (confirm('دسته بندی' + category.title + 'حذف شود؟')) {
      self.categoryService.delete(category.id).subscribe(res => {
        if (res) {
          self.categoryList.splice(index, 1);
          DefaultNotify.notifySuccess('عملیات با موفقیت انجام شد.');
        }
      }, err => {
        DefaultNotify.notifyDanger('عملیات انجام نشد دوباره تلاش کنید.');
      });
    }


  }

  // PostListComponent

  tableFilter() {
    // Declare variables
    let inputCategory;
    let filterCategory;
    let table;
    let tr;
    let td1;
    let i;
    inputCategory = document.getElementById('receiverCategoryNameFilterInput');

    filterCategory = inputCategory.value.toUpperCase();

    table = document.getElementById('categoryListTable');
    tr = table.getElementsByTagName('tr');

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      td1 = tr[i].getElementsByTagName('td')[1];

      if (td1) {
        if (td1.innerHTML.toUpperCase().indexOf(filterCategory) > -1
        ) {
          tr[i].style.display = '';
        } else {
          tr[i].style.display = 'none';
        }
      }
    }
  }

}
