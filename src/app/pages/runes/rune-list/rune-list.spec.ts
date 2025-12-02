import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuneList } from './rune-list';

describe('RuneList', () => {
  let component: RuneList;
  let fixture: ComponentFixture<RuneList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RuneList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RuneList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
