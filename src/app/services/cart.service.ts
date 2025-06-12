// cart.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  img: string;
}

interface CartItem {
  id: string;
  quantity: number;
  product: Product;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = 'http://localhost:3000/api/cart';
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.fetchCart().subscribe(); // inizializza lo stato
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  addToCart(productId: string, quantity: number) {
    const headers = this.getAuthHeaders();
    return this.http.post<CartItem>(`${this.baseUrl}/`, { productId, quantity }, { headers }).pipe(
      tap(() => this.fetchCart().subscribe()) // aggiorna lo stato dopo aggiunta
    );
  }

  fetchCart(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(this.baseUrl, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(items => this.cartItemsSubject.next(items))
    );
  }

  getCartTotal(): Observable<number> {
    return this.cartItems$.pipe(
      map(items => items.reduce((sum, item) => sum + item.quantity * item.product.price, 0))
    );
  }

  getCartQuantity(): Observable<number> {
    return this.cartItems$.pipe(
      map(items => items.reduce((sum, item) => sum + item.quantity, 0))
    );
  }
}
