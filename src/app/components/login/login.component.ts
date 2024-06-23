import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { FooterComponent } from '../footer/footer.component';
import { CarritoComponent } from '../carrito/carrito.component';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MenuComponent, FooterComponent, CarritoComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  formLogin!: FormGroup;
  enviado = false;
  loginError = '';
  carritoVisible: boolean = false;
  titulo: string = 'Iniciar Sesión';

  constructor(private fb: FormBuilder, private router: Router, private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    this.formLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required]]
    });
    this.listarUsuariosGuardados();
  }

  toggleCarrito() {
    this.carritoVisible = !this.carritoVisible;
  }

  closeCarrito() {
    this.carritoVisible = false;
  }

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
          this.router.navigate(['/index']);
        } else {
          this.router.navigate(['/mi-cuenta']);
        }
      } else {
        this.loginError = 'Correo o contraseña incorrectos';
      }
    }
  }

  listarUsuariosGuardados() {
    this.localStorageService.listarUsuarios();
  }
}
