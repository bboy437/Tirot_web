import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineDailyLogComponent } from './machine-daily-log.component';

describe('MachineDailyLogComponent', () => {
  let component: MachineDailyLogComponent;
  let fixture: ComponentFixture<MachineDailyLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineDailyLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineDailyLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
