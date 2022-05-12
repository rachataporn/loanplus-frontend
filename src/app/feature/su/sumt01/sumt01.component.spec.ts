import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Sumt01Component } from './sumt01.component';

describe('Sumt01Component', () => {
  let component: Sumt01Component;
  let fixture: ComponentFixture<Sumt01Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Sumt01Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Sumt01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
