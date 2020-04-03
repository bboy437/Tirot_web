import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentMachineStatusListComponent } from './current-machine-status-list.component';

describe('CurrentMachineStatusListComponent', () => {
  let component: CurrentMachineStatusListComponent;
  let fixture: ComponentFixture<CurrentMachineStatusListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentMachineStatusListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentMachineStatusListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
