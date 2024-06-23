import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from '../../models/usuario.models';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private usuarioActualSubject: BehaviorSubject<Usuario | null>;

  constructor() {
    const usuarioActivo = this.getItem('usuarioActivo');
    const usuario = usuarioActivo ? JSON.parse(usuarioActivo) : null;
    this.usuarioActualSubject = new BehaviorSubject<Usuario | null>(usuario);
    this.usuarioActual$ = this.usuarioActualSubject.asObservable();
  }

  public usuarioActual$;
  //#region Métodos generales
  getItem(key: string): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  }

  setItem(key: string, value: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    }
  }

  removeItem(key: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
    }
  }
  //#endregion

  //#region Usuarios
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

  listarUsuarios(): void {
    const usuariosGuardados: Usuario[] = JSON.parse(this.getItem('usuarios') || '[]')
    if (!usuariosGuardados) {
      this.crearUsuarioAdminPorDefecto();
    }else{
      usuariosGuardados.forEach(element => {
        console.log('local-storage.service.ts => listarUsuarios() => ' + element.email);
      });
    }
  }

  obtenerUsuarios(): Usuario[] {
    const listaUsuarios = this.getItem('usuarios');
    if (listaUsuarios) {
      return JSON.parse(listaUsuarios);
    }
    return [];
  }
  //#endregion

  //#region Login
  iniciarSesion(usuario: Usuario) {
    this.setItem('sesionActiva', 'true');
    this.setItem('usuarioActivo', JSON.stringify(usuario));
    this.usuarioActualSubject.next(usuario);
    console.log("local-storage.service.ts => FIN => iniciarSesion" + usuario.email);
  }

  cerrarSesion() {
    this.removeItem('sesionActiva');
    this.removeItem('usuarioActivo');
    this.usuarioActualSubject.next(null);
    console.log("local-storage.service.ts => FIN => cerrarSesion");
  }

  get usuarioActual(): Usuario | null {
    return this.usuarioActualSubject.value;
  }
  //#endregion
}
