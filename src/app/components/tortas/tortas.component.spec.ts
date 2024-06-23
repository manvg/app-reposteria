import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TortasComponent } from './tortas.component';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('TortasComponent', () => {
  let component: TortasComponent;
  let fixture: ComponentFixture<TortasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterModule, TortasComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            snapshot: {
              paramMap: {
                get: () => null
              }
            }
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TortasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('El componente TORTAS se crea correctamente', () => {
    expect(component).toBeTruthy();
  });
});
