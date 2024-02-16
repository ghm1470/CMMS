import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarrantyForExamActionComponent } from './warranty-for-exam-action.component';

describe('WarrantyForExamActionComponent', () => {
  let component: WarrantyForExamActionComponent;
  let fixture: ComponentFixture<WarrantyForExamActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarrantyForExamActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarrantyForExamActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
