import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Producto } from '../../models/producto.model';

/**
 * @description
 * Servicio para gestionar el carrito de compras.
 */
@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  /**
   * @description
   * Fuente de datos para el contador de productos en el carrito.
   */
  private contadorCarritoSource = new BehaviorSubject<number>(0);

  /**
   * @description
   * Observable para el contador de productos en el carrito.
   */
  contadorCarrito$ = this.contadorCarritoSource.asObservable();

  /**
   * @description
   * Fuente de datos para la lista de productos en el carrito.
   */
  private productosSource = new BehaviorSubject<Producto[]>([]);

  /**
   * @description
   * Observable para la lista de productos en el carrito.
   */
  productos$ = this.productosSource.asObservable();

  /**
   * @description
   * Fuente de datos para el precio total de los productos en el carrito.
   */
  private precioTotalSource = new BehaviorSubject<number>(0);

  /**
   * @description
   * Observable para el precio total de los productos en el carrito.
   */
  precioTotal$ = this.precioTotalSource.asObservable();

  /**
   * @description
   * Agrega un producto al carrito de compras. Si el producto ya existe en el carrito, incrementa su cantidad.
   * @param producto - El producto a agregar
   */
  agregarProducto(producto: Producto) {
    console.log('carrito.service.ts => inicio funcion agregarProducto...');
    const productos = this.productosSource.getValue();
    const productoEnCarrito = productos.find(prod => prod.id_producto === producto.id_producto);

    let precioTotalProductos = this.precioTotalSource.getValue();
    let contadorProductos = this.contadorCarritoSource.getValue();

    if (productoEnCarrito) {
      productoEnCarrito.cantidad++;
      precioTotalProductos += parseFloat(productoEnCarrito.precio);
    } else {
      console.log('carrito.service.ts => agregando producto al array...');
      const infoProducto: Producto = {
        categoria: producto.categoria,
        imagen: producto.imagen,
        titulo: producto.titulo,
        descricion: producto.descricion,
        precio: producto.precio.replace('$', '').replace(/\./g, ''),
        id_producto: producto.id_producto,
        cantidad: 1
      };

      precioTotalProductos += parseFloat(infoProducto.precio);
      productos.push(infoProducto);
      contadorProductos++;
      console.log('contador array => ' + productos.length);
      console.log('Producto agregado');
    }

    this.productosSource.next(productos);
    this.precioTotalSource.next(precioTotalProductos);
    this.contadorCarritoSource.next(contadorProductos);
  }

  /**
   * @description
   * Actualiza el contador de productos en el carrito.
   * @param contador - El nuevo valor del contador
   */
  actualizarContador(contador: number) {
    this.contadorCarritoSource.next(contador);
    console.log('Se actualizó el contador a ' + contador);
  }

  /**
   * @description
   * Actualiza la lista de productos en el carrito.
   * @param productos - La nueva lista de productos
   */
  actualizarProductos(productos: Producto[]) {
    this.productosSource.next(productos);
    console.log('Se actualizaron los productos');
  }

  /**
   * @description
   * Actualiza el precio total de los productos en el carrito.
   * @param precioTotal - El nuevo precio total
   */
  actualizarPrecioTotal(precioTotal: number) {
    this.precioTotalSource.next(precioTotal);
    console.log('Se actualizó el precio total a ' + precioTotal);
  }
}
