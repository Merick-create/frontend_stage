import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddProdcutDTO,OptionalProductDTO,Product } from '../entities/Product';


@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {
   private apiUrl = 'http://localhost:3000/api/product';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/lista`);
  }

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/get/${id}`);
  }

  getByName(name: string): Observable<Product[]> {
    const params = new HttpParams().set('name', name);
    return this.http.get<Product[]>(`${this.apiUrl}/getByname`, { params });
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/add`, product);
  }
  getProductsByName(query: { name: string }): Observable<any[]> {
  return this.http.get<any[]>(`/api/products/search`, { params: query });
}
getByCategory(categoryId: string): Observable<Product[]> {
  return this.http.get<Product[]>(`${this.apiUrl}/products/${categoryId}`);
}
}
