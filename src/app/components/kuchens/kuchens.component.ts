import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { FooterComponent } from '../footer/footer.component';
import { CarritoComponent } from '../carrito/carrito.component';
import { CarritoService } from '../../services/carrito/carrito.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-kuchens',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuComponent, FooterComponent, CarritoComponent],
  templateUrl: './kuchens.component.html',
  styleUrl: './kuchens.component.scss'
})
export class KuchensComponent {
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

  titulo: string = 'Kuchens';

  carritoVisible: boolean = false;

  constructor(private carritoService: CarritoService) {}

  ngOnInit() {}

  agregarProducto(producto: Producto) {
    this.carritoService.agregarProducto(producto);
  }

  toggleCarrito() {
    this.carritoVisible = !this.carritoVisible;
  }

  closeCarrito() {
    this.carritoVisible = false;
  }
}
