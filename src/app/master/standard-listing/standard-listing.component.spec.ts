import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardListingComponent } from './standard-listing.component';

describe('StandardListingComponent', () => {
  let component: StandardListingComponent;
  let fixture: ComponentFixture<StandardListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StandardListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
