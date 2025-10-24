import { Component, inject } from '@angular/core';
import { Product as ProductService } from '../../services/product';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-product-list',
  imports: [],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  // Inyectamos el servicio de productos
  // inject reemplaza la necesidad de un constructor para la inyección de dependencias
  private productService = inject(ProductService);

  // Usamos toSignal para convertir el Observable<Product[]> en un Signal<Product[] | undefined>
  // Angular gestiona la suscripción y desuscripción automáticamente.
  public products = toSignal(this.productService.getProducts());

  //en el constructor se puede definir la inyección de dependencias de servicios
  constructor() {
    // Opcional: Puedes ver el valor inicial (undefined) y luego el array
    console.log('Valor inicial del signal products:', this.products());
  }
}
