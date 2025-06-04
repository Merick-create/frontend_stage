import { Component,OnInit } from '@angular/core';
import { ProductServiceService } from '../../services/product-service.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../entities/Product';
import { CategoryService } from '../../services/category.service';

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

  constructor(
    private route: ActivatedRoute,
    private productService: ProductServiceService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(id);
    }
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

  addToCart() {
    console.log('Aggiunto al carrello:', this.product, 'Quantità:', this.quantity);
  }
}
