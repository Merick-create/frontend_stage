import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:3000/api'

  addReview(productId: string, rating: number) {
    return this.http.post(`${this.apiUrl}/product/${productId}/reviews/add`, { rating });
  }
}
