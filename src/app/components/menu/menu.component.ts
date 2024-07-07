import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarritoService } from '../../services/carrito/carrito.service';
import { StorageService } from '../../services/storage/storage.service';
import { Usuario } from '../../models/usuario.models';

/**
 * @description
 * Este componente representa el menú de navegación principal de la aplicación.
 */
/**
 *
 * @usageNotes
 *
 * 1. Importa este módulo en tu aplicación principal
 * 2. Añade el selector 'app-menu' al comienzo de cada módulo .html
 *
 */
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {
  /**
   * @description
   * Evento que se emite cuando se hace clic en el carrito de compras
   */
  @Output() carritoClicked = new EventEmitter<void>();

  /**
   * @description
   * Contador de productos en el carrito de compras
   */
  contadorCarrito: number = 0;

  /**
   * @description
   * Usuario actualmente autenticado
   */
  usuarioActual: Usuario | null = null;

  /**
   * @ignore
   */
  constructor(private carritoService: CarritoService, private storageService: StorageService) {}

  /**
   * @description
   * Inicializa el componente y suscribe a los observables de contador del carrito y usuario actual
   */
  ngOnInit() {
    this.carritoService.contadorCarrito$.subscribe(contador => {
      this.contadorCarrito = contador;
    });
    this.storageService.usuarioActual$.subscribe(usuario => {
      this.usuarioActual = usuario;
    });
  }

  /**
   * @description
   * Maneja el clic en el carrito de compras y emite el evento correspondiente
   */
  onCarritoClick() {
    this.carritoClicked.emit();
  }

  /**
   * @description
   * Cierra la sesión del usuario actual
   */
  async cerrarSesion() {
    await this.storageService.cerrarSesion();
  }
}
