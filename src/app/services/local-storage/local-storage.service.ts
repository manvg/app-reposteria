import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from '../../models/usuario.models';
import { Router } from '@angular/router';

/**
 * @description
 * Servicio para gestionar el almacenamiento local y la autenticación de usuarios.
 */
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  /**
   * @description
   * Fuente de datos para el usuario actualmente autenticado.
   */
  private usuarioActualSubject: BehaviorSubject<Usuario | null>;

  /**
   * @description
   * Observable para el usuario actualmente autenticado.
   */
  public usuarioActual$;

  /**
   * @ignore
   */
  constructor(private router: Router) {
    const usuarioActivo = this.getItem('usuarioActivo');
    const usuario = usuarioActivo ? JSON.parse(usuarioActivo) : null;
    this.usuarioActualSubject = new BehaviorSubject<Usuario | null>(usuario);
    this.usuarioActual$ = this.usuarioActualSubject.asObservable();
  }

  //#region Métodos generales
  /**
   * @description
   * Obtiene un ítem del almacenamiento local.
   * @param key - La clave del ítem a obtener
   * @returns El valor del ítem o null si no existe
   */
  getItem(key: string): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  }

  /**
   * @description
   * Guarda un ítem en el almacenamiento local.
   * @param key - La clave del ítem a guardar
   * @param value - El valor del ítem a guardar
   */
  setItem(key: string, value: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    }
  }

  /**
   * @description
   * Elimina un ítem del almacenamiento local.
   * @param key - La clave del ítem a eliminar
   */
  removeItem(key: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
    }
  }
  //#endregion

  //#region Usuarios
  /**
   * @description
   * Crea un usuario administrador por defecto si no existen usuarios en el almacenamiento local.
   */
  crearUsuarioAdminPorDefecto(): void {
    const usuarios: Usuario[] = JSON.parse(this.getItem('usuarios') || '[]');
    if (!usuarios) {
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

      const usuarios: Usuario[] = [usuarioAdmin];
      this.setItem('usuarios', JSON.stringify(usuarios));
      console.log('Usuario administrador por defecto creado');
    }
  }

  /**
   * @description
   * Lista los usuarios almacenados en el almacenamiento local.
   */
  listarUsuarios(): void {
    const usuariosGuardados: Usuario[] = JSON.parse(this.getItem('usuarios') || '[]');
    if (!usuariosGuardados) {
      this.crearUsuarioAdminPorDefecto();
    } else {
      usuariosGuardados.forEach(element => {
        console.log('local-storage.service.ts => listarUsuarios() => ' + element.email + ' | ' + element.contrasena);
      });
    }
  }

  /**
   * @description
   * Obtiene la lista de usuarios almacenados en el almacenamiento local.
   * @returns La lista de usuarios
   */
  obtenerUsuarios(): Usuario[] {
    const listaUsuarios = this.getItem('usuarios');
    if (listaUsuarios) {
      return JSON.parse(listaUsuarios);
    }
    return [];
  }

  /**
   * @description
   * Obtiene un usuario por su correo electrónico.
   * @param email - El correo electrónico del usuario a obtener
   * @returns El usuario si existe, null en caso contrario
   */
  obtenerUsuarioPorEmail(email: string): Usuario | null {
    const listaUsuarios = this.obtenerUsuarios();
    const usuarioLogin = listaUsuarios.find(user => user.email === email);
    return usuarioLogin ? usuarioLogin : null;
  }

  eliminarUsuario(email: string): void {
    let usuarios = this.obtenerUsuarios();
    usuarios = usuarios.filter(usuario => usuario.email !== email);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }
  actualizarUsuario(usuarioActualizado: Usuario): void {
    let usuarios = this.obtenerUsuarios();
    const index = usuarios.findIndex(usuario => usuario.email === usuarioActualizado.email);
    if (index !== -1) {
      usuarios[index] = usuarioActualizado;
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
  }
  //#endregion

  //#region Login

  /**
   * @description
   * Inicia sesión del usuario.
   * @param usuario - El objeto Usuario con las propiedades nombre, apellidos, direccion, fechaNacimiento, telefono, email, contrasena, perfil
   */
  iniciarSesion(usuario: Usuario) {
    this.setItem('sesionActiva', 'true');
    this.setItem('usuarioActivo', JSON.stringify(usuario));
    this.usuarioActualSubject.next(usuario);
    console.log("local-storage.service.ts => FIN => iniciarSesion " + usuario.email);
  }

  /**
   * @description
   * Cierra la sesión del usuario actual.
   */
  cerrarSesion() {
    this.removeItem('sesionActiva');
    this.removeItem('usuarioActivo');
    this.usuarioActualSubject.next(null);
    console.log("local-storage.service.ts => FIN => cerrarSesion");
    this.router.navigate(['/login']);
  }

  /**
   * @description
   * Obtiene el usuario actualmente autenticado.
   * @returns El usuario actualmente autenticado o null si no hay ningún usuario autenticado
   */
  get usuarioActual(): Usuario | null {
    return this.usuarioActualSubject.value;
  }

  /**
   * @description
   * Obtiene el usuario actualmente activo del almacenamiento local.
   * @returns El usuario actualmente activo o null si no hay ningún usuario activo
   */
  obtenerUsuarioActivo(): Usuario | null {
    const usuarioActivo = this.getItem('usuarioActivo');
    return usuarioActivo ? JSON.parse(usuarioActivo) : null;
  }
  //#endregion
}
