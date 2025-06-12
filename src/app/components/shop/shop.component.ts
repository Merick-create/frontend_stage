import { Component, OnInit } from '@angular/core';
import { Product } from '../../entities/Product';
import { ProductServiceService } from '../../services/product-service.service';
import { ReviewsService } from '../../services/reviews.service';
import { CartService } from '../../services/cart.service';
import { CategoryService } from '../../services/category.service';
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
  priceMin: number = 0;
  priceMax: number = 10000;
  showFilters: boolean = false;
  expanded = {
    categories: true,
    price: true
  };

  categories: { _id: string; name: string }[] = [];

  constructor(
    private productService: ProductServiceService,
    private reviewsService: ReviewsService,
    private cartService:CartService,
    private categoryService:CategoryService
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
 applyFilters(): void {
  const filters = {
    priceMin: this.priceMin,
    priceMax: this.priceMax,
    sortBy: this.sortBy,
    sortOrder: 'asc', // oppure gestisci lato UI
    page: 1,          
    itemsPerPage: this.itemsPerPage,
  };

  this.productService.getFilteredProducts(filters).subscribe({
    next: (res) => {
      this.filteredProducts = res.products.filter((p: Product) => p.quantity > 0);
      this.showFilters = false;
    },
    error: (err) => {
      this.errorMessage = 'Errore nel caricamento dei prodotti filtrati';
      console.error(err);
    }
  });
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
selectedCategories: string[] = [];

toggleCategorySelection(categoryName: string) {
  const index = this.selectedCategories.indexOf(categoryName);
  if (index > -1) {
    this.selectedCategories.splice(index, 1);
  } else {
    this.selectedCategories.push(categoryName);
  }
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

}
