import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuneDetail } from './rune-detail';

describe('RuneDetail', () => {
  let component: RuneDetail;
  let fixture: ComponentFixture<RuneDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RuneDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RuneDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
