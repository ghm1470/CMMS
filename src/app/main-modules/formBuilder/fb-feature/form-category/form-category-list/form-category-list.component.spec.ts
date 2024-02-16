import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCategoryListComponent } from './form-category-list.component';

describe('FormCategoryListComponent', () => {
  let component: FormCategoryListComponent;
  let fixture: ComponentFixture<FormCategoryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCategoryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
