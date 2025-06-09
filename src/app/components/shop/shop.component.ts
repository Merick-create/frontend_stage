import { Component } from '@angular/core';
import {  OnInit } from '@angular/core';
import { Product } from '../../entities/Product';
import { ProductServiceService } from '../../services/product-service.service';
import { ReviewsService } from '../../services/reviews.service';

@Component({
  selector: 'app-shop',
  standalone: false,
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent {
   products: Product[] = [];
  errorMessage: string | null = null;
  searchTerm: string = '';
  sortBy: string = 'price';
  itemsPerPage: number = 9;

  constructor(private productService: ProductServiceService, private reviewsService:ReviewsService) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.productService.getAll().subscribe({
      next: data => {
        this.products = data.filter(p => p.quantity > 0);
        this.applySorting(); // opzionale
      },
      error: err => {
        this.errorMessage = 'Errore nel caricamento dei prodotti';
        console.error(err);
      }
    });
  }

  searchProducts(): void {
    if (this.searchTerm.trim()) {
      this.productService.getByName(this.searchTerm).subscribe({
        next: data => {
          this.products = data.filter(p => p.quantity > 0);
          this.applySorting();
        },
        error: err => {
          this.errorMessage = 'Errore nella ricerca prodotti';
          console.error(err);
        }
      });
    } else {
      this.fetchProducts();
    }
  }

  applySorting(): void {
    if (this.sortBy === 'price') {
      this.products.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === 'name') {
      this.products.sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  onSortChange(): void {
    this.applySorting();
  }
}
