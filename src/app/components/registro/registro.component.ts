import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { FooterComponent } from '../footer/footer.component';
import { CarritoComponent } from '../carrito/carrito.component';
import { CarritoService } from '../../services/carrito.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Usuario } from '../../models/usuario.models';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuComponent, FooterComponent, CarritoComponent, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {
  formRegistro!: FormGroup;
  arrayUsuarios: Usuario[] = [];
  enviado = false;
  carritoVisible: boolean = false;

  constructor(private carritoService: CarritoService, private fb: FormBuilder) {}

  toggleCarrito() {
    this.carritoVisible = !this.carritoVisible;
  }

  closeCarrito() {
    this.carritoVisible = false;
  }

  ngOnInit(): void {
    this.formRegistro = this.fb.group({
      nombre: ['', {validators: [Validators.required, this.soloLetrasValidator()], updateOn: 'change'}],
      apellidos: ['', {validators: [Validators.required, this.soloLetrasValidator()], updateOn: 'change'}],
      fechaNacimiento: ['', {validators: [Validators.required, this.validarEdad(18)], updateOn: 'change'}],
      direccion: ['', {validators: [this.alphanumericoValidator()], updateOn: 'change'}],
      telefono: ['', {validators: [Validators.required, this.soloNumerosValidator()], updateOn: 'change'}],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', {validators: [Validators.required, this.validarContraseña()],updateOn: 'change'}],
      confirmarContrasena: ['', Validators.required]
    }, { validators: this.validarIgualdadContraseña });
  }

  formularioRegistro() {
    this.enviado = true;
    if (this.formRegistro.valid) {
      const nuevoUsuario: Usuario = {
        nombre: this.formRegistro.get('nombre')!.value,
        apellidos: this.formRegistro.get('apellidos')!.value,
        fechaNacimiento: this.formRegistro.get('fechaNacimiento')!.value,
        direccion: this.formRegistro.get('direccion')!.value,
        telefono: this.formRegistro.get('telefono')!.value,
        email: this.formRegistro.get('correo')!.value,
        contrasena: this.formRegistro.get('contrasena')!.value,
        perfil: 'cliente'
      };
      console.log('Cantidad de usuarios ANTES de guardar => ' + this.arrayUsuarios.length);
      this.arrayUsuarios.push(nuevoUsuario);
      this.formRegistro.reset();
      this.enviado = false;

      alert('Se guardó correctamente el usuario');

      console.log('Cantidad de usuarios DESPUÉS de guardar => ' + this.arrayUsuarios.length);
    }
  }

  limpiarFormulario() {
    this.formRegistro.patchValue({
      nombre: '',
      apellidos: '',
      direccion: '',
      fechaNacimiento: '',
      correo: '',
      contrasena: '',
      confirmarContrasena: ''
    });
  }

  //#region Validación contraseña
  validarIgualdadContraseña(form: FormGroup): ValidationErrors | null {
    const contrasena = form.get('contrasena')!.value;
    const confirmarContrasena = form.get('confirmarContrasena')!.value;

    if (contrasena && confirmarContrasena && contrasena !== confirmarContrasena) {
      return { contrasenasDistintas: true };
    }
    return null;
  }

  validarContraseña(): ValidatorFn {
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
        return { menorEdad: true };
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
}
