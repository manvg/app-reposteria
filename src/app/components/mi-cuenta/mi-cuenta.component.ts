import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { FooterComponent } from '../footer/footer.component';
import { CarritoComponent } from '../carrito/carrito.component';
//import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { Usuario } from '../../models/usuario.models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StorageService } from '../../services/storage/storage.service';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * @description
 * Este componente permite gestionar la cuenta del usuario, incluyendo la edición de datos personales y el cambio de contraseña.
 */
@Component({
  selector: 'app-mi-cuenta',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MenuComponent, FooterComponent, CarritoComponent],
  templateUrl: './mi-cuenta.component.html',
  styleUrl: './mi-cuenta.component.scss'
})
export class MiCuentaComponent implements OnInit {
  /**
   * @description
   * Formulario de datos personales del usuario
   */
  miCuentaForm!: FormGroup;

  /**
   * @description
   * Formulario para cambiar la contraseña del usuario
   */
  cambiarContrasenaForm!: FormGroup;

  /**
   * @description
   * Bandera que indica si el formulario de datos personales ha sido enviado
   */
  enviadoDatosPersonales = false;

  /**
   * @description
   * Bandera que indica si el formulario de cambiar contraseña ha sido enviado
   */
  enviadoCambiarContrasena = false;

  /**
   * @description
   * Bandera para controlar la visibilidad del carrito de compras
   */
  carritoVisible: boolean = false;

  /**
   * @ignore
   */
  constructor(private fb: FormBuilder, private storageService: StorageService, private router: Router, private snackBar: MatSnackBar) { }

  /**
   * @description
   * Inicializa el componente y configura los formularios
   */
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

  /**
   * @description
   * Alterna la visibilidad del carrito de compras
   */
  toggleCarrito() {
    this.carritoVisible = !this.carritoVisible;
  }

  /**
   * @description
   * Cierra el carrito de compras
   */
  closeCarrito() {
    this.carritoVisible = false;
  }
/**
   * @description
   * Guarda los datos personales del usuario si el formulario es válido
   */
async onGuardarDatosPersonales(): Promise<void> {
  this.enviadoDatosPersonales = true;
  if (this.miCuentaForm.valid) {
    const usuarioActivo: Usuario | null = await this.storageService.obtenerUsuarioActivo();
    if (usuarioActivo) {
      // Actualizar datos del usuario
      usuarioActivo.nombre = this.miCuentaForm.get('nombre')!.value;
      usuarioActivo.apellidos = this.miCuentaForm.get('apellidos')!.value;
      usuarioActivo.fechaNacimiento = this.miCuentaForm.get('fechaNacimiento')!.value;
      usuarioActivo.direccion = this.miCuentaForm.get('direccion')!.value;
      usuarioActivo.telefono = this.miCuentaForm.get('telefono')!.value;

      await this.storageService.setItem('usuarioActivo', JSON.stringify(usuarioActivo));

      const usuarios = await this.storageService.obtenerUsuarios();
      const index = usuarios.findIndex(user => user.email === usuarioActivo.email);
      if (index !== -1) {
        usuarios[index] = usuarioActivo;
        await this.storageService.setItem('usuarios', JSON.stringify(usuarios));
      }
      this.enviadoDatosPersonales = false;

      this.snackBar.open('Éxito | Datos actualizados correctamente.', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
    } else {
      this.snackBar.open('Error | No se encontró el usuario activo.', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
    }
  } else {
    this.miCuentaForm.markAllAsTouched();
  }
}

/**
 * @description
 * Guarda la nueva contraseña del usuario si el formulario es válido
 */
async onGuardarNuevaContrasena(): Promise<void> {
  this.enviadoCambiarContrasena = true;
  if (this.cambiarContrasenaForm.valid) {
    const usuarioActivo: Usuario | null = await this.storageService.obtenerUsuarioActivo();
    if (usuarioActivo) {
      const contrasenaActual = this.cambiarContrasenaForm.get('contrasenaActual')!.value;
      const nuevaContrasena = this.cambiarContrasenaForm.get('nuevaContrasena')!.value;

      // Valida contraseña actual
      if (contrasenaActual !== usuarioActivo.contrasena) {
        this.snackBar.open('Error | La contraseña actual ingresada es incorrecta.', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
        return;
      }
      // Validar que la nueva contraseña no sea igual a la contraseña actual
      if (nuevaContrasena === usuarioActivo.contrasena) {
        this.snackBar.open('Error | La nueva contraseña debe ser distinta a la actual.', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
        return;
      }

      // Actualizar contraseña
      usuarioActivo.contrasena = nuevaContrasena;

      await this.storageService.setItem('usuarioActivo', JSON.stringify(usuarioActivo));

      const usuarios = await this.storageService.obtenerUsuarios();
      const index = usuarios.findIndex(user => user.email === usuarioActivo.email);
      if (index !== -1) {
        usuarios[index] = usuarioActivo;
        await this.storageService.setItem('usuarios', JSON.stringify(usuarios));
      }

      this.enviadoCambiarContrasena = false;
      this.cambiarContrasenaForm.reset();

      this.snackBar.open('Éxito | Contraseña actualizada correctamente.', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
    } else {
      this.snackBar.open('Error | No se encontró el usuario.', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
    }
  }
}

/**
 * @description
 * Obtiene los datos del usuario activo y los carga en los formularios
 */
async obtenerDatosUsuario(): Promise<void> {
  const usuarioActivo: Usuario | null = await this.storageService.obtenerUsuarioActivo();
  if (usuarioActivo) {
    // Cargar campos en Editar Datos Personales
    this.miCuentaForm.patchValue({
      nombre: usuarioActivo.nombre,
      apellidos: usuarioActivo.apellidos,
      direccion: usuarioActivo.direccion,
      telefono: usuarioActivo.telefono,
      fechaNacimiento: usuarioActivo.fechaNacimiento
    });
    // Cambiar Contraseña
    this.cambiarContrasenaForm.patchValue({
      contrasenaActual: '',
      nuevaContrasena: ''
    });
  } else {
    await this.storageService.cerrarSesion();
    this.router.navigate(['/index']);
  }
}

/**
 * @description
 * Alterna la visualización entre el formulario de datos personales y el formulario de cambiar contraseña
 * @param formulario - El formulario a mostrar ('datos-personales' o 'cambiar-contrasena')
 */
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
/**
 * @description
 * Obtiene el mensaje de error para un control específico
 * @param control - El control del formulario
 * @returns El mensaje de error correspondiente
 */
getErrorMessage(control: AbstractControl | null): string {
  if (control?.errors) {
    if (control.errors['required']) {
      return 'Este campo es obligatorio.';
    }
  }
  return '';
}

//#region Validación contraseña
/**
 * @description
 * Valida que la contraseña cumpla con los requisitos de longitud, mayúsculas y números
 * @returns ValidatorFn
 */
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

    return Object.keys(errors).length ? errors : null;
  };
}

/**
 * @description
 * Valida que la contraseña actual ingresada sea correcta
 * @returns AsyncValidatorFn
 */
validarContrasenaActual(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const contrasenaActual = control.value;
    if (!contrasenaActual) {
      return new Observable(observer => {
        observer.next(null);
        observer.complete();
      });
    }

    return from(this.storageService.obtenerUsuarioActivo()).pipe(
      map(usuarioActivo => {
        const errors: ValidationErrors = {};
        if (usuarioActivo && contrasenaActual !== usuarioActivo.contrasena) {
          errors['validarContrasenaActual'] = 'Contraseña actual incorrecta.';
        }
        return Object.keys(errors).length ? errors : null;
      })
    );
  };
}
//#endregion

//#region Validación edad
/**
 * @description
 * Calcula la edad basada en la fecha de nacimiento
 * @param fechaNacimiento - La fecha de nacimiento
 * @returns La edad calculada
 */
calcularEdad(fechaNacimiento: Date): number {
  const hoy = new Date();
  let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  const mes = hoy.getMonth() - fechaNacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
    edad--;
  }
  return edad;
}

/**
 * @description
 * Valida que la edad del usuario sea mayor o igual a la edad mínima
 * @param edadMinima - La edad mínima permitida
 * @returns ValidatorFn
 */
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
/**
 * @description
 * Valida que solo se ingresen letras en el campo
 * @returns ValidatorFn
 */
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

/**
 * @description
 * Valida que solo se ingresen caracteres alfanuméricos en el campo
 * @returns ValidatorFn
 */
alphanumericoValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const regex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s-]+$/;
    if (control.value && !regex.test(control.value)) {
      control.setValue(control.value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s-]/g, ''));
      return { alphanumerico: 'Sólo se permiten caracteres alfanuméricos' };
    }
    return null;
  };
}

/**
 * @description
 * Valida que solo se ingresen números en el campo
 * @returns ValidatorFn
 */
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
