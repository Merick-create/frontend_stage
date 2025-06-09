import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = 'http://localhost:3000/api/cart';
  constructor(private http: HttpClient) { }


   addToCart(productId: string, quantity: number) {
    const token = localStorage.getItem('token'); // o dove tieni il JWT
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(`${this.baseUrl}/`, {
      productId,
      quantity
    }, { headers });
  }
}
