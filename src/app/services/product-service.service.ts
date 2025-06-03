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

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/lista`);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/get/${id}`);
  }


  addProduct(product: AddProdcutDTO): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/add`, product);
  }

  searchProducts(queryParams: OptionalProductDTO): Observable<Product[]> {
    let params = new HttpParams();
    for (const key in queryParams) {
      if (queryParams.hasOwnProperty(key) && queryParams[key as keyof OptionalProductDTO] !== undefined && queryParams[key as keyof OptionalProductDTO] !== null) {
        params = params.append(key, queryParams[key as keyof OptionalProductDTO]!.toString());
      }
    }
   
    return this.http.get<Product[]>(`${this.apiUrl}/getByname`, { params });
  }
}
