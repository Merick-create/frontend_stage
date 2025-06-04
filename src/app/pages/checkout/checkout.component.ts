import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  products: any[] = [];
  checkout: any = null;

  constructor(private http: HttpClient, public auth: AuthService) {}

  ngOnInit(): void {
    this.loadCheckout();
    }
  loadCheckout() {
    this.http.get<any>('/api/checkout').subscribe({
      next: (checkoutData) => {
        if (checkoutData && checkoutData.obj) {
          const items = checkoutData.obj;
          this.checkout = checkoutData;
          items.forEach((item: any) => {
            const productId = item.productId;
            this.http.get(`/api/product/get/${productId}`).subscribe({
              next: (productData) => {
                this.products.push({
                  product: productData,
                  quantity: item.quantity,
                  price: item.price,
                  totalPrice:item.totalPrice
                });
              },
              error: (err) => console.error(`Error fetching product with ID ${productId}:`, err)
            });
          });
        } else {
          console.warn('Checkout data is not in the expected format.');
        }
      },
      error: (error) => {
        console.error('Error loading checkout:', error);
      }
    });
  }

}