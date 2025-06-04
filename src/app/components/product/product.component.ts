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

  constructor(private productService: ProductServiceService) {}

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.productService.getAll().subscribe(data => {
      this.products = data;
    });
  }

  searchProducts() {
    if (this.searchTerm.trim()) {
      this.productService.getByName(this.searchTerm).subscribe(data => {
        this.products = data;
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
      }
    });
  }
}
