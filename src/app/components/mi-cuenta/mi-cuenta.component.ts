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
  imports: [CommonModule, RouterModule,ReactiveFormsModule, MenuComponent, FooterComponent, CarritoComponent],
  templateUrl: './mi-cuenta.component.html',
  styleUrl: './mi-cuenta.component.scss'
})
export class MiCuentaComponent {
  miCuentaForm!: FormGroup;
  cambiarContrasenaForm!: FormGroup;
  enviado = false;
  carritoVisible: boolean = false;

  constructor(private fb: FormBuilder, private localStorageService: LocalStorageService, private router: Router) {}

  ngOnInit(): void {
    this.miCuentaForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.maxLength(9), this.soloNumerosValidator()]],
      fechaNacimiento: ['', {validators: [Validators.required, this.validarEdad(18)], updateOn: 'change'}],
    });

    this.cambiarContrasenaForm = this.fb.group({
      contrasenaActual: ['', [Validators.required]],
      nuevaContrasena: ['', [Validators.required, Validators.maxLength(18), this.validarContraseña()]]
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
    this.enviado = true;
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

        alert('Datos personales actualizados correctamente.');
      } else {
        alert('No se encontró el usuario activo.');
      }
    } else {
      this.miCuentaForm.markAllAsTouched();
    }
  }

  onGuardarNuevaContrasena(): void {
    if (this.cambiarContrasenaForm.valid) {
      const usuarioActivo: Usuario | null = this.localStorageService.obtenerUsuarioActivo();
      if (usuarioActivo) {
        //Valida contraseña actual
        const contrasenaActual = this.cambiarContrasenaForm.get('contrasenaActual')!.value;

        if(contrasenaActual !== usuarioActivo.contrasena){
          alert('La contraseña actual ingresada es incorrecta.');
          return;
        }
        //Actualizar contraseña
        const nuevaContrasena = this.cambiarContrasenaForm.get('nuevaContrasena')!.value;

        usuarioActivo.contrasena = nuevaContrasena;

        this.localStorageService.setItem('usuarioActivo', JSON.stringify(usuarioActivo));

        const usuarios = this.localStorageService.obtenerUsuarios();
        const index = usuarios.findIndex(user => user.email === usuarioActivo.email);
        if (index !== -1) {
          usuarios[index] = usuarioActivo;
          this.localStorageService.setItem('usuarios', JSON.stringify(usuarios));
        }

        alert('Contraseña actualizada correctamente.');
      } else {
        alert('No se encontró el usuario.');
      }
    } else {
      this.cambiarContrasenaForm.markAllAsTouched();
    }
  }

  obtenerDatosUsuario(): void{
    const usuarioActivo: Usuario | null = this.localStorageService.obtenerUsuarioActivo();
    if(usuarioActivo){
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
    }else{
      alert('No existe un usuario activo. Cerrando sesión...');
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
          return { menorEdad: true };
        }
        return null;
      };
    }
    //#endregion
}
