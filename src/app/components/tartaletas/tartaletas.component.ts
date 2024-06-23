import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { FooterComponent } from '../footer/footer.component';
import { CarritoComponent } from '../carrito/carrito.component';
import { CarritoService } from '../../services/carrito/carrito.service';
import { Producto } from '../../models/producto.model';


@Component({
  selector: 'app-tartaletas',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuComponent, FooterComponent, CarritoComponent],
  templateUrl: './tartaletas.component.html',
  styleUrl: './tartaletas.component.scss'
})
export class TartaletasComponent {
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

  titulo: string = 'Tartaletas';

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
