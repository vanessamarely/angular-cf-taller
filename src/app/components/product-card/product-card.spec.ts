import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Component } from '@angular/core';

import { ProductCard } from './product-card';
import { ProductInterface } from '../../models/product.model';

// Test wrapper component to provide the required input
@Component({
  template: '<app-product-card [product]="testProduct"></app-product-card>',
  imports: [ProductCard]
})
class TestWrapperComponent {
  testProduct: ProductInterface = {
    id: 1,
    title: 'Test Product',
    price: 10.99,
    description: 'Test description',
    category: 'test',
    image: 'test.jpg',
    rating: { rate: 4.5, count: 100 }
  };
}

describe('ProductCard', () => {
  let component: TestWrapperComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestWrapperComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
