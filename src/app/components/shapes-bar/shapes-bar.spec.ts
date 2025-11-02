import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapesBar } from './shapes-bar';

describe('ShapesBar', () => {
  let component: ShapesBar;
  let fixture: ComponentFixture<ShapesBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShapesBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShapesBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
