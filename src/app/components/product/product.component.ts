import { Component, inject, OnInit } from '@angular/core';
import { Product, OptionalProductDTO } from '../../entities/Product';
import { ProductServiceService } from '../../services/product-service.service';
import { CartService } from '../../services/cart.service';
import { Category } from '../../entities/category';
import { CategoryService } from '../../services/category.service';
import { AuthService } from '../../services/auth.service';
import { map } from 'rxjs';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  standalone: false,
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  errorMessage: string | null = null;
  newProduct: Product = {
    id_categoria: '',
    name: '',
    price: 0,
    description: '',
    quantity: 0,
    img: ''
  };
  searchTerm: string = '';
  showModal = false;
  showEditQuantityModal = false;
  selectedProductToEdit: Product | null = null;
  newQuantity: number = 0;

  categories: Category[] = [];
  cartTotal = 0;
  cartQuantity = 0;
  showSideCart = false;
  quantity: number = 1;

  protected LoginSrv = inject(AuthService);
  protected role$ = this.LoginSrv.currentUser$.pipe(
    map(user => user?.role ?? '')
  );
  protected router = inject(Router);

  constructor(
    private productService: ProductServiceService,
    private cartService: CartService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.fetchProducts();
    this.cartService.getCartTotal().subscribe(total => this.cartTotal = total);
    this.cartService.getCartQuantity().subscribe(qty => this.cartQuantity = qty);

    this.categoryService.getAllCategories().subscribe({
      next: data => this.categories = data,
      error: err => console.error('Errore categorie', err)
    });
  }

  fetchProducts() {
    this.role$.pipe(take(1)).subscribe(role => {
      this.productService.getAll().subscribe({
        next: data => {
          this.products = role === 'Admin' ? data : data.filter(p => p.quantity > 0);
        },
        error: err => {
          this.errorMessage = 'Errore nel caricamento prodotti';
          console.error(err);
        }
      });
    });
  }

  searchProducts() {
    this.role$.pipe(take(1)).subscribe(role => {
      if (this.searchTerm.trim()) {
        this.productService.getByName(this.searchTerm).subscribe({
          next: data => {
            this.products = role === 'Admin' ? data : data.filter(p => p.quantity > 0);
          },
          error: err => {
            this.errorMessage = 'Errore nella ricerca prodotti';
            console.error(err);
          }
        });
      } else {
        this.fetchProducts();
      }
    });
  }

  addProduct() {
    this.productService.addProduct(this.newProduct).subscribe({
      next: () => {
        this.fetchProducts();
        this.newProduct = {
          id_categoria: '',
          name: '',
          price: 0,
          description: '',
          quantity: 0,
          img: ''
        };
        this.showModal = false;
      },
      error: err => {
        this.errorMessage = 'Errore nell\'aggiunta del prodotto';
        console.error(err);
      }
    });
  }

  toggleSideCart() {
    this.showSideCart = !this.showSideCart;
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

  handleProductClick(product: Product) {
    this.role$.pipe(take(1)).subscribe(role => {
      if (role === 'Admin' && product.quantity === 0) {
        this.openEditQuantityModal(product);
      } else {
        if (product.id) {
          this.router.navigate(['/details', product.id]);
        } else {
          console.warn('Tentativo di navigazione per un prodotto senza ID:', product);
          alert('ID prodotto non disponibile per la navigazione.');
        }
      }
    });
  }

  openEditQuantityModal(product: Product) {
    this.selectedProductToEdit = { ...product };
    this.newQuantity = product.quantity;
    this.showEditQuantityModal = true;
  }

  updateProductQuantity() {
  if (this.selectedProductToEdit?.id) {
    const payload = {
      id: this.selectedProductToEdit.id,
      quantity: this.newQuantity
    };

    this.productService.updateQuantity(payload).subscribe({
      next: () => {
        this.fetchProducts();
        this.closeEditQuantityModal();
      },
      error: err => {
        console.error('Errore aggiornamento quantità:', err);
        alert('Errore durante l\'aggiornamento della quantità.');
      }
    });
  }
}


  closeEditQuantityModal() {
    this.showEditQuantityModal = false;
    this.selectedProductToEdit = null;
    this.newQuantity = 0;
  }

  closeModal(event: MouseEvent) {
    this.showModal = false;
  }
}
