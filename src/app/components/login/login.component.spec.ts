import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterModule, LoginComponent],
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

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('El componente LOGIN se crea correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('Formulario invalido cuando está vacío', () => {
    expect(component.formLogin.valid).toBeFalsy();
  });

  it('Campo email es inválido cuando está vacío', () => {
    const email = component.formLogin.controls['email'];
    expect(email.valid).toBeFalsy();
    expect(email.errors!['required']).toBeTruthy();
  });

  it('Mostrar error cuando las credenciales son incorrectas', () => {
    component.formLogin.controls['email'].setValue('prueba@invalida.cl');
    component.formLogin.controls['contrasena'].setValue('contrasenainvalida');
    component.iniciarSesion();
    expect(component.loginError).toBe('Correo o contraseña incorrectos');
  });
});
