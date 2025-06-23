import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../entities/Product';
import { Router } from '@angular/router';


interface CartItem {
  id: string;
  quantity: number;
  product: Product;
  user:string;
}

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  products: any[] = [];
  checkout: any = null;
  orderConfirmed = false;

  errorMessage: string = '';
  cartItems: CartItem[] = [];
  protected router=inject(Router)
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
                  totalPrice: item.totalPrice
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



  destroyCheckout() {
    this.http.post<any>('/api/checkout/confirm', {}).subscribe({
      next: (res) => {
        console.log('Ordine confermato:', res);

        this.http.delete<any>('/api/checkout').subscribe({
          next: (deleteRes) => {
            console.log('Checkout eliminato:', deleteRes);
            this.cartItems = [];
            this.orderConfirmed = true;
            this.products = [];
            this.checkout = null;
            alert('Ordine confermato e spedito!');
          },
          error: (err) => {
            console.error('Errore durante l\'eliminazione del checkout:', err);
            alert('Errore nel completare l\'ordine.');
          }
        });
      },
      error: (err) => {
        console.error('Errore durante la conferma dell\'ordine:', err);
        alert('Impossibile confermare l\'ordine. Riprova.');
      }
    });
  }

  gotoHome(){
  this.router.navigate([''])
    .then(() => {
      window.location.reload();
  });

  }
}
