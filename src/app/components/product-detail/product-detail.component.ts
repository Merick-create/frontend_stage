import { Component,OnInit } from '@angular/core';
import { ProductServiceService } from '../../services/product-service.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../entities/Product';
import { CategoryService } from '../../services/category.service';
import { AuthService } from '../../services/auth.service';
import { ReviewsService } from '../../services/reviews.service';
import { CartService } from '../../services/cart.service';
@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  quantity = 1;
  suggestedProducts: Product[] = [];
  categoryName: string = '';
  selectedRating = 0;
  isLoggedIn = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductServiceService,
    private categoryService: CategoryService,
    private authService:AuthService,
    private reviewsService:ReviewsService,
    private cartService:CartService
  ) {}


  fetchSuggestedProductsByCategory() {
  if (!this.product) return;

  const categoryId = this.product.id_categoria;

  this.productService.getByCategory(categoryId).subscribe({
    next: (data) => {
      this.suggestedProducts = data.filter(p => p.id !== this.product!.id);
    },
    error: (err) => {
      console.error('Errore nel caricamento dei prodotti correlati', err);
    }
  });
}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(id);
    }
    this.authService.isAuthenticated$.subscribe(status => {
    this.isLoggedIn = status;

    this.fetchSuggestedProductsByCategory();
  });

  }

  loadProduct(id: string) {
    this.productService.getById(id).subscribe(prod => {
      this.product = prod;
      this.loadSuggestedProducts(prod.id_categoria);
      this.loadCategoryName(prod.id_categoria);
    });
  }

  loadSuggestedProducts(categoryId: string) {
    this.productService.getByCategory(categoryId).subscribe(products => {
      this.suggestedProducts = products.filter(p => p.id !== this.product?.id);
    });
  }

  loadCategoryName(categoryId: string) {
    this.categoryService.getCategoryById(categoryId).subscribe(cat => {
      console.log('Categoria caricata:', cat);
      this.categoryName = cat.name;
    });
  }

  increaseQty() {
    this.quantity++;
  }

  decreaseQty() {
    if (this.quantity > 1) this.quantity--;
  }
  submitStarReview(star: number) {
  this.selectedRating = star;

  if (!this.product?.id) return;

  this.reviewsService.addReview(this.product.id, star).subscribe({
    next: () => {
      console.log("recensione fatta");
    },
    error: (err) => {
      console.error(err);
      alert('Errore durante l\'invio della recensione');
    }
  });
}

buyNow(){

}

  addToCart() {

    if (!this.product?.id) {
      alert('Prodotto non disponibile');
      return;
    }

    this.cartService.addToCart(this.product.id!, this.quantity).subscribe({
      next: (res) => {
        console.log('Prodotto aggiunto al carrello:', res);
        alert('Prodotto aggiunto con successo!');
      },
      error: (err) => {
        console.error('Errore:', err);
        alert(err.error?.error || 'Errore durante l\'aggiunta al carrello');
      }
    });
  }
}
