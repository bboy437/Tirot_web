import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineMachineHistoryStatusComponent } from './timeline-machine-history-status.component';

describe('TimelineMachineHistoryStatusComponent', () => {
  let component: TimelineMachineHistoryStatusComponent;
  let fixture: ComponentFixture<TimelineMachineHistoryStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimelineMachineHistoryStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineMachineHistoryStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
