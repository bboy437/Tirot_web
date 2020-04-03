import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardDetailComponent } from './standard-detail.component';

describe('StandardDetailComponent', () => {
  let component: StandardDetailComponent;
  let fixture: ComponentFixture<StandardDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StandardDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
