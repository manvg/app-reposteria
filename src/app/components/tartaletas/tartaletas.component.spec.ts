import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TartaletasComponent } from './tartaletas.component';

describe('TartaletasComponent', () => {
  let component: TartaletasComponent;
  let fixture: ComponentFixture<TartaletasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TartaletasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TartaletasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
