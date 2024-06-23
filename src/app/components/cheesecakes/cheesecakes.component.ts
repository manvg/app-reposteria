import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { FooterComponent } from '../footer/footer.component';
import { CarritoComponent } from '../carrito/carrito.component';
import { CarritoService } from '../../services/carrito/carrito.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-cheesecakes',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuComponent, FooterComponent, CarritoComponent],
  templateUrl: './cheesecakes.component.html',
  styleUrl: './cheesecakes.component.scss'
})
export class CheesecakesComponent {
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

  titulo: string = 'Cheesecakes';

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
