import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Producto } from '../../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private contadorCarritoSource = new BehaviorSubject<number>(0);
  contadorCarrito$ = this.contadorCarritoSource.asObservable();

  private productosSource = new BehaviorSubject<Producto[]>([]);
  productos$ = this.productosSource.asObservable();

  private precioTotalSource = new BehaviorSubject<number>(0);
  precioTotal$ = this.precioTotalSource.asObservable();

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
        imagen: producto.imagen,
        titulo: producto.titulo,
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

  actualizarContador(contador: number) {
    this.contadorCarritoSource.next(contador);
    console.log('Se actualizó el contador a ' + contador);
  }

  actualizarProductos(productos: Producto[]) {
    this.productosSource.next(productos);
    console.log('Se actualizaron los productos');
  }

  actualizarPrecioTotal(precioTotal: number) {
    this.precioTotalSource.next(precioTotal);
    console.log('Se actualizó el precio total a ' + precioTotal);
  }
}