import { Component, inject, OnInit } from '@angular/core';
import { Product, AddProdcutDTO,OptionalProductDTO} from '../../entities/Product';
import { ProductServiceService } from '../../services/product-service.service';
import { CartService } from '../../services/cart.service';
import { Category } from '../../entities/category';
import { CategoryService } from '../../services/category.service';
import { AuthService } from '../../services/auth.service';
import { map } from 'rxjs';

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
  isAdmin = true;
  showModal = false;
  categories:Category[]=[];
  cartTotal = 0;
  cartQuantity = 0;
  protected LoginSrv=inject(AuthService)
  protected role$ = this.LoginSrv.currentUser$.pipe(
    map(user => user?.firstName ?? '')
  );
  closeModal(event: MouseEvent) {
    this.showModal = false;
  }
  showSideCart = false;
  product: Product | null = null;
  quantity: number = 1;

  constructor(private productService: ProductServiceService,
    private cartService:CartService,
    private categoryService:CategoryService
  ) {}

  ngOnInit() {

    this.fetchProducts();
    this.cartService.getCartTotal().subscribe(total => this.cartTotal = total);
    this.cartService.getCartQuantity().subscribe(qty => this.cartQuantity = qty);

    this.categoryService.getAllCategories().subscribe({
      next: (data: Category[]) => this.categories = data,
      error: (err: any) => console.error('Errore categorie', err)
    });

    this.role$.subscribe(roleValue => {
      this.isAdmin = roleValue === 'admin';
    });
  }

  fetchProducts() {
    this.productService.getAll().subscribe({
      next: data => {
        this.products = data.filter(p => p.quantity > 0);
      },
      error: err => {
        this.errorMessage = 'Errore nel caricamento prodotti';
        console.error(err);
      }
    });
  }


  searchProducts() {
    if (this.searchTerm.trim()) {
      this.productService.getByName(this.searchTerm).subscribe({
        next: data => {
          // Filtra anche i risultati della ricerca
          this.products = data.filter(p => p.quantity > 0);
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
}
