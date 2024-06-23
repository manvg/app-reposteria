import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { FooterComponent } from '../footer/footer.component';
import { CarritoComponent } from '../carrito/carrito.component';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { Usuario } from '../../models/usuario.models';
@Component({
  selector: 'app-mi-cuenta',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MenuComponent, FooterComponent, CarritoComponent],
  templateUrl: './mi-cuenta.component.html',
  styleUrl: './mi-cuenta.component.scss'
})
export class MiCuentaComponent {
  miCuentaForm!: FormGroup;
  cambiarContrasenaForm!: FormGroup;
  enviadoDatosPersonales = false;
  enviadoCambiarContrasena = false;
  carritoVisible: boolean = false;

  constructor(private fb: FormBuilder, private localStorageService: LocalStorageService, private router: Router) { }

  ngOnInit(): void {
    this.miCuentaForm = this.fb.group({
      nombre: ['', { validators: [Validators.required, this.soloLetrasValidator()], updateOn: 'change' }],
      apellidos: ['', { validators: [Validators.required, this.soloLetrasValidator()], updateOn: 'change' }],
      fechaNacimiento: ['', { validators: [Validators.required, this.validarEdad(18)], updateOn: 'change' }],
      direccion: ['', { validators: [this.alphanumericoValidator()], updateOn: 'change' }],
      telefono: ['', { validators: [Validators.required, this.soloNumerosValidator()], updateOn: 'change' }]
    });

    this.cambiarContrasenaForm = this.fb.group({
      contrasenaActual: ['', [Validators.required, this.validarContrasenaActual()]],
      nuevaContrasena: ['', { validators: [Validators.required, this.validarContrasena()], updateOn: 'change' }]
    });

    this.obtenerDatosUsuario();
  }

  toggleCarrito() {
    this.carritoVisible = !this.carritoVisible;
  }

  closeCarrito() {
    this.carritoVisible = false;
  }

  onGuardarDatosPersonales(): void {
    this.enviadoDatosPersonales = true;
    if (this.miCuentaForm.valid) {
      const usuarioActivo: Usuario | null = this.localStorageService.obtenerUsuarioActivo();
      if (usuarioActivo) {
        //Actualizar datos usuario
        usuarioActivo.nombre = this.miCuentaForm.get('nombre')!.value;
        usuarioActivo.apellidos = this.miCuentaForm.get('apellidos')!.value;
        usuarioActivo.fechaNacimiento = this.miCuentaForm.get('fechaNacimiento')!.value;
        usuarioActivo.direccion = this.miCuentaForm.get('direccion')!.value;
        usuarioActivo.telefono = this.miCuentaForm.get('telefono')!.value;

        this.localStorageService.setItem('usuarioActivo', JSON.stringify(usuarioActivo));

        const usuarios = this.localStorageService.obtenerUsuarios();
        const index = usuarios.findIndex(user => user.email === usuarioActivo.email);
        if (index !== -1) {
          usuarios[index] = usuarioActivo;
          this.localStorageService.setItem('usuarios', JSON.stringify(usuarios));
        }
        this.enviadoDatosPersonales = false;
        alert('Datos personales actualizados correctamente.');
      } else {
        alert('No se encontró el usuario activo.');
      }
    } else {
      this.miCuentaForm.markAllAsTouched();
    }
  }

  onGuardarNuevaContrasena(): void {
    this.enviadoCambiarContrasena = true;
    if (this.cambiarContrasenaForm.valid) {
      const usuarioActivo: Usuario | null = this.localStorageService.obtenerUsuarioActivo();
      if (usuarioActivo) {
        const contrasenaActual = this.cambiarContrasenaForm.get('contrasenaActual')!.value;
        const nuevaContrasena = this.cambiarContrasenaForm.get('nuevaContrasena')!.value;

        //Valida contraseña actual
        if (contrasenaActual !== usuarioActivo.contrasena) {
          alert('La contraseña actual ingresada es incorrecta.');
          return;
        }
        //Validar que la nueva contraseña no sea igual a la contraseña actual
        if (nuevaContrasena === usuarioActivo.contrasena) {
          alert('La nueva contraseña debe ser distinta a la actual.');
          return;
        }

        //Actualizar contraseña
        usuarioActivo.contrasena = nuevaContrasena;

        this.localStorageService.setItem('usuarioActivo', JSON.stringify(usuarioActivo));

        const usuarios = this.localStorageService.obtenerUsuarios();
        const index = usuarios.findIndex(user => user.email === usuarioActivo.email);
        if (index !== -1) {
          usuarios[index] = usuarioActivo;
          this.localStorageService.setItem('usuarios', JSON.stringify(usuarios));
        }

        this.enviadoCambiarContrasena = false;
        this.cambiarContrasenaForm.reset();

        alert('Contraseña actualizada correctamente.');

      } else {
        alert('No se encontró el usuario.');
      }
    }
  }

  obtenerDatosUsuario(): void {
    const usuarioActivo: Usuario | null = this.localStorageService.obtenerUsuarioActivo();
    if (usuarioActivo) {
      //Cargar campos en Editar Datos Personales
      this.miCuentaForm.patchValue({
        nombre: usuarioActivo.nombre,
        apellidos: usuarioActivo.apellidos,
        direccion: usuarioActivo.direccion,
        telefono: usuarioActivo.telefono,
        fechaNacimiento: usuarioActivo.fechaNacimiento
      });
      //Cambiar Contraseña
      this.cambiarContrasenaForm.patchValue({
        contrasenaActual: '',
        nuevaContrasena: ''
      });
    } else {
      this.localStorageService.cerrarSesion();
      this.router.navigate(['/index']);
    }
  }

  toggleFormulario(formulario: string): void {
    const formularioDatosPersonales = document.getElementById('formulario-datos-personales');
    const formularioCambiarContrasena = document.getElementById('formulario-cambiar-contrasena');
    if (formulario === 'datos-personales') {
      formularioDatosPersonales!.style.display = 'block';
      formularioCambiarContrasena!.style.display = 'none';
    } else if (formulario === 'cambiar-contrasena') {
      formularioDatosPersonales!.style.display = 'none';
      formularioCambiarContrasena!.style.display = 'block';
    }
  }

  //#region Validaciones
  getErrorMessage(control: AbstractControl | null): string {
    if (control?.errors) {
      if (control.errors['required']) {
        return 'Este campo es obligatorio.';
      }
    }
    return '';
  }

  //#region Validación contraseña
  validarContrasena(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const contrasena = control.value;
      if (!contrasena) {
        return null; // Si no hay contraseña, no validar
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

      const usuarioActivo: Usuario | null = this.localStorageService.obtenerUsuarioActivo();
      if (usuarioActivo) {
        if (contrasena === usuarioActivo.contrasena) {
          errors['contrasenaRepetida'] = 'La nueva contraseña debe ser distinta a la actual.';
        }
      }
      return Object.keys(errors).length ? errors : null;
    };
  }

  validarContrasenaActual(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const contrasenaActual = control.value;
      if (!contrasenaActual) {
        return null; // Si no hay contraseña, no validar
      }
      const usuarioActivo: Usuario | null = this.localStorageService.obtenerUsuarioActivo();
      const errors: ValidationErrors = {};

      if (usuarioActivo) {
        if (contrasenaActual !== usuarioActivo.contrasena) {
          errors['validarContrasenaActual'] = 'Contraseña actual incorrecta.';
        }
      }

      return Object.keys(errors).length ? errors : null;
    };
  }
  //#endregion

  //#region Validación edad
  calcularEdad(fechaNacimiento: Date): number {
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }
    return edad;
  }

  validarEdad(edadMinima: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const fechaNacimiento = control.value;
      if (!fechaNacimiento) {
        return null;
      }

      const edad = this.calcularEdad(new Date(fechaNacimiento));
      if (edad < edadMinima) {
        return { menorEdad: 'Debes ser mayor de 18 años.' };
      }
      return null;
    };
  }
  //#endregion

  //#region Validaciones ingreso de texto y números
  soloLetrasValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const regex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s-]+$/;
      if (control.value && !regex.test(control.value)) {
        control.setValue(control.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s-]/g, ''));
        return { soloLetras: 'Sólo se permiten letras' };
      }
      return null;
    };
  }

  alphanumericoValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const regex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s-]+$/;
      if (control.value && !regex.test(control.value)) {
        control.setValue(control.value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s-]/g, ''))
        return { alphanumerico: 'Sólo se permiten caracteres alfanuméricos' };
      }
      return null;
    };
  }

  soloNumerosValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const regex = /^[0-9]+$/;
      if (control.value && !regex.test(control.value)) {
        control.setValue(control.value.replace(/[^0-9]/g, ''));
        return { soloNumeros: 'Sólo se permiten números' };
      }
      return null;
    };
  }
  //#endregion

  //#endregion
}
