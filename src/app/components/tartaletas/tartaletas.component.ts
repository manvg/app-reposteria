import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { FooterComponent } from '../footer/footer.component';
import { CarritoComponent } from '../carrito/carrito.component';
import { CarritoService } from '../../services/carrito/carrito.service';
import { Producto } from '../../models/producto.model';

/**
 * @description
 * Este componente permite visualizar los productos de la categoría 'Tartaletas' y agregarlos al carrito de compras.
 */
@Component({
  selector: 'app-tartaletas',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuComponent, FooterComponent, CarritoComponent],
  templateUrl: './tartaletas.component.html',
  styleUrl: './tartaletas.component.scss'
})
export class TartaletasComponent {
  /**
   * @description
   * Lista de productos de la categoría 'Tartaletas'
   */
  productos = [
    {
      id_producto: '13',
      imagen: 'assets/images/tartaletas/tartaleta_durazno.PNG',
      titulo: 'Durazno',
      descripcion: 'Durazno',
      precio: '15.000',
      cantidad: 0
    },
    {
      id_producto: '14',
      imagen: 'assets/images/tartaletas/tartaleta_kiwi_durazno.PNG',
      titulo: 'Kiwi durazno',
      descripcion: 'Kiwi durazno',
      precio: '15.000',
      cantidad: 0
    },
    {
      id_producto: '15',
      imagen: 'assets/images/tartaletas/tartaleta_frutilla.PNG',
      titulo: 'Frutilla',
      descripcion: 'Frutilla',
      precio: '15.000',
      cantidad: 0
    },
    {
      id_producto: '16',
      imagen: 'assets/images/tartaletas/tartaleta_3.PNG',
      titulo: 'Damasco',
      descripcion: 'Damasco',
      precio: '18.000',
      cantidad: 0
    },
  ];

  /**
   * @description
   * Título de la categoría
   */
  titulo: string = 'Tartaletas';

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
  ngOnInit() {}

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
