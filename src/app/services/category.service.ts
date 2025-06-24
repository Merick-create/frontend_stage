import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../entities/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
   private apiUrl = 'http://localhost:3000'
  constructor(private http: HttpClient) { }

  getCategoryById(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/api/category/category/${id}`);
  }

  getAllCategories() {
    return this.http.get<{ _id: string; name: string, img:string }[]>(`${this.apiUrl}/api/category/categories`);
  }
}
