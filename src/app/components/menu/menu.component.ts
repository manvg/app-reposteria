import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  @Output() carritoClicked = new EventEmitter<void>();
  contadorCarrito: number = 0;

  constructor(private carritoService: CarritoService) {}

  ngOnInit() {
    this.carritoService.contadorCarrito$.subscribe(contador => {
      this.contadorCarrito = contador;
    });
  }

  onCarritoClick() {
    this.carritoClicked.emit();
  }
}
