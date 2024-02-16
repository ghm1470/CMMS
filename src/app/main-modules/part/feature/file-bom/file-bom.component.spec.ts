import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileBomComponent } from './file-bom.component';

describe('FileBomComponent', () => {
  let component: FileBomComponent;
  let fixture: ComponentFixture<FileBomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileBomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileBomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
