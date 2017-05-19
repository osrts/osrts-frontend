import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayChooserComponent } from './day-chooser.component';

describe('DayChooserComponent', () => {
  let component: DayChooserComponent;
  let fixture: ComponentFixture<DayChooserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayChooserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
