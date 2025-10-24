import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router'; // Importa ActivatedRoute y RouterLink
import { Title } from '@angular/platform-browser'; // Para cambiar el título de la página dinámicamente
import { switchMap, catchError, tap } from 'rxjs/operators'; // EMPTY para manejo de errores
import { EMPTY } from 'rxjs'; // EMPTY para manejo de errores
import { Product as ProductService } from '../../services/product'; // Ajusta rutas
import { ProductInterface } from '../../models/product.model'; // Importa la interfaz
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common'; // Para @if y pipes

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'; // Importa cosas de Forms

// Interfaz para los comentarios
interface ProductComment {
  id: string;
  productId: string;
  comment: string;
  date: string;
  userName: string;
}
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

  // Signal para manejar los comentarios del producto actual
  public productComments = signal<ProductComment[]>([]);
  
  // Signal para el ID del producto actual
  private currentProductId = signal<string>('');

  // 4. Define el FormGroup para el formulario de reseña
  reviewForm = this.fb.group({
    userName: [
      '', // Valor inicial vacío
      [
        Validators.required, // Es obligatorio
        Validators.minLength(2), // Debe tener al menos 2 caracteres
      ],
    ],
    comment: [
      '', // Valor inicial vacío
      [
        // Array de validadores
        Validators.required, // Es obligatorio
        Validators.minLength(10), // Debe tener al menos 10 caracteres
      ],
    ],
  });

  // Métodos para manejar localStorage
  private getStorageKey(productId: string): string {
    return `product_comments_${productId}`;
  }

  private loadComments(productId: string): void {
    const key = this.getStorageKey(productId);
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const comments = JSON.parse(stored) as ProductComment[];
        this.productComments.set(comments);
      } catch (error) {
        console.error('Error parsing comments from localStorage:', error);
        this.productComments.set([]);
      }
    } else {
      this.productComments.set([]);
    }
  }

  private saveComment(comment: ProductComment): void {
    const currentComments = this.productComments();
    const updatedComments = [...currentComments, comment];
    
    // Guardar en localStorage
    const key = this.getStorageKey(comment.productId);
    localStorage.setItem(key, JSON.stringify(updatedComments));
    
    // Actualizar el signal
    this.productComments.set(updatedComments);
  }

  // Método para manejar el envío del formulario
  onSubmitReview() {
    // Marca todos los campos como 'touched' para mostrar errores si es necesario
    this.reviewForm.markAllAsTouched();

    if (this.reviewForm.valid && this.currentProductId()) {
      const formValue = this.reviewForm.value;
      
      const newComment: ProductComment = {
        id: Date.now().toString(), // ID único basado en timestamp
        productId: this.currentProductId(),
        comment: formValue.comment || '',
        userName: formValue.userName || 'Anónimo',
        date: new Date().toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      console.log('Guardando nuevo comentario:', newComment);
      this.saveComment(newComment);
      this.reviewForm.reset(); // Limpia el formulario después de enviarlo
      
      // Mensaje de éxito
      alert('¡Gracias por tu reseña! Se ha guardado correctamente.');
    } else {
      console.error('El formulario de reseña es inválido o no hay producto cargado.');
    }
  }
  // Getter para acceder fácilmente al control 'comment' en el template
  get commentControl() {
    return this.reviewForm.get('comment');
  }

  // Getter para acceder fácilmente al control 'userName' en el template
  get userNameControl() {
    return this.reviewForm.get('userName');
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
      
      // Guardar el ID actual y cargar comentarios
      this.currentProductId.set(id);
      this.loadComments(id);
      
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
