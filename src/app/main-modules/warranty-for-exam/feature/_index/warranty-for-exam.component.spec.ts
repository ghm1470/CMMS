import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarrantyForExamComponent } from './warranty-for-exam.component';

describe('WarrantyForExamComponent', () => {
  let component: WarrantyForExamComponent;
  let fixture: ComponentFixture<WarrantyForExamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarrantyForExamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarrantyForExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
