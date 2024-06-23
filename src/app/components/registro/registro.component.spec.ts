import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroComponent } from './registro.component';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { CarritoService } from '../../services/carrito/carrito.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('RegistroComponent', () => {
  let component: RegistroComponent;
  let fixture: ComponentFixture<RegistroComponent>;

  let mockLocalStorageService = {
    getItem: jasmine.createSpy('getItem').and.returnValue(null),
    setItem: jasmine.createSpy('setItem'),
    usuarioActual$: of(null),
    cerrarSesion: jasmine.createSpy('cerrarSesion')
  };

  let mockCarritoService = {
    contadorCarrito$: of(0),
    productos$: of([]),
    precioTotal$: of(0),
    actualizarProductos: jasmine.createSpy('actualizarProductos'),
    actualizarPrecioTotal: jasmine.createSpy('actualizarPrecioTotal'),
    actualizarContador: jasmine.createSpy('actualizarContador')
  };

  RegistroComponent
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterModule, RegistroComponent],
      providers: [
        {provide: ActivatedRoute,useValue: { params: of({}),snapshot: {paramMap: { get: () => null}}}},
        {provide: LocalStorageService, useValue: mockLocalStorageService },
        {provide: CarritoService, useValue: mockCarritoService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('El componente REGISTRO se crea correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('Formulario inválido cuando está vacío', () => {
    expect(component.formRegistro.valid).toBeFalsy();
  });

  it('Campo nombre es inválido cuando está vacío', () => {
    const nombre = component.formRegistro.controls['nombre'];
    expect(nombre.valid).toBeFalsy();
    expect(nombre.errors!['required']).toBeTruthy();
  });

  it('Debe validar la edad mínima correctamente', () => {
    const fechaNacimiento = component.formRegistro.controls['fechaNacimiento'];
    fechaNacimiento.setValue('2020-01-01');
    expect(fechaNacimiento.valid).toBeFalsy();
    expect(fechaNacimiento.errors!['menorEdad']).toBeTruthy();
  });

  it('Debe validar que las contraseñas coincidan', () => {
    component.formRegistro.controls['contrasena'].setValue('Prueba123');
    component.formRegistro.controls['confirmarContrasena'].setValue('Test321');
    expect(component.formRegistro.errors!['contrasenasDistintas']).toBeTruthy();
  });

  it('Debe limpiar el formulario correctamente', () => {
    component.limpiarFormulario();
    expect(component.formRegistro.controls['nombre'].value).toBe('');
    expect(component.formRegistro.controls['apellidos'].value).toBe('');
    expect(component.formRegistro.controls['direccion'].value).toBe('');
    expect(component.formRegistro.controls['fechaNacimiento'].value).toBe('');
    expect(component.formRegistro.controls['correo'].value).toBe('');
    expect(component.formRegistro.controls['contrasena'].value).toBe('');
    expect(component.formRegistro.controls['confirmarContrasena'].value).toBe('');
  });

    it('Debe agregar un nuevo usuario si el formulario es válido', () => {
    component.formRegistro.controls['nombre'].setValue('Manuel');
    component.formRegistro.controls['apellidos'].setValue('Valdés');
    component.formRegistro.controls['fechaNacimiento'].setValue('2022-01-01');
    component.formRegistro.controls['direccion'].setValue('Dirección de prueba');
    component.formRegistro.controls['telefono'].setValue('987654321');
    component.formRegistro.controls['correo'].setValue('mvaldesg@gmail.com');
    component.formRegistro.controls['contrasena'].setValue('Manuel123');
    component.formRegistro.controls['confirmarContrasena'].setValue('Manuel123');

    component.formularioRegistro();

    expect(mockLocalStorageService.setItem).toHaveBeenCalled();
    expect(component.arrayUsuarios.length).toBe(1);
  });
});
