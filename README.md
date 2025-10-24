# Taller Práctico Angular - Mini Tienda

**Objetivo:** Construir una pequeña aplicación de tienda que muestre productos, ver detalles, incluya un formulario simple con validación y esté lista para desplegar, aplicando los conceptos clave de Angular moderno.

## 📋 Tabla de Contenidos

- [Paso 0: Instalar Angular CLI](#paso-0-instalar-angular-cli)
- [Paso 1: Creación del Proyecto y Configuración Inicial](#paso-1-creación-del-proyecto-y-configuración-inicial)
- [Paso 2: Crear Estructura de Componentes y Servicio](#paso-2-crear-estructura-de-componentes-y-servicio)
- [Paso 3: Configurar el Routing Básico](#paso-3-configurar-el-routing-básico)
- [Paso 4: Implementar el Servicio de Productos](#paso-4-implementar-el-servicio-de-productos)
- [Paso 5: Implementar Lista y Tarjeta de Productos](#paso-5-implementar-lista-y-tarjeta-de-productos)
- [Paso 6: Implementar Detalle del Producto](#paso-6-implementar-detalle-del-producto)
- [Paso 7: Formularios Reactivos y Validaciones](#paso-7-formularios-reactivos-y-validaciones)
- [Paso 8: Revisión Final de Estilos](#paso-8-revisión-final-de-estilos)
- [Paso 9: Despliegue](#paso-9-despliegue)
- [Paso 10: Repaso - Mini App con Signals y Manejo de Estado](#paso-10-repaso---mini-app-con-signals-y-manejo-de-estado)
- [🎯 PASO BONUS: Sistema de Comentarios con LocalStorage](#-paso-bonus-sistema-de-comentarios-con-localstorage)

---

## Paso 0: Instalar Angular CLI

Antes de poder crear y gestionar proyectos Angular, necesitamos instalar la Angular CLI (Command Line Interface - Interfaz de Línea de Comandos). Esta es la herramienta oficial que nos permite generar componentes, servicios, construir la aplicación y mucho más.

**Prerrequisito:** Asegúrate de tener Node.js (versión LTS recomendada) y npm instalados. Puedes verificarlo abriendo tu terminal y ejecutando `node -v` y `npm -v`. Si no los tienes, descárgalos desde [nodejs.org](https://nodejs.org).

### Pasos:

1. **Abre tu Terminal:** Puedes usar la Terminal de macOS/Linux, el símbolo del sistema (cmd) o PowerShell en Windows, o el terminal integrado de tu editor de código (como VS Code).

2. **Instala Angular CLI globalmente:** Ejecuta el siguiente comando. La bandera `-g` lo instala de forma global en tu sistema, permitiéndote usar el comando `ng` desde cualquier directorio.

```bash
npm install -g @angular/cli
```

3. **Verifica la Instalación:** Una vez que termine, comprueba que se instaló correctamente ejecutando:

```bash
ng version
```

Deberías ver un mensaje mostrando la versión del Angular CLI.

Con el Angular CLI instalado, ya estamos listos para crear nuestro primer proyecto.

---

## Paso 1: Creación del Proyecto y Configuración Inicial

Ahora crearemos el proyecto base para nuestra tienda.

### 1. Crea el Proyecto con Angular CLI:

```bash
ng new taller-tienda-angular --standalone --ssr=false --style=css --routing
```

- `ng new taller-tienda-angular`: Crea el proyecto.
- `--standalone`: Usa Standalone Components (moderno).
- `--ssr=false`: Desactiva Server-Side Rendering.
- `--style=css`: Usa CSS plano.
- `--routing`: Configura el enrutamiento básico.

### 2. Navega a la Carpeta del Proyecto:

```bash
cd taller-tienda-angular
```

### 3. Configura HttpClient:

Abre `src/app/app.config.ts`. Necesitamos importar `provideHttpClient` y añadirlo a los providers para poder hacer llamadas a APIs.

```typescript
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
  ]
};
```

### 4. Ejecuta la Aplicación:

```bash
ng serve -o
```

Deberías ver la página de bienvenida de Angular en http://localhost:4200

- `ng serve`: Compila y sirve la aplicación.
- `-o`: Abre automáticamente tu navegador predeterminado en http://localhost:4200.

---

## Paso 2: Crear Estructura de Componentes y Servicio

Ahora crearemos los "ladrillos" de nuestra aplicación: el servicio para los datos y los componentes para las diferentes vistas y elementos reutilizables.

### Genera el Servicio:
Este maneja la lógica para obtener los datos de los productos.

```bash
ng generate service services/product
```

(Crea `src/app/services/product.ts`)

### Genera los Componentes de Página:
Estos representarán las vistas principales accesibles por rutas.

```bash
ng generate component pages/home
ng generate component pages/product-list
ng generate component pages/product-detail
ng generate component pages/not-found
```

(Crea carpetas dentro de `src/app/pages/`)

### Genera el Componente Reutilizable:
Esta será la tarjeta que muestra cada producto.

```bash
ng generate component components/product-card
```

(Crea la carpeta `src/app/components/product-card/`)

---

## Paso 3: Configurar el Routing Básico

Vamos a conectar nuestros componentes de página a URLs específicas.

### Define las Rutas:
Abre `src/app/app.routes.ts`. Este archivo fue creado por el CLI gracias a la opción `--routing`. Importa los componentes de la página que creaste y define las rutas.

```typescript
import { Routes } from '@angular/router';

// Importa tus componentes de página
import { Home } from './pages/home/home';
import { ProductList } from './pages/product-list/product-list';
import { ProductDetail } from './pages/product-detail/product-detail';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
  // Ruta raíz ('/') -> Muestra Home
  { path: '', component: Home, title: 'Inicio - Mini Tienda' },

  // Ruta '/products' -> Muestra ProductList
  { path: 'products', component: ProductList, title: 'Productos - Mini Tienda' },

  // Ruta '/product/:id' -> Muestra ProductDetail
  // ':id' es un PARÁMETRO de ruta. Capturará el ID del producto de la URL.
  { path: 'product/:id', component: ProductDetail, title: 'Detalle Producto' },

  // Ruta comodín ('**') -> Muestra NotFound si ninguna otra ruta coincide
  { path: '**', component: NotFound, title: '404 - No Encontrado' },
];
```

**Nota Standalone/Routing:** Fíjate cómo importamos y usamos los componentes directamente, sin necesidad de un RoutingModule. El `title` en cada ruta actualiza automáticamente el título de la pestaña del navegador.

### Añade Navegación y `<router-outlet>`:
Abre `src/app/app.html`. El CLI ya añadió `<router-outlet>`, pero vamos a borrar todo lo demás y añadir una barra de navegación simple.

```html
<header>
  <nav>
    <ul>
      <li>
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Inicio</a>
      </li>
      <li><a routerLink="/products" routerLinkActive="active">Productos</a></li>
    </ul>
  </nav>
</header>
<main>
  <router-outlet></router-outlet>
</main>

<footer>
  <p>&copy; {{ currentYear }} Mini Tienda Angular</p>
</footer>
```

### Añade Estilos Básicos (Integración de Estilos):
Abre `src/styles.css` (estilos globales) y añade algunos estilos para que la navegación y el layout se vean decentes.

```css
/* src/styles.css */
body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  color: #333;
}

header {
  background-color: #3f51b5; /* Azul Angular */
  color: white;
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

header nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 1rem;
}

header nav a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 0.8rem;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

header nav a:hover,
header nav a.active { /* Estilo para el enlace activo */
  background-color: rgba(255, 255, 255, 0.2);
}

main {
  flex-grow: 1; /* Ocupa el espacio vertical disponible */
  padding: 1.5rem;
  max-width: 1200px; /* Limita el ancho máximo del contenido */
  margin: 0 auto; /* Centra el contenido */
  width: 100%;
  box-sizing: border-box;
}

footer {
  background-color: #f5f5f5;
  padding: 1rem;
  text-align: center;
  margin-top: auto; /* Empuja el footer hacia abajo */
  color: #666;
  font-size: 0.9rem;
}

/* Estilos generales para botones, etc. (puedes añadir más) */
button {
  padding: 0.7rem 1.5rem;
  background-color: #3f51b5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease;
}
button:hover {
  background-color: #303f9f;
}
button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
```

En `src/app/app.ts`, añade la variable `currentYear` para el footer.

```typescript
import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router'; // Importa módulos de router

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('taller-tienda-angular');
  currentYear = new Date().getFullYear(); // Añade esto
}
```

¡Ahora deberías poder navegar entre "Inicio" (mostrando home works!) y "Productos" (mostrando product-list works!)!

---

## Paso 4: Implementar el Servicio de Productos

Vamos a darle vida al ProductService para que use HttpClient y traiga datos de una API pública gratuita (fakestoreapi.com).

### Define la Interfaz del Producto:
Es una buena práctica definir la "forma" de tus datos. Crea un archivo `src/app/models/product.model.ts`.

```typescript
// src/app/models/product.model.ts
export interface ProductInterface {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { // Objeto anidado
    rate: number;
    count: number;
  };
}
```

### Completa el Servicio:
Abre `src/app/services/product.ts`.

```typescript
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs'; // Importa operadores RxJS
import { ProductInterface } from '../models/product.model'; // Asegúrate que la ruta sea correcta

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
    return this.http.get<ProductInterface[]>(this.apiUrl).pipe(
      tap((products) => console.log(`Servicio: Obtenidos ${products.length} productos`)),
      catchError(this.handleError) // Añade manejo de errores básico
    );
  }
  
  // Obtiene UN producto por su ID
  getProductById(id: string | number): Observable<ProductInterface> {
    console.log(`Servicio: Llamando a getProductById con ID: ${id}`);
    return this.http.get<ProductInterface>(`${this.apiUrl}/${id}`).pipe(
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
```

**Nota RxJS:** `tap` nos permite "espiar" el flujo de datos sin modificarlo, útil para console.log. `catchError` intercepta errores del HTTP y `throwError` relanza un error observable.

---

## Paso 5: Implementar Lista y Tarjeta de Productos

Ahora conectaremos el servicio con los componentes para mostrar los productos.

### Implementa ProductCard (con input):
Este componente solo recibe un producto y lo muestra.

**src/app/components/product-card/product-card.ts:**

```typescript
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
  // Usamos input.required para asegurar que siempre se pase un producto
  product = input.required<ProductInterface>();
}
```

**src/app/components/product-card/product-card.html:**
Añade un enlace al detalle usando routerLink y muestra los datos usando el signal product().

```html
<div class="product-card">
  <a [routerLink]="['/product', product().id]">
    <img [src]="product().image" [alt]="product().title" />
    <h3>{{ product().title | slice : 0 : 50 }}{{ product().title.length > 50 ? '...' : '' }}</h3>
  </a>
  <p class="price">{{ product().price | currency : 'USD' }}</p>
</div>
```

**src/app/components/product-card/product-card.css:**
Estilos para la tarjeta.

```css
.product-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  background-color: white;
  transition: box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Para alinear el precio abajo */
  height: 100%; /* Asegura altura consistente si están en grid */
}
.product-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.product-card img {
  max-height: 150px; /* Aumenta un poco la altura */
  max-width: 100%;
  object-fit: contain; /* Mantiene la proporción */
  margin-bottom: 1rem;
}
.product-card a {
  text-decoration: none;
  color: inherit;
}
.product-card h3 {
  font-size: 1rem;
  min-height: 3.2em; /* Espacio para ~2 líneas de texto */
  margin: 0.5rem 0;
  font-weight: 600; /* Un poco más grueso */
}
.product-card .price {
  font-weight: bold;
  color: #3f51b5;
  margin-top: 0.5rem; /* Espacio antes del precio */
  font-size: 1.1rem;
}
```

### Implementa ProductList (con toSignal y @for):
Este componente obtiene la lista y usa app-product-card.

**src/app/pages/product-list/product-list.ts:**

```typescript
import { Component, inject } from '@angular/core';
import { Product as ProductService } from '../../services/product';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductCard } from '../../components/product-card/product-card'; 

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, ProductCard],
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
```

**src/app/pages/product-list/product-list.html:**
Usa @if para esperar los datos y @for para iterar.

```html
<h2>Productos Disponibles</h2>

@if (products()) {
  <div class="product-grid">
    @for (product of products(); track product.id) {
      <app-product-card [product]="product"></app-product-card>
    } @empty {
      <p>No hay productos disponibles en este momento.</p>
    }
  </div>
} @else {
  <p class="loading-message">Cargando productos...</p>
}
```

**src/app/pages/product-list/product-list.css:**
Estilos para la cuadrícula.

```css
.product-grid {
  display: grid;
  /* Crea columnas automáticas que miden entre 220px y 1fr */
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem; /* Más espacio entre tarjetas */
  margin-top: 1rem;
}

.loading-message {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin-top: 2rem;
}
```

---

## Paso 6: Implementar Detalle del Producto (ProductDetail)

Este componente leerá el ID de la ruta (`:id`) y usará el servicio para cargar los detalles específicos de ese producto.

### Obtén el ID de la Ruta y Carga los Datos:
Abre `src/app/pages/product-detail/product-detail.ts`.

```typescript
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router'; // Importa ActivatedRoute y RouterLink
import { Product as ProductService } from '../../services/product'; // Ajusta rutas
import { CommonModule } from '@angular/common'; // Para @if y pipes
import { switchMap, catchError, tap } from 'rxjs/operators'; // EMPTY para manejo de errores
import { EMPTY } from 'rxjs'; // EMPTY para manejo de errores
import { toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser'; // Para cambiar el título de la página dinámicamente
import { ProductInterface } from '../../models/product.model'; // Importa la interfaz

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail {
  private route = inject(ActivatedRoute); // Inyecta ActivatedRoute para leer parámetros de URL
  private productService = inject(ProductService);
  private titleService = inject(Title); // Inyecta Title para cambiar el título del navegador

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
```

**Nota Routing/RxJS:** `ActivatedRoute` nos da `paramMap` (un Observable) para reaccionar a cambios en los parámetros de la URL. `switchMap` es crucial aquí: si el usuario navega rápidamente entre detalles, cancela las peticiones HTTP anteriores y solo procesa la última. `EMPTY` es un observable que no emite nada y se completa, útil para manejo de errores.

### Muestra los Detalles en el HTML:
Abre `src/app/pages/product-detail/product-detail.html`.

```html
<a routerLink="/products" class="back-link">&larr; Volver a la lista</a>

@if (product()) {
  <div class="product-detail">
    <div class="image-container">
      <img [src]="product()?.image" [alt]="product()?.title">
    </div>
    <div class="info-container">
      <h1>{{ product()?.title }}</h1>
      <p class="category">{{ product()?.category }}</p>
      <p class="price">{{ product()?.price | currency:'USD' }}</p>
      <p class="description">{{ product()?.description }}</p>
      <p class="rating">
        Rating: {{ product()?.rating?.rate }}/5
        <span>({{ product()?.rating?.count }} votos)</span>
      </p>
      <div class="review-section">
        </div>
    </div>
  </div>
} @else {
  <p class="loading-message">Cargando detalles del producto o producto no encontrado...</p>
}
```

### Añade Estilos para el Detalle:
Abre `src/app/pages/product-detail/product-detail.css`.

```css
.back-link {
  display: inline-block;
  margin-bottom: 1.5rem; /* Más espacio abajo */
  color: #3f51b5;
  text-decoration: none;
  font-weight: 500;
}
.back-link:hover {
  text-decoration: underline;
}

.product-detail {
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
  flex-wrap: wrap; /* Permite que se apilen en pantallas pequeñas */
}

.image-container {
  flex: 1 1 300px; /* Crece, encoge, base 300px */
  text-align: center;
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  align-self: flex-start; /* Evita que se estire si la info es larga */
}
.image-container img {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
}

.info-container {
  flex: 2 1 400px; /* Crece más, encoge, base 400px */
}
.category {
  display: inline-block; /* Para que el fondo no ocupe todo */
  background-color: #eee;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
  text-transform: capitalize; /* Primera letra mayúscula */
}
.price {
  font-size: 1.8rem; /* Más grande */
  font-weight: bold;
  color: #3f51b5;
  margin: 0.5rem 0;
}
.description {
  line-height: 1.6; /* Más espacio entre líneas */
  margin: 1rem 0;
}
.rating {
  font-size: 0.9rem;
  color: #555;
}
.rating span {
  color: #888;
}
.loading-message {
  text-align: center; 
  font-size: 1.2rem; 
  color: #666; 
  margin-top: 2rem;
}
.review-section {
  margin-top: 2rem; /* Espacio antes del formulario */
  padding-top: 1rem;
  border-top: 1px solid #eee;
}
```

¡Ahora al hacer clic en un producto, deberías ver su página de detalles completa!

---

## Paso 7: Formularios Reactivos y Validaciones

Añadiremos un formulario simple en la página de detalle para dejar una reseña (solo un campo de comentario).

### Importa ReactiveFormsModule y Configura el Formulario:
Abre `src/app/pages/product-detail/product-detail.ts`.

```typescript
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router'; // Importa ActivatedRoute y RouterLink
import { Product as ProductService } from '../../services/product'; // Ajusta rutas
import { ProductInterface } from '../../models/product.model'; // Importa la interfaz
import { CommonModule } from '@angular/common'; // Para @if y pipes
import { switchMap, catchError, tap } from 'rxjs/operators'; // EMPTY para manejo de errores
import { EMPTY } from 'rxjs'; // EMPTY para manejo de errores
import { toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser'; // Para cambiar el título de la página dinámicamente

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'; // 1. Importa cosas de Forms

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, RouterLink, ReactiveFormsModule], // 2. Agrega ReactiveFormsModule
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

  // 5. Método para manejar el envío del formulario
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

  // 6. Getter para acceder fácilmente al control 'comment' en el template
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
```

**Nota Formularios:** `FormBuilder` simplifica la creación de `FormGroup` (el formulario) y `FormControl` (cada campo). `Validators` ofrece validaciones predefinidas. Marcamos como `touched` para que los errores solo aparezcan después de que el usuario interactúe con el campo.

### Añade el Formulario al HTML:
Abre `src/app/pages/product-detail/product-detail.html` y añade el código del formulario dentro del `div.review-section`.

```html
<div class="review-section">
  <h3>Deja tu reseña</h3>
  <form [formGroup]="reviewForm" (ngSubmit)="onSubmitReview()" novalidate>
    <div class="form-group">
      <label for="comment">Comentario:</label>
      <textarea id="comment" formControlName="comment" rows="4"
                placeholder="Escribe al menos 10 caracteres..."
                [class.invalid-field]="commentControl?.invalid && commentControl?.touched"></textarea>

      @if (commentControl?.invalid && (commentControl?.dirty || commentControl?.touched)) {
        <div class="error-messages">
          @if (commentControl?.errors?.['required']) {
            <p>El comentario es obligatorio.</p>
          }
          @if (commentControl?.errors?.['minlength']) {
            <p>El comentario debe tener al menos {{ commentControl?.errors?.['minlength'].requiredLength }} caracteres.</p>
          }
        </div>
      }
    </div>

    <button type="submit" [disabled]="reviewForm.invalid">Enviar Reseña</button>
  </form>
</div>
```

**Nota Atributos:** `novalidate` en el `<form>` evita la validación HTML5 nativa, dejando que Angular maneje todo.

### Añade Estilos para el Formulario y Errores:
Abre `src/app/pages/product-detail/product-detail.css`.

```css
/* ... (estilos anteriores) ... */
.review-section h3 {
  margin-bottom: 1rem;
}
.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.3rem;
  font-weight: 500; /* Un poco menos grueso que bold */
  color: #444;
}
.form-group textarea {
  width: 100%;
  padding: 0.6rem; /* Un poco más de padding */
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 1rem;
  line-height: 1.5;
}
.form-group textarea.invalid-field { /* Estilo cuando es inválido y tocado */
  border-color: red;
}
.error-messages p {
  color: #d32f2f; /* Rojo oscuro */
  font-size: 0.85rem;
  margin: 0.3rem 0 0 0;
}
```

¡Ahora deberías ver un formulario funcional con validaciones en la página de detalle! 📝

---

## Paso 8: Revisión Final de Estilos

- **Global (styles.css):** Hemos añadido estilos base para body, header, main, footer, nav, a, button. Podrías definir variables CSS aquí (`:root { --primary-color: #3f51b5; }`) para reutilizar colores.

- **Componente (*.css):** Cada componente (product-card, product-list, product-detail) tiene sus propios estilos específicos y encapsulados. Hemos intentado mantener una coherencia visual.

- **Standalone:** Al ser componentes standalone, no necesitamos preocuparnos por importar módulos de CSS o configurar styleUrls de forma compleja. Cada componente declara sus propios estilos.

---

## Paso 9: Despliegue

¡Prepara y despliega tu aplicación!

### Construir para Producción:
Optimiza la aplicación.

```bash
ng build
```

Esto genera la carpeta `dist/taller-tienda-angular/browser/`.

### Elige tu Plataforma:

#### **Vercel / Github Pages / Firebase Hosting**

**Vercel:**
1. Sube tu código a un repositorio Git (GitHub, GitLab).
2. Crea una cuenta en Vercel.
3. Conecta tu repositorio.
4. Configuración de Build:
   - Comando: `ng build`
   - Directorio de publicación: `dist/taller-tienda-angular/browser/` (¡verifica el nombre exacto!)
5. Despliega. ¡Te darán una URL pública!

**Firebase Hosting:**
1. Instala Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Inicia Firebase en tu proyecto: `firebase init hosting`
4. Selecciona tu proyecto Firebase.
5. Directorio público: `dist/taller-tienda-angular/browser/`
6. Configura como SPA: Sí (reescribe todas las URLs a /index.html).
7. Configura builds automáticos con GitHub: Opcional.
8. Construye: `ng build`
9. Despliega: `firebase deploy`

**Otros:** GitHub Pages (requiere configurar la ruta base).

---

## Paso 10: Repaso - Mini App con Signals y Manejo de Estado

### **Signals:**
- **toSignal:** Clave para convertir los Observables de HttpClient (getProducts, getProductById) en Signals (products, product) consumibles fácilmente en el template. Maneja la suscripción automáticamente.
- **signal:** Usado para estado local como searchTerm (si lo hubieras añadido) o selectedProduct (en el taller anterior).
- **input():** Usado en ProductCardComponent para recibir datos reactivamente.

### **Manejo de Estado:**
- **Estado Remoto:** Los datos principales (productos) viven en el API y se obtienen a través del ProductService. toSignal ayuda a reflejar este estado remoto en nuestros componentes.
- **Estado Local:** El estado del formulario (reviewForm) es manejado localmente por ProductDetailComponent usando ReactiveFormsModule.
- **Estado Compartido (Próximo paso):** Si quisiéramos un carrito de compras, necesitaríamos un servicio de estado (CartService) que probablemente usaría signal() internamente para mantener la lista de ítems del carrito y permitir que diferentes componentes (ej. un NavbarComponent y un CheckoutComponent) accedan y modifiquen ese estado de forma centralizada. Este taller sienta las bases para eso.

---

## 🎯 PASO BONUS: Sistema de Comentarios con LocalStorage

Como **paso adicional avanzado**, implementaremos un sistema completo de comentarios que permita a los usuarios:
- ✅ **Agregar comentarios con nombre de usuario**
- ✅ **Ver lista de comentarios por producto**
- ✅ **Persistir comentarios usando localStorage**
- ✅ **Gestión de estado con Angular Signals**

### ¿Por qué este bonus es valioso?

Este sistema demuestra conceptos avanzados de Angular:
- **Signals para estado reactivo**
- **localStorage para persistencia**
- **Gestión de estado por producto**
- **Formularios reactivos complejos**
- **Interfaces TypeScript**

### Implementación del Sistema de Comentarios

#### 1. Actualizar la Interfaz y el Componente

Primero, añadimos la interfaz para los comentarios en `src/app/pages/product-detail/product-detail.ts`:

```typescript
// Añadir al inicio del archivo, después de los imports
interface ProductComment {
  id: string;
  productId: string;
  comment: string;
  date: string;
  userName: string;
}
```

#### 2. Actualizar el Componente ProductDetail

Reemplaza todo el contenido de `src/app/pages/product-detail/product-detail.ts`:

```typescript
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { Product as ProductService } from '../../services/product';
import { ProductInterface } from '../../models/product.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

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
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private titleService = inject(Title);
  private fb = inject(FormBuilder);

  // Signal para manejar los comentarios del producto actual
  public productComments = signal<ProductComment[]>([]);
  
  // Signal para el ID del producto actual
  private currentProductId = signal<string>('');

  // FormGroup mejorado con nombre de usuario
  reviewForm = this.fb.group({
    userName: [
      '', 
      [
        Validators.required,
        Validators.minLength(2),
      ],
    ],
    comment: [
      '', 
      [
        Validators.required,
        Validators.minLength(10),
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

  // Método mejorado para manejar el envío del formulario
  onSubmitReview() {
    this.reviewForm.markAllAsTouched();

    if (this.reviewForm.valid && this.currentProductId()) {
      const formValue = this.reviewForm.value;
      
      const newComment: ProductComment = {
        id: Date.now().toString(),
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
      this.reviewForm.reset();
      
      alert('¡Gracias por tu reseña! Se ha guardado correctamente.');
    } else {
      console.error('El formulario de reseña es inválido o no hay producto cargado.');
    }
  }

  // Getters para acceder a los controles del formulario
  get commentControl() {
    return this.reviewForm.get('comment');
  }

  get userNameControl() {
    return this.reviewForm.get('userName');
  }

  // Observable del producto con carga de comentarios
  private productData$ = this.route.paramMap.pipe(
    switchMap((params) => {
      const id = params.get('id');
      if (!id) {
        console.error('ID de producto no encontrado en la ruta');
        return EMPTY;
      }
      
      // Guardar el ID actual y cargar comentarios
      this.currentProductId.set(id);
      this.loadComments(id);
      
      return this.productService.getProductById(id).pipe(
        tap((product) => {
          const title = product && product.title ? product.title : 'Producto';
          this.titleService.setTitle(`${title} - Mini Tienda`);
        }),
        catchError((err) => {
          console.error('Error al cargar producto:', err);
          this.titleService.setTitle('Producto no encontrado - Mini Tienda');
          return EMPTY;
        })
      );
    })
  );

  public product = toSignal<ProductInterface | undefined>(this.productData$);
}
```

#### 3. Actualizar el Template HTML

Reemplaza el contenido de `src/app/pages/product-detail/product-detail.html`:

```html
<a routerLink="/products" class="back-link">&larr; Volver a la lista</a>

@if (product()) {
<div class="product-detail">
  <div class="image-container">
    <img [src]="product()?.image" [alt]="product()?.title" />
  </div>
  <div class="info-container">
    <h1>{{ product()?.title }}</h1>
    <p class="category">{{ product()?.category }}</p>
    <p class="price">{{ product()?.price | currency : 'USD' }}</p>
    <p class="description">{{ product()?.description }}</p>
    <p class="rating">
      Rating: {{ product()?.rating?.rate }}/5
      <span>({{ product()?.rating?.count }} votos)</span>
    </p>
    <div class="review-section">
      <h3>Deja tu reseña</h3>
      <form [formGroup]="reviewForm" (ngSubmit)="onSubmitReview()" novalidate>
        <div class="form-group">
          <label for="userName">Tu nombre:</label>
          <input
            id="userName"
            type="text"
            formControlName="userName"
            placeholder="Escribe tu nombre..."
            [class.invalid-field]="userNameControl?.invalid && userNameControl?.touched"
          />

          @if (userNameControl?.invalid && (userNameControl?.dirty || userNameControl?.touched)) {
          <div class="error-messages">
            @if (userNameControl?.errors?.['required']) {
            <p>El nombre es obligatorio.</p>
            } @if (userNameControl?.errors?.['minlength']) {
            <p>
              El nombre debe tener al menos
              {{ userNameControl?.errors?.['minlength'].requiredLength }} caracteres.
            </p>
            }
          </div>
          }
        </div>

        <div class="form-group">
          <label for="comment">Comentario:</label>
          <textarea
            id="comment"
            formControlName="comment"
            rows="4"
            placeholder="Escribe al menos 10 caracteres..."
            [class.invalid-field]="commentControl?.invalid && commentControl?.touched"
          ></textarea>

          @if (commentControl?.invalid && (commentControl?.dirty || commentControl?.touched)) {
          <div class="error-messages">
            @if (commentControl?.errors?.['required']) {
            <p>El comentario es obligatorio.</p>
            } @if (commentControl?.errors?.['minlength']) {
            <p>
              El comentario debe tener al menos
              {{ commentControl?.errors?.['minlength'].requiredLength }} caracteres.
            </p>
            }
          </div>
          }
        </div>

        <button type="submit" [disabled]="reviewForm.invalid">Enviar Reseña</button>
      </form>

      <!-- Sección de comentarios existentes -->
      <div class="comments-section">
        <h4>Reseñas de clientes ({{ productComments().length }})</h4>
        
        @if (productComments().length === 0) {
          <p class="no-comments">No hay reseñas aún. ¡Sé el primero en comentar!</p>
        } @else {
          <div class="comments-list">
            @for (comment of productComments(); track comment.id) {
              <div class="comment-item">
                <div class="comment-header">
                  <strong class="comment-author">{{ comment.userName }}</strong>
                  <span class="comment-date">{{ comment.date }}</span>
                </div>
                <p class="comment-text">{{ comment.comment }}</p>
              </div>
            }
          </div>
        }
      </div>
    </div>
  </div>
</div>
} @else {
<p class="loading-message">Cargando detalles del producto o producto no encontrado...</p>
}
```

#### 4. Actualizar los Estilos CSS

Añade estos estilos al final de `src/app/pages/product-detail/product-detail.css`:

```css
/* Estilos adicionales para el sistema de comentarios */

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 1rem;
  line-height: 1.5;
}

.form-group input.invalid-field,
.form-group textarea.invalid-field {
  border-color: red;
}

button[type="submit"] {
  background-color: #3f51b5;
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  margin-top: 0.5rem;
}

button[type="submit"]:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

button[type="submit"]:hover:not(:disabled) {
  background-color: #303f9f;
}

/* Estilos para la sección de comentarios */
.comments-section {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
}

.comments-section h4 {
  margin-bottom: 1rem;
  color: #333;
}

.no-comments {
  color: #666;
  font-style: italic;
  text-align: center;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.comment-item {
  background-color: #f8f9fa;
  border-left: 4px solid #3f51b5;
  padding: 1rem;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.comment-author {
  color: #3f51b5;
  font-weight: 600;
}

.comment-date {
  color: #666;
  font-size: 0.85rem;
}

.comment-text {
  margin: 0;
  line-height: 1.5;
  color: #333;
}
```

### ✨ Características del Sistema de Comentarios

#### **🔧 Funcionalidades Implementadas:**

1. **Formulario Completo:** Nombre de usuario + comentario con validaciones
2. **Persistencia:** Los comentarios se guardan en localStorage por producto
3. **Estado Reactivo:** Uso de signals para actualizaciones automáticas
4. **Lista de Comentarios:** Muestra todos los comentarios con autor y fecha
5. **Contador:** Número total de reseñas por producto
6. **Experiencia de Usuario:** Mensajes de estado y validaciones

#### **🎯 Conceptos Angular Demostrados:**

- **Signals:** `signal()` para estado reactivo
- **LocalStorage:** Persistencia de datos del lado del cliente
- **Formularios Reactivos:** Validaciones complejas
- **Gestión de Estado:** Estado por producto
- **TypeScript:** Interfaces tipadas
- **Ciclo de Vida:** Carga y guardado automático

### 🚀 Resultado Final

Ahora tu aplicación tiene:
- ✅ **Lista de productos** con navegación
- ✅ **Detalles de producto** con información completa
- ✅ **Sistema de comentarios** completo y persistente
- ✅ **Formularios reactivos** con validaciones
- ✅ **Estado reactivo** con Angular Signals
- ✅ **Diseño responsive** y profesional
- ✅ **Lista para deployment** en cualquier plataforma

¡Felicidades! Has completado un taller completo de Angular moderno con todas las características de una aplicación real. 🎉

---

## 📚 Recursos Adicionales

- [Documentación Oficial de Angular](https://angular.dev)
- [Angular Signals Guide](https://angular.dev/guide/signals)
- [Reactive Forms](https://angular.dev/guide/reactive-forms)
- [Angular CLI](https://angular.dev/tools/cli)
- [RxJS Operators](https://rxjs.dev/guide/operators)

---

## 🤝 Contribuciones

Este taller es de código abierto. Si encuentras mejoras o tienes sugerencias, ¡siéntete libre de contribuir!

---

**¡Disfruta construyendo con Angular! 🚀**
