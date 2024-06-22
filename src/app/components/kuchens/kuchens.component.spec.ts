import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KuchensComponent } from './kuchens.component';

describe('KuchensComponent', () => {
  let component: KuchensComponent;
  let fixture: ComponentFixture<KuchensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KuchensComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KuchensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
