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

  constructor(private http: HttpClient, public auth: AuthService) {}

  ngOnInit(): void {
    this.loadCheckout();
  }

  loadCheckout() {
    this.http.get<any>('/api/checkout').subscribe({
      next: (checkoutData) => {
        console.log('Checkout Data:', checkoutData); // ADDED LOG
        if (checkoutData && checkoutData.obj) {
          const productIds = checkoutData.obj.map((item: any) => item.productId);
          console.log('Product IDs:', productIds);

          productIds.forEach((id: string) => {
            this.http.get(`/api/products/${id}`).subscribe({
              next: (productData) => {
                console.log('Product details for ID', id + ':', productData); // ADDED LOG
                this.products.push(productData);
              },
              error: (err) => console.error(`Error fetching product with ID ${id}:`, err)
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