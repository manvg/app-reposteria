import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { FooterComponent } from '../footer/footer.component';
import { CarritoComponent } from '../carrito/carrito.component';
import { StorageService } from '../../services/storage/storage.service';
import { Usuario } from '../../models/usuario.models';

/**
 * @description
 * Componente de login que permite a los usuarios autenticarse en la aplicación.
 * Este componente incluye un formulario reactivo con validaciones para los campos
 * de correo electrónico y contraseña, y maneja la lógica de autenticación utilizando
 * un servicio de almacenamiento.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MenuComponent, FooterComponent, CarritoComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  /**
   * @description
   * Formulario de login
   */
  formLogin!: FormGroup;

  /**
   * @description
   * Bandera que indica si el formulario ha sido enviado
   */
  enviado = false;

  /**
   * @description
   * Mensaje de error en caso de que las credenciales sean incorrectas
   */
  loginError = '';

  /**
   * @description
   * Bandera para controlar la visibilidad del carrito de compras
   */
  carritoVisible: boolean = false;

  /**
   * @description
   * Título del componente
   */
  titulo: string = 'Iniciar Sesión';

  /**
   * @ignore
   */
  constructor(private fb: FormBuilder, private router: Router, private storageService: StorageService) { }

  /**
   * @description
   * Inicializa el componente y configura el formulario de login
   */
  ngOnInit(): void {
    this.formLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required]]
    });
    this.listarUsuariosGuardados();
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
   * Maneja el proceso de inicio de sesión, validando las credenciales
   * y redirigiendo al usuario según su perfil
   */
  async iniciarSesion() {
    console.log('Comienza inicio sesión...');
    this.enviado = true;
    if (this.formLogin.valid) {
      const email = this.formLogin.get('email')!.value;
      const contrasena = this.formLogin.get('contrasena')!.value;

      try {
        // Validar credenciales contra usuario de Firebase Realtime Database
        const usuarios = await this.storageService.obtenerUsuarios();
        if (usuarios) {
          console.log('Usuarios obtenidos:', usuarios);
          const usuarioLogin = usuarios.find(user => user && user.email === email && user.contrasena === contrasena);
          if (usuarioLogin) {
            console.log('Usuario encontrado:', usuarioLogin);
            await this.storageService.iniciarSesion(usuarioLogin);
            console.log('Iniciando sesión con usuario', usuarioLogin.email);

            if (usuarioLogin.perfil === 'admin') {
              this.router.navigate(['/dashboard']);
            } else {
              this.router.navigate(['/mi-cuenta']);
            }
          } else {
            this.loginError = 'Correo o contraseña incorrectos';
          }
        } else {
          this.loginError = 'No se pudieron obtener los usuarios';
        }
      } catch (error) {
        console.error('Error durante el inicio de sesión:', error);
        this.loginError = 'Hubo un error durante el inicio de sesión. Por favor, inténtelo de nuevo más tarde.';
      }
    }
  }

  /**
   * @description
   * Lista los usuarios guardados en el servicio de almacenamiento
   */
  listarUsuariosGuardados() {
    this.storageService.listarUsuarios();
  }
}
