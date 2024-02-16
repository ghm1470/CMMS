import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarrantyForExamListComponent } from './warranty-for-exam-list.component';

describe('WarrantyForExamListComponent', () => {
  let component: WarrantyForExamListComponent;
  let fixture: ComponentFixture<WarrantyForExamListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarrantyForExamListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarrantyForExamListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
