import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineHistoryStatusComponent } from './machine-history-status.component';

describe('MachineHistoryStatusComponent', () => {
  let component: MachineHistoryStatusComponent;
  let fixture: ComponentFixture<MachineHistoryStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineHistoryStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineHistoryStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
