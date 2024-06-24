import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { FooterComponent } from '../footer/footer.component';
import { CarritoComponent } from '../carrito/carrito.component';
import { CarritoService } from '../../services/carrito/carrito.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Usuario } from '../../models/usuario.models';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * @description
 * Este componente permite gestionar el formulario de registro para los usuarios
 */
@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuComponent, FooterComponent, CarritoComponent, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent implements OnInit {
  /**
   * @description
   * Formulario de registro
   */
  formRegistro!: FormGroup;

  /**
   * @description
   * Array que almacena los usuarios registrados
   */
  arrayUsuarios: Usuario[] = [];

  /**
   * @description
   * Bandera que indica si el formulario ha sido enviado
   */
  enviado = false;

  /**
   * @description
   * Bandera para controlar la visibilidad del carrito de compras
   */
  carritoVisible: boolean = false;

  /**
   * @description
   * Título del componente
   */
  titulo: string = 'Formulario de Registro';

  /**
   * @ignore
   */
  constructor(private carritoService: CarritoService, private fb: FormBuilder, private router: Router,
              private localStorageService: LocalStorageService, private snackBar: MatSnackBar) {}

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
   * Inicializa el componente y configura el formulario de registro
   */
  ngOnInit(): void {
    this.cargarUsuarios();
    this.formRegistro = this.fb.group({
      nombre: ['', {validators: [Validators.required, this.soloLetrasValidator()], updateOn: 'change'}],
      apellidos: ['', {validators: [Validators.required, this.soloLetrasValidator()], updateOn: 'change'}],
      fechaNacimiento: ['', {validators: [Validators.required, this.validarEdad(18)], updateOn: 'change'}],
      direccion: ['', {validators: [this.alphanumericoValidator()], updateOn: 'change'}],
      telefono: ['', {validators: [Validators.required, this.soloNumerosValidator(), Validators.minLength(9), Validators.maxLength(9)], updateOn: 'change'}],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', {validators: [Validators.required, this.validarContrasena()], updateOn: 'change'}],
      confirmarContrasena: ['', Validators.required]
    }, { validators: this.validarIgualdadContrasena });
  }

  /**
   * @description
   * Maneja el proceso de registro de usuario, validando los datos
   * y guardando el nuevo usuario en el almacenamiento local
   */
  formularioRegistro() {
    this.enviado = true;
    if (this.formRegistro.valid) {
      const correo = this.formRegistro.get('correo')!.value;
      if (this.validarExistenciaUsuario(correo)) {
        this.snackBar.open('Error | Ya existe un usuario con este correo electrónico.', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });

        return;
      }

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
      this.guardarUsuarios();
      this.formRegistro.reset();
      this.enviado = false;

      this.snackBar.open('Éxito | Usuario creado correctamente.', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });

      console.log('Cantidad de usuarios DESPUÉS de guardar => ' + this.arrayUsuarios.length);

      this.router.navigate(['/login']);
    }
  }

  /**
   * @description
   * Limpia los campos del formulario de registro
   */
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

  /**
   * @description
   * Guarda el array de usuarios en el almacenamiento local
   */
  guardarUsuarios() {
    this.localStorageService.setItem('usuarios', JSON.stringify(this.arrayUsuarios));
    console.log('guardarUsuarios() => ok');
  }

  /**
   * @description
   * Carga los usuarios del almacenamiento local
   */
  cargarUsuarios() {
    const usuariosGuardados = this.localStorageService.getItem('usuarios');
    if (usuariosGuardados) {
      this.arrayUsuarios = JSON.parse(usuariosGuardados);
      console.log('Se cargaron los siguientes usuarios en localStorage: ');
      this.arrayUsuarios.forEach(element => {
        console.log('Usuario ' + element.email);
      });
    } else {
      this.crearUsuarioAdmin();
    }
  }

  /**
   * @description
   * Crea un usuario administrador por defecto si no hay usuarios guardados
   */
  crearUsuarioAdmin() {
    const usuarioAdmin: Usuario = {
      nombre: 'Manuel',
      apellidos: 'Valdés Guerra',
      fechaNacimiento: new Date('1900-01-01'),
      direccion: '',
      telefono: 999999999,
      email: 'admin@gmail.com',
      contrasena: '1234',
      perfil: 'admin'
    };

    this.arrayUsuarios.push(usuarioAdmin);
    this.localStorageService.setItem('usuarios', JSON.stringify(this.arrayUsuarios));
    console.log('Usuario administrador creado');
  }

  /**
   * @description
   * Valida si un usuario con el correo proporcionado ya existe
   * @param correo - El correo a validar
   * @returns true si el usuario ya existe, false en caso contrario
   */
  validarExistenciaUsuario(correo: string): boolean {
    return this.arrayUsuarios.some(usuario => usuario.email === correo);
  }

  //#region Validación contrasena
  /**
   * @description
   * Valida que las contrasenas ingresadas sean iguales
   * @param form - El formulario a validar
   * @returns ValidationErrors o null
   */
  validarIgualdadContrasena(form: FormGroup): ValidationErrors | null {
    const contrasena = form.get('contrasena')!.value;
    const confirmarContrasena = form.get('confirmarContrasena')!.value;

    if (contrasena && confirmarContrasena && contrasena !== confirmarContrasena) {
      return { contrasenasDistintas: true };
    }
    return null;
  }

  /**
   * @description
   * Valida que la contrasena cumpla con los requisitos de longitud,
   * mayúsculas y números
   * @returns ValidatorFn
   */
  validarContrasena(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const contrasena = control.value;
      if (!contrasena) {
        return null; // Si no hay contrasena, no validar
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
        return { menorEdad: true };
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
      if (control.value && control.value.length !== 9) {
        return { longitudInvalida: 'Debe tener exactamente 9 dígitos' };
      }
      return null;
    };
  }
  //#endregion
}
