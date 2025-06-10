import { Component, OnInit } from '@angular/core';
import { Product } from '../../entities/Product';
import { ProductServiceService } from '../../services/product-service.service';
import { ReviewsService } from '../../services/reviews.service';
import { CartService } from '../../services/cart.service';
@Component({
  selector: 'app-shop',
  standalone: false,
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];

  errorMessage: string | null = null;
  searchTerm: string = '';
  sortBy: string = 'price';
  itemsPerPage: number = 9;

  // Nuovi campi per filtro prezzo
  priceMin: number = 0;
  priceMax: number = 10000;

  // Controllo sidebar
  showFilters: boolean = false;
  expanded = {
    categories: true,
    price: true
  };

  constructor(
    private productService: ProductServiceService,
    private reviewsService: ReviewsService,
    private cartService:CartService
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.productService.getAll().subscribe({
      next: data => {
        this.products = data.filter(p => p.quantity > 0);
        this.applyFilters();
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
          this.applyFilters();
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
      this.filteredProducts.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === 'name') {
      this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  onSortChange(): void {
    this.applySorting();
  }

  // ✅ Metodo chiamato quando si clicca "Apply Filters"
  applyFilters(): void {
    this.filteredProducts = this.products.filter(p =>
      p.price >= this.priceMin && p.price <= this.priceMax
    );
    this.applySorting();
    this.showFilters = false;
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  toggleCategory(category: 'categories' | 'price') {
    this.expanded[category] = !this.expanded[category];
  }

  addToCart(product: Product, quantity: number = 1): void {
  if (!product.id) {
    alert('Prodotto non disponibile');
    return;
  }

  this.cartService.addToCart(product.id, quantity).subscribe({
    next: res => {
      console.log('Prodotto aggiunto al carrello:', res);
      alert('Prodotto aggiunto con successo!');
    },
    error: err => {
      console.error('Errore:', err);
      alert(err.error?.error || 'Errore durante l\'aggiunta al carrello');
    }
  });
}
}
