import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmCancelorderDialogComponent } from './confirm-cancelorder-dialog.component';

describe('ConfirmCancelorderDialogComponent', () => {
  let component: ConfirmCancelorderDialogComponent;
  let fixture: ComponentFixture<ConfirmCancelorderDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmCancelorderDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmCancelorderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
