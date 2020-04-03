import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineCheckListDetailComponent } from './machine-check-list-detail.component';

describe('MachineCheckListDetailComponent', () => {
  let component: MachineCheckListDetailComponent;
  let fixture: ComponentFixture<MachineCheckListDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineCheckListDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineCheckListDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
