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
  newProduct: AddProdcutDTO = {
    id_categoria: '',
    name: '',
    price: 0,
    description: '',
    quantity: 0,
    img: ''
  };
  searchName: string = '';
  selectedProductId: string = '';
  selectedProduct: Product | null = null;

  constructor(private productService: ProductServiceService) { }

  ngOnInit(): void {
    this.loadProducts();
  }
  loadProducts(): void {
    this.errorMessage = null;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        this.errorMessage = 'Errore durante il recupero dei prodotti: ' + (err.error?.error || err.message);
        console.error(err);
      }
    });
  }
  addNewProduct(): void {
    this.errorMessage = null;
    this.productService.addProduct(this.newProduct).subscribe({
      next: (product) => {
        this.products.push(product);
        this.resetNewProductForm();
        alert('Prodotto aggiunto con successo!');
      },
      error: (err) => {
        this.errorMessage = 'Errore durante l\'aggiunta del prodotto: ' + (err.error?.error || err.message);
        console.error(err);
      }
    });
  }

  searchProductsByName(): void {
    if (!this.searchName) {
      this.loadProducts(); 
      return;
    }

    this.errorMessage = null;
    const query: OptionalProductDTO = { name: this.searchName };
    this.productService.searchProducts(query).subscribe({
      next: (data) => {
        this.products = data;
        if (data.length === 0) {
          this.errorMessage = 'Nessun prodotto trovato con questo nome.';
        }
      },
      error: (err) => {
        this.errorMessage = 'Errore durante la ricerca dei prodotti: ' + (err.error?.error || err.message);
        console.error(err);
      }
    });
  }
  getProductDetails(): void {
    if (!this.selectedProductId) {
      this.selectedProduct = null;
      return;
    }

    this.errorMessage = null;
    this.productService.getProductById(this.selectedProductId).subscribe({
      next: (product) => {
        this.selectedProduct = product;
      },
      error: (err) => {
        this.selectedProduct = null;
        this.errorMessage = 'Prodotto non trovato o errore durante il recupero: ' + (err.error?.error || err.message);
        console.error(err);
      }
    });
  }

  private resetNewProductForm(): void {
    this.newProduct = {
      id_categoria: '',
      name: '',
      price: 0,
      description: '',
      quantity: 0,
      img: ''
    };
  }
}
