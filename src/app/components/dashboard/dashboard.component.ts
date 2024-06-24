import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { FooterComponent } from '../footer/footer.component';
import { CarritoComponent } from '../carrito/carrito.component';
import { CarritoService } from '../../services/carrito/carrito.service';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { Usuario } from '../../models/usuario.models';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog'; // Importar MatDialog
import { EditarUsuarioComponent } from '../editar-usuario/editar-usuario.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MenuComponent,
    FooterComponent,
    CarritoComponent,
    MatIconModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  carritoVisible: boolean = false;
  usuarios: Usuario[] = [];

  constructor(
    private carritoService: CarritoService,
    private localStorageService: LocalStorageService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog // Inyectar MatDialog
  ) { }

  ngOnInit() {
    this.obtenerUsuarios();
  }

  toggleCarrito() {
    this.carritoVisible = !this.carritoVisible;
  }

  closeCarrito() {
    this.carritoVisible = false;
  }

  obtenerUsuarios(): void {
    this.usuarios = this.localStorageService.obtenerUsuarios();
  }

  eliminarUsuario(email: string): void {
    this.localStorageService.eliminarUsuario(email);
    this.obtenerUsuarios();

    this.snackBar.open('Éxito | Usuario eliminado correctamente.', 'Cerrar', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
  }

  editarUsuario(usuario: Usuario): void {
    const dialogRef = this.dialog.open(EditarUsuarioComponent, {
      width: '400px',
      data: { usuario }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.localStorageService.actualizarUsuario(result);
        this.obtenerUsuarios(); // Actualizar la lista de usuarios

        this.snackBar.open('Éxito | Usuario actualizado correctamente.', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      }
    });
  }
}
