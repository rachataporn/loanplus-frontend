import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Dbmt07Component } from './dbmt07.component';

describe('Dbmt07Component', () => {
  let component: Dbmt07Component;
  let fixture: ComponentFixture<Dbmt07Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Dbmt07Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Dbmt07Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
