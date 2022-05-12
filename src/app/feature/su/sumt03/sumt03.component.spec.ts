import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Sumt03Component } from './sumt03.component';

describe('Sumt03Component', () => {
  let component: Sumt03Component;
  let fixture: ComponentFixture<Sumt03Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Sumt03Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Sumt03Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
