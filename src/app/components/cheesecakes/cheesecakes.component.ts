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
 * Este componente permite visualizar los productos de la categoría 'Cheesecakes' y agregarlos al carrito de compras.
 *
 */
@Component({
  selector: 'app-cheesecakes',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuComponent, FooterComponent, CarritoComponent],
  templateUrl: './cheesecakes.component.html',
  styleUrl: './cheesecakes.component.scss'
})
export class CheesecakesComponent implements OnInit {
  /**
   * @description
   * Lista de productos de la categoría 'Cheesecakes'
   */
  productos = [
    {
      id_producto: '5',
      imagen: 'assets/images/cheesecake/cheesecacke_frambuesa.PNG',
      titulo: 'Frambuesa',
      descripcion: 'Frambuesa',
      precio: '15.000',
      cantidad: 0
    },
    {
      id_producto: '6',
      imagen: 'assets/images/cheesecake/cheesecacke_horneado_frutos_rojos.PNG',
      titulo: 'Frutos rojos',
      descripcion: 'Frutos rojos',
      precio: '15.000',
      cantidad: 0
    },
    {
      id_producto: '7',
      imagen: 'assets/images/cheesecake/cheesecacke_maracuya.PNG',
      titulo: 'Maracuyá',
      descripcion: 'Maracuyá',
      precio: '18.000',
      cantidad: 0
    },
    {
      id_producto: '8',
      imagen: 'assets/images/cheesecake/cheesecacke_mermelada_frutilla.PNG',
      titulo: 'Mermelada frutilla',
      descripcion: 'Mermelada frutilla',
      precio: '18.000',
      cantidad: 0
    },
  ];

  /**
   * @description
   * Título de la categoría
   */
  titulo: string = 'Cheesecakes';

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
