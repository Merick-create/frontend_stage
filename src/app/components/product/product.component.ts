import { Component, OnInit } from '@angular/core';
import { Product, AddProdcutDTO,OptionalProductDTO} from '../../entities/Product';
import { ProductServiceService } from '../../services/product-service.service';

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

  
  showSideCart = false;

  // Nuove proprietà per dettaglio prodotto
  product: Product | null = null;  // prodotto selezionato per dettaglio
  quantity: number = 1;            // quantità selezionata nel dettaglio

  constructor(private productService: ProductServiceService) {}

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.productService.getAll().subscribe({
      next: data => {
        this.products = data;
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
          this.products = data;
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

  // Nuovi metodi per dettaglio prodotto

  selectProduct(product: Product) {
    this.product = product;
    this.quantity = 1;
  }

  increaseQty() {
    this.quantity++;
  }

  decreaseQty() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    if (!this.product) return;
    // Qui metti la logica per aggiungere al carrello, ad esempio:
    console.log(`Aggiunto al carrello: ${this.product.name} x${this.quantity}`);
    // Eventualmente mostra messaggi, ecc.
  }

  // Metodo per tornare alla lista prodotti (nascondendo dettaglio)
  backToList() {
    this.product = null;
  }


  toggleSideCart() {
    this.showSideCart = !this.showSideCart;
  }

}
