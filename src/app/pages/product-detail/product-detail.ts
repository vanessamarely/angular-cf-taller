import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router'; // Importa ActivatedRoute y RouterLink
import { Title } from '@angular/platform-browser'; // Para cambiar el título de la página dinámicamente
import { switchMap, catchError, tap } from 'rxjs/operators'; // EMPTY para manejo de errores
import { EMPTY } from 'rxjs'; // EMPTY para manejo de errores
import { Product as ProductService } from '../../services/product'; // Ajusta rutas
import { ProductInterface } from '../../models/product.model'; // Importa la interfaz
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common'; // Para @if y pipes

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'; // Importa cosas de Forms
@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail {
  private route = inject(ActivatedRoute); // Inyecta ActivatedRoute para leer parámetros de URL
  private productService = inject(ProductService);
  private titleService = inject(Title); // Inyecta Title para cambiar el título del navegador

  private fb = inject(FormBuilder); // 3. Inyecta FormBuilder

  // 4. Define el FormGroup para el formulario de reseña
  reviewForm = this.fb.group({
    // Define un control llamado 'comment'
    comment: [
      '', // Valor inicial vacío
      [
        // Array de validadores
        Validators.required, // Es obligatorio
        Validators.minLength(10), // Debe tener al menos 10 caracteres
      ],
    ],
  });

  // Método para manejar el envío del formulario
  onSubmitReview() {
    // Marca todos los campos como 'touched' para mostrar errores si es necesario
    this.reviewForm.markAllAsTouched();

    if (this.reviewForm.valid) {
      console.log('Formulario de reseña válido. Enviando:', this.reviewForm.value);
      // Aquí iría la lógica para enviar la reseña a un backend
      alert(`¡Gracias por tu reseña!\nComentario: "${this.reviewForm.value.comment}"`);
      this.reviewForm.reset(); // Limpia el formulario después de enviarlo
    } else {
      console.error('El formulario de reseña es inválido.');
    }
  }
  // Getter para acceder fácilmente al control 'comment' en el template
  get commentControl() {
    return this.reviewForm.get('comment');
  }

  // Creamos un Observable que:
  // 1. Escucha cambios en los parámetros de la ruta (paramMap).
  // 2. Extrae el 'id'.
  // 3. Usa switchMap para cancelar peticiones anteriores si el ID cambia rápidamente
  //    y llama a getProductById con el nuevo ID.
  // 4. Maneja el error si el producto no se encuentra o falla la API.
  private productData$ = this.route.paramMap.pipe(
    switchMap((params) => {
      const id = params.get('id');
      if (!id) {
        console.error('ID de producto no encontrado en la ruta');
        // Podrías redirigir a /not-found aquí si quisieras
        return EMPTY; // Retorna un observable vacío si no hay ID
      }
      return this.productService.getProductById(id).pipe(
        tap((product) => {
          // Cambia el título de la pestaña del navegador solo si product existe
          const title = product && product.title ? product.title : 'Producto';

          this.titleService.setTitle(`${title} - Mini Tienda`);
        }),
        catchError((err) => {
          console.error('Error al cargar producto:', err);
          // Podrías redirigir a /not-found o mostrar un mensaje
          this.titleService.setTitle('Producto no encontrado - Mini Tienda');
          return EMPTY; // Retorna vacío para que el signal quede undefined
        })
      );
    })
  );

  // Convertimos el observable del producto a un Signal.
  // Será undefined hasta que lleguen los datos, o si hubo un error.
  public product = toSignal<ProductInterface | undefined>(this.productData$);
}
