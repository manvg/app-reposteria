import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { FooterComponent } from '../footer/footer.component';
import { CarritoComponent } from '../carrito/carrito.component';
import { CarritoService } from '../../services/carrito/carrito.service';
import { Producto } from '../../models/producto.model';

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
  /**
   * @description
   * Lista de productos de la categoría 'Kuchens'
   */
  productos = [
    {
      id_producto: '9',
      imagen: 'assets/images/kuchen/kuchen_aleman.PNG',
      titulo: 'Alemán',
      descripcion: 'Alemán',
      precio: '12.000',
      cantidad: 0
    },
    {
      id_producto: '10',
      imagen: 'assets/images/kuchen/kuchen_frutilla.PNG',
      titulo: 'Frutilla',
      descripcion: 'Frutilla',
      precio: '15.000',
      cantidad: 0
    },
    {
      id_producto: '11',
      imagen: 'assets/images/kuchen/kuchen_nuez.PNG',
      titulo: 'Nuez',
      descripcion: 'Nuez',
      precio: '15.000',
      cantidad: 0
    },
    {
      id_producto: '12',
      imagen: 'assets/images/kuchen/kuchen_sureño.PNG',
      titulo: 'Sureño',
      descripcion: 'Sureño',
      precio: '18.000',
      cantidad: 0
    },
  ];

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
  constructor(private carritoService: CarritoService) {}

  /**
   * @description
   * Inicializa el componente
   */
  ngOnInit(): void {}

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
