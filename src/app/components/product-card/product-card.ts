import { Component, input } from '@angular/core';
import { ProductInterface } from '../../models/product.model';
import { CommonModule } from '@angular/common'; // Para el pipe 'currency'
import { RouterLink } from '@angular/router'; // Para el enlace al detalle

@Component({
  selector: 'app-product-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  product = input.required<ProductInterface>();
}
