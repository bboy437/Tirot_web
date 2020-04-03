import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessListingComponent } from './process-listing.component';

describe('ProcessListingComponent', () => {
  let component: ProcessListingComponent;
  let fixture: ComponentFixture<ProcessListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
