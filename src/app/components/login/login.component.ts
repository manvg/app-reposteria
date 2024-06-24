import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { FooterComponent } from '../footer/footer.component';
import { CarritoComponent } from '../carrito/carrito.component';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';

/**
 * @description
 * Componente de login que permite a los usuarios autenticarse en la aplicación.
 * Este componente incluye un formulario reactivo con validaciones para los campos
 * de correo electrónico y contraseña, y maneja la lógica de autenticación utilizando
 * un servicio de almacenamiento local.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MenuComponent, FooterComponent, CarritoComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
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
  constructor(private fb: FormBuilder, private router: Router, private localStorageService: LocalStorageService) { }

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
  iniciarSesion() {
    console.log('Comienza inicio sesión...');
    this.enviado = true;
    if (this.formLogin.valid) {
      const email = this.formLogin.get('email')!.value;
      const contrasena = this.formLogin.get('contrasena')!.value;

      // Validar credenciales contra usuario de localStorage
      const usuarios = this.localStorageService.obtenerUsuarios();
      const usuarioLogin = usuarios.find(user => user.email === email && user.contrasena === contrasena);

      console.log('iniciarSesion => usuarioLogin => ' + usuarioLogin?.email);

      if (usuarioLogin) {
        this.localStorageService.iniciarSesion(usuarioLogin);
        console.log('Iniciando sesión con usuario ' + usuarioLogin.email);

        if (usuarioLogin.perfil === 'admin') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/mi-cuenta']);
        }
      } else {
        this.loginError = 'Correo o contraseña incorrectos';
      }
    }
  }

  /**
   * @description
   * Lista los usuarios guardados en el servicio de almacenamiento local
   */
  listarUsuariosGuardados() {
    this.localStorageService.listarUsuarios();
  }
}
