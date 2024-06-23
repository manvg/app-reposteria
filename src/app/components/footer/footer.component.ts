import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * @description
 * Este componente permite gestionar el carrito de compras
 */
/**
 *
 * @usageNotes
 *
 * 1. Importa este módulo en tu aplicación principal
 * 2. Añade el selector 'app-footer' al final de cada módulo .html
 *
 */
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

}
