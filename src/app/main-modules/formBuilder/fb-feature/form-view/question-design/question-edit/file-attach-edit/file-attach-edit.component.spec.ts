import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileAttachEditComponent } from './file-attach-edit.component';

describe('FileAttachEditComponent', () => {
  let component: FileAttachEditComponent;
  let fixture: ComponentFixture<FileAttachEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileAttachEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileAttachEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
