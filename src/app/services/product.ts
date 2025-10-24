import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductInterface } from '../models/product.model';  // Asegúrate que la ruta sea correcta
import { Observable, tap, catchError, throwError } from 'rxjs'; // Importa operadores RxJS

@Injectable({
  providedIn: 'root',
})
export class Product {
  // inject() es la forma moderna de inyectar
  private http = inject(HttpClient);
  private apiUrl = 'https://fakestoreapi.com/products';

  // Obtiene TODOS los productos
  getProducts(): Observable<ProductInterface[]> {
    console.log('Servicio: Llamando a getProducts...');
    // pipe en Rxjs se utiliza para combinar múltiples operadores
    // tap en Rxjs es usado para realizar efectos secundarios como logging
    // catchError en Rxjs se utiliza para manejar errores
    return this.http.get<ProductInterface[]>(this.apiUrl).pipe(
      tap((products) => console.log(`Servicio: Obtenidos ${products.length} productos`)),
      catchError(this.handleError) // Añade manejo de errores básico
    );
  }
  // Obtiene UN producto por su ID
  getProductById(id: string | number): Observable<Product> {
    console.log(`Servicio: Llamando a getProductById con ID: ${id}`);
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      tap((product) => console.log(`Servicio: Obtenido producto`, product)),
      catchError(this.handleError) // Añade manejo de errores básico
    );
  }
  // Función simple para manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Error en el servicio de productos:', error);
    // Podrías formatear el error o loggearlo en un sistema externo
    return throwError(
      () => new Error('Algo salió mal al obtener los datos; por favor intente más tarde.')
    );
  }
}
