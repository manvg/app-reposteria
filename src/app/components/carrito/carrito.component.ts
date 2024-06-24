import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CarritoService } from '../../services/carrito/carrito.service';
import { Producto } from '../../models/producto.model';
import { CommonModule, formatCurrency } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * @description
 * Este componente permite gestionar el carrito de compras.
 *
 * @usageNotes
 * 1. Importa este módulo en tu aplicación principales, específicamente en los módulos de productos.
 * 2. Añade el selector 'app-carrito' en tu plantilla para permitir el despliegue del carrito de compras al costado derecho de la pantalla.
 */
@Component({
  selector: 'app-carrito',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.scss'
})
export class CarritoComponent implements OnInit {
  /**
   * @description
   * Lista de productos en el carrito
   */
  productos: Producto[] = [];

  /**
   * @description
   * Precio total de los productos en el carrito
   */
  precioTotal: number = 0;

  /**
   * @description
   * Evento para cerrar el carrito de compras
   */
  @Output() closeCarrito = new EventEmitter<void>();

  /**
   * @ignore
   */
  constructor(private carritoService: CarritoService, private snackBar: MatSnackBar) {}

  /**
   * @description
   * Inicializa el componente y suscribe a los observables de productos y precio total
   */
  ngOnInit() {
    this.carritoService.productos$.subscribe(productos => {
      this.productos = productos;
    });

    this.carritoService.precioTotal$.subscribe(precioTotal => {
      this.precioTotal = precioTotal;
    });
  }

  /**
   * @description
   * Elimina un producto del carrito y actualiza el precio total y el contador de productos
   * @param producto - El producto a eliminar
   */
  eliminarProducto(producto: Producto) {
    const productos = this.productos.filter(p => p.id_producto !== producto.id_producto);
    const precioTotal = productos.reduce((total, p) => total + (parseFloat(p.precio) * p.cantidad), 0);
    this.carritoService.actualizarProductos(productos);
    this.carritoService.actualizarPrecioTotal(precioTotal);
    this.carritoService.actualizarContador(productos.length);

    console.log('Producto eliminado');
  }

  /**
   * @description
   * Emite el evento para cerrar el carrito
   */
  onCloseClick() {
    this.closeCarrito.emit();
  }

    /**
   * @description
   * Emite el evento para finalizar compra
   */
  finalizarCompra() {
    this.snackBar.open('En mantenimiento  :(', 'Cerrar', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
  }
}
