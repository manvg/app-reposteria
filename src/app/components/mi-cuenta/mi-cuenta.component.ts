import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { FooterComponent } from '../footer/footer.component';
import { CarritoComponent } from '../carrito/carrito.component';
import { Usuario } from '../../models/usuario.models';
@Component({
  selector: 'app-mi-cuenta',
  standalone: true,
  imports: [CommonModule, RouterModule,ReactiveFormsModule, MenuComponent, FooterComponent, CarritoComponent],
  templateUrl: './mi-cuenta.component.html',
  styleUrl: './mi-cuenta.component.scss'
})
export class MiCuentaComponent {
  miCuentaForm!: FormGroup;
  cambiarContrasenaForm!: FormGroup;
  enviado = false;
  carritoVisible: boolean = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.miCuentaForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.maxLength(9), this.soloNumerosValidator()]]
    });

    this.cambiarContrasenaForm = this.fb.group({
      contrasenaActual: ['', [Validators.required]],
      nuevaContrasena: ['', [Validators.required, Validators.maxLength(18), this.validarContraseña()]]
    });
  }

  toggleCarrito() {
    this.carritoVisible = !this.carritoVisible;
  }

  closeCarrito() {
    this.carritoVisible = false;
  }

  onGuardarDatosPersonales(): void {
    if (this.miCuentaForm.valid) {
      // Lógica para guardar datos personales
      alert('Datos personales guardados correctamente.');
    } else {
      this.miCuentaForm.markAllAsTouched();
    }
  }

  onGuardarNuevaContrasena(): void {
    if (this.cambiarContrasenaForm.valid) {
      //Guardar cambiode contraseña
    } else {
      this.cambiarContrasenaForm.markAllAsTouched();
    }
  }

  toggleFormulario(formulario: string): void {
    const formularioDatosPersonales = document.getElementById('formulario-datos-personales');
    const formularioCambiarContrasena = document.getElementById('formulario-cambiar-contrasena');
    if (formulario === 'datos-personales') {
      formularioDatosPersonales!.style.display = 'block';
      formularioCambiarContrasena!.style.display = 'none';
      //Obtener datos de la persona y llenar los campos...
    } else if (formulario === 'cambiar-contrasena') {
      formularioDatosPersonales!.style.display = 'none';
      formularioCambiarContrasena!.style.display = 'block';
      //Mostrar los campos vacios...
    }
  }

  soloNumerosValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const regex = /^[0-9]+$/;
      if (control.value && !regex.test(control.value)) {
        return { soloNumeros: 'Sólo se permiten números' };
      }
      return null;
    };
  }

  validarContraseña(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const contrasena = control.value;
      if (!contrasena) {
        return null;
      }

      const errors: ValidationErrors = {};
      if (contrasena.length < 6 || contrasena.length > 18) {
        errors['length'] = 'Largo entre 6 y 18 caracteres';
      }
      if (!/[A-Z]/.test(contrasena)) {
        errors['uppercase'] = 'Debe contener al menos una letra mayúscula';
      }
      if (!/\d/.test(contrasena)) {
        errors['number'] = 'Debe contener al menos un número';
      }

      return Object.keys(errors).length ? errors : null;
    };
  }
}
