import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserChangepasswordDialogComponent } from './user-changepassword-dialog.component';

describe('UserChangepasswordDialogComponent', () => {
  let component: UserChangepasswordDialogComponent;
  let fixture: ComponentFixture<UserChangepasswordDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserChangepasswordDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserChangepasswordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
