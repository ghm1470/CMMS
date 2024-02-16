import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCompletForHistoryComponent } from './form-complet-for-history.component';

describe('FormCompletForHistoryComponent', () => {
  let component: FormCompletForHistoryComponent;
  let fixture: ComponentFixture<FormCompletForHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCompletForHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCompletForHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
