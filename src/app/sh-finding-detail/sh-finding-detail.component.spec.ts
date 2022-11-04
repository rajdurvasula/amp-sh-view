import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShFindingDetailComponent } from './sh-finding-detail.component';

describe('ShFindingDetailComponent', () => {
  let component: ShFindingDetailComponent;
  let fixture: ComponentFixture<ShFindingDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShFindingDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShFindingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
