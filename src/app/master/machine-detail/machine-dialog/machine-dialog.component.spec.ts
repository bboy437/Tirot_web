import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineDialogComponent } from './machine-dialog.component';

describe('MachineDialogComponent', () => {
  let component: MachineDialogComponent;
  let fixture: ComponentFixture<MachineDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
