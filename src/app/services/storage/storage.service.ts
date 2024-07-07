import { Injectable } from '@angular/core';
import { Database, ref, get, set, remove, child } from '@angular/fire/database';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from '../../models/usuario.models';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private usuarioActualSubject: BehaviorSubject<Usuario | null>;
  public usuarioActual$;

  constructor(private db: Database, private router: Router) {
    this.usuarioActualSubject = new BehaviorSubject<Usuario | null>(null);
    this.usuarioActual$ = this.usuarioActualSubject.asObservable();
    this.inicializarUsuarioActivo();
  }

  getJsonData(): Observable<any> {
    const dbRef = ref(this.db);
    return from(get(child(dbRef, 'productos'))).pipe(
      map(snapshot => {
        if (snapshot.exists()) {
          return snapshot.val();
        } else {
          return [];
        }
      })
    );
  }

  private async inicializarUsuarioActivo(): Promise<void> {
    const usuarioActivo = await this.getItem('usuarioActivo');
    if (usuarioActivo) {
      this.usuarioActualSubject.next(JSON.parse(usuarioActivo));
    }
  }

  async getItem(key: string): Promise<string | null> {
    const dbRef = ref(this.db);
    const snapshot = await get(child(dbRef, key));
    if (snapshot.exists()) {
      return JSON.stringify(snapshot.val());
    } else {
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    const dbRef = ref(this.db, key);
    await set(dbRef, JSON.parse(value));
  }

  async removeItem(key: string): Promise<void> {
    const dbRef = ref(this.db, key);
    await remove(dbRef);
  }

  async crearUsuarioAdminPorDefecto(): Promise<void> {
    const usuarios: Usuario[] = JSON.parse(await this.getItem('usuarios') || '[]');
    if (!usuarios || usuarios.length === 0) {
      const usuarioAdmin: Usuario = {
        nombre: 'admin',
        apellidos: 'admin',
        fechaNacimiento: new Date('1900-01-01'),
        direccion: 'admin',
        telefono: 999999999,
        email: 'admin@gmail.com',
        contrasena: '1234',
        perfil: 'administrador'
      };

      const usuariosArray: Usuario[] = [usuarioAdmin];
      await this.setItem('usuarios', JSON.stringify(usuariosArray));
      console.log('Usuario administrador por defecto creado');
    }
  }

  async listarUsuarios(): Promise<void> {
    const usuariosGuardadosStr = await this.getItem('usuarios');
    console.log('usuariosGuardadosStr:', usuariosGuardadosStr);

    const usuariosGuardados: Usuario[] = usuariosGuardadosStr ? JSON.parse(usuariosGuardadosStr) : [];
    console.log('usuariosGuardados:', usuariosGuardados);

    if (usuariosGuardados.length === 0) {
      console.log('No users found, creating default admin user.');
      await this.crearUsuarioAdminPorDefecto();
    } else {
      usuariosGuardados.forEach(element => {
        if (element) {
          console.log('storage.service.ts => listarUsuarios() => ' + element.email + ' | ' + element.contrasena);
        } else {
          console.log('Null element found in usuariosGuardados:', element);
        }
      });
    }
  }

  async obtenerUsuarios(): Promise<Usuario[]> {
    const listaUsuariosStr = await this.getItem('usuarios');
    let listaUsuarios: Usuario[] = [];
    if (listaUsuariosStr) {
      listaUsuarios = JSON.parse(listaUsuariosStr).filter((user: Usuario | null) => user !== null);
    }
    return listaUsuarios;
  }

  async obtenerUsuarioPorEmail(email: string): Promise<Usuario | null> {
    const listaUsuarios = await this.obtenerUsuarios();
    const usuarioLogin = listaUsuarios.find(user => user.email === email);
    return usuarioLogin ? usuarioLogin : null;
  }

  async eliminarUsuario(email: string): Promise<void> {
    let usuarios = await this.obtenerUsuarios();
    usuarios = usuarios.filter(usuario => usuario.email !== email);
    await this.setItem('usuarios', JSON.stringify(usuarios));
  }

  async actualizarUsuario(usuarioActualizado: Usuario): Promise<void> {
    let usuarios = await this.obtenerUsuarios();
    const index = usuarios.findIndex(usuario => usuario.email === usuarioActualizado.email);
    if (index !== -1) {
      usuarios[index] = usuarioActualizado;
      await this.setItem('usuarios', JSON.stringify(usuarios));
    }
  }

  async iniciarSesion(usuario: Usuario): Promise<void> {
    await this.setItem('sesionActiva', 'true');
    await this.setItem('usuarioActivo', JSON.stringify(usuario));
    this.usuarioActualSubject.next(usuario);
    console.log("storage.service.ts => FIN => iniciarSesion " + usuario.email);
  }

  async cerrarSesion(): Promise<void> {
    await this.removeItem('sesionActiva');
    await this.removeItem('usuarioActivo');
    this.usuarioActualSubject.next(null);
    console.log("storage.service.ts => FIN => cerrarSesion");
    this.router.navigate(['/login']);
  }

  get usuarioActual(): Usuario | null {
    return this.usuarioActualSubject.value;
  }

  async obtenerUsuarioActivo(): Promise<Usuario | null> {
    const usuarioActivo = await this.getItem('usuarioActivo');
    return usuarioActivo ? JSON.parse(usuarioActivo) : null;
  }
}
