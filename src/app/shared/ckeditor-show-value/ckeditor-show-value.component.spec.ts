import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CkeditorShowValueComponent } from './ckeditor-show-value.component';

describe('CkeditorShowValueComponent', () => {
  let component: CkeditorShowValueComponent;
  let fixture: ComponentFixture<CkeditorShowValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CkeditorShowValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CkeditorShowValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
