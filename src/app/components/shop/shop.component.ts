import { Component, OnInit } from '@angular/core';
import { Product } from '../../entities/Product';
import { ProductServiceService } from '../../services/product-service.service';
import { ReviewsService } from '../../services/reviews.service';
import { CartService } from '../../services/cart.service';
import { CategoryService } from '../../services/category.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-shop',
  standalone: false,
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
   products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: { _id: string; name: string }[] = [];

  errorMessage: string | null = null;
  searchTerm: string = '';
  sortBy: string = 'price';
  itemsPerPage: number = 9;
  priceMin: number = 0;
  priceMax: number = 10000;

  showFilters: boolean = false;
  selectedCategoryId: string = '';

  constructor(
    private productService: ProductServiceService,
    private reviewsService: ReviewsService,
    private cartService: CartService,
    private categoryService: CategoryService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedCategoryId = params['category'] || '';
      this.fetchCategories();
      this.fetchProducts();
    });
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

  fetchCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: data => {
        this.categories = data;
      },
      error: err => {
        console.error('Errore nel caricamento delle categorie:', err);
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

  applyFilters(): void {
    this.filteredProducts = this.products.filter(prod => {
      const matchCategory = this.selectedCategoryId ? prod.id_categoria === this.selectedCategoryId : true;
      const matchPrice = prod.price >= this.priceMin && prod.price <= this.priceMax;
      return matchCategory && matchPrice;
    });

    this.applySorting();
    this.showFilters = false;
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

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  onCategoryChange(): void {
    this.applyFilters();
  }

  clearCategoryFilter(): void {
    this.selectedCategoryId = '';
    this.applyFilters();
  }

  get selectedCategoryName(): string {
    return this.categories.find(c => c._id === this.selectedCategoryId)?.name || '';
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
  getSelectedCategoryName(): string | null {
  const selected = this.categories.find(c => c._id === this.selectedCategoryId);
  return selected ? selected.name : null;
}
}
