import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCurrentProductionComponent } from './table-current-production.component';

describe('TableCurrentProductionComponent', () => {
  let component: TableCurrentProductionComponent;
  let fixture: ComponentFixture<TableCurrentProductionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableCurrentProductionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableCurrentProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
