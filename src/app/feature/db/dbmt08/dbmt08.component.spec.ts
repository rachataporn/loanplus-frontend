import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Dbmt08Component } from './dbmt08.component';

describe('Dbmt08Component', () => {
  let component: Dbmt08Component;
  let fixture: ComponentFixture<Dbmt08Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Dbmt08Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Dbmt08Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
