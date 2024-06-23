import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { FooterComponent } from '../footer/footer.component';
import { CarritoComponent } from '../carrito/carrito.component';
import { CarritoService } from '../../services/carrito/carrito.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-tortas',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuComponent, FooterComponent, CarritoComponent],
  templateUrl: './tortas.component.html',
  styleUrl: './tortas.component.scss'
})
export class TortasComponent implements OnInit {
  productos = [
    {
      id_producto: '1',
      imagen: 'assets/images/tortas/torta_amor.PNG',
      titulo: 'Bizcocho amor',
      descripcion: 'Torta de bizcocho',
      precio: '20.000',
      cantidad: 0
    },
    {
      id_producto: '2',
      imagen: 'assets/images/tortas/torta_bizcocho_rellena_manja_trozos_durazno_cubierta_ganache_chocolate.PNG',
      titulo: 'Bizcocho manjar cubierta chocolate',
      descripcion: 'Bizcocho manjar cubierta chocolate',
      precio: '23.000',
      cantidad: 0
    },
    {
      id_producto: '3',
      imagen: 'assets/images/tortas/torta_hojarasca_manjar_nuez.PNG',
      titulo: 'Hojarasca manjar nuez',
      descripcion: 'Hojarasca manjar nuez',
      precio: '28.000',
      cantidad: 0
    },
    {
      id_producto: '4',
      imagen: 'assets/images/tortas/torta_manjar_durazno_dragon_ball_z.PNG',
      titulo: 'Bizcocho amor',
      descripcion: 'Manjar durazno - Temática',
      precio: '25.000',
      cantidad: 0
    },
  ];

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
