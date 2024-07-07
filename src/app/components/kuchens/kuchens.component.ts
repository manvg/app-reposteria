import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { FooterComponent } from '../footer/footer.component';
import { CarritoComponent } from '../carrito/carrito.component';
import { CarritoService } from '../../services/carrito/carrito.service';
import { Producto } from '../../models/producto.model';
import { StorageService } from '../../services/storage/storage.service';

/**
 * @description
 * Este componente permite visualizar los productos de la categoría 'Kuchens' y agregarlos al carrito de compras.
 */
@Component({
  selector: 'app-kuchens',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuComponent, FooterComponent, CarritoComponent],
  templateUrl: './kuchens.component.html',
  styleUrl: './kuchens.component.scss'
})
export class KuchensComponent implements OnInit {
  productos: Producto[] = [];

  /**
   * @description
   * Título de la categoría
   */
  titulo: string = 'Kuchens';

  /**
   * @description
   * Bandera para controlar la visibilidad del carrito de compras
   */
  carritoVisible: boolean = false;

  /**
   * @ignore
   */
  constructor(private carritoService: CarritoService, private storageService: StorageService) {}

  /**
   * @description
   * Inicializa el componente
   */
  ngOnInit() {
    this.obtenerProductos();
  }

   /**
   * @description
   * Obtiene los productos desde el servicio de almacenamiento
   */
   obtenerProductos() {
    this.storageService.getJsonData().subscribe((data: { [key: string]: Producto }) => {
      this.productos = Object.values(data).filter((producto: Producto) => producto.categoria === 'kuchen');
    });
  }

  /**
   * @description
   * Agrega un producto al carrito de compras
   * @param producto - El producto a agregar
   */
  agregarProducto(producto: Producto) {
    this.carritoService.agregarProducto(producto);
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
}
