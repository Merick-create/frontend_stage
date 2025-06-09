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
        // Filtra prodotti con quantità > 0
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

}
