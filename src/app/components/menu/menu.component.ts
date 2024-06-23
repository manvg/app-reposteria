import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarritoService } from '../../services/carrito/carrito.service';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { Usuario } from '../../models/usuario.models';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  @Output() carritoClicked = new EventEmitter<void>();
  contadorCarrito: number = 0;
  usuarioActual: Usuario | null = null;

  constructor(private carritoService: CarritoService, private localStorageService: LocalStorageService) {}

  ngOnInit() {
    this.carritoService.contadorCarrito$.subscribe(contador => {
      this.contadorCarrito = contador;
    });
    this.localStorageService.usuarioActual$.subscribe(usuario => {
      this.usuarioActual = usuario;
    });
  }

  onCarritoClick() {
    this.carritoClicked.emit();
  }

  cerrarSesion() {
    this.localStorageService.cerrarSesion();
  }
}
