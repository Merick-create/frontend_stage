import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

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

@Component({
  selector: 'app-cart',
  standalone:false,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  loading = true;
  errorMessage: string | null = null; // Aggiunto per gestire i messaggi di errore

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchCart();
  }

  fetchCart(): void {
    this.loading = true;
    this.errorMessage = null;
    this.http.get<CartItem[]>('/api/cart').subscribe({
      next: (data) => {
        this.cartItems = data.map(item => ({
          ...item,
          _id: item.id
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Errore nel recupero del carrello', err);
        this.errorMessage = 'Errore nel caricamento del carrello';
        this.loading = false;
      },
    });
  }

  getTotalPerItem(item: CartItem): number {
    return item.quantity * item.product.price;
  }

  getCartTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + this.getTotalPerItem(item), 0);
  }

  increaseQuantity(item: CartItem): void {
    const newQuantity = item.quantity + 1;
    this.updateQuantity(item, newQuantity);
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      const newQuantity = item.quantity - 1;
      this.updateQuantity(item, newQuantity);
    }
  }

  private updateQuantity(item: CartItem, newQuantity: number): void {
    this.errorMessage = null; // Resetta il messaggio di errore prima di ogni operazione
    const oldQuantity = item.quantity;
    
    // Aggiornamento ottimistico
    item.quantity = newQuantity;
    
    this.http.patch<CartItem>(`/api/cart/${item.id}`, { quantity: newQuantity }).subscribe({
      next: (updatedItem) => {
        const index = this.cartItems.findIndex(i => i.id === updatedItem.id);
        if (index !== -1) {
          this.cartItems[index].quantity = updatedItem.quantity;
        }
      },
      error: (err: HttpErrorResponse) => {
        // Ripristina la quantità precedente
        item.quantity = oldQuantity;
        
        // Estrai il messaggio di errore dalla risposta
        if (err.status === 400 && err.error && err.error.error) {
          this.errorMessage = err.error.error; // "Quantità richiesta (21) superiore alla disponibilità (20)"
        } else {
          this.errorMessage = 'Errore durante l\'aggiornamento della quantità';
        }
        
        console.error('Errore nell\'aggiornamento della quantità', err);
      }
    });
  }
  dismissError() {
    this.errorMessage = null;
  }

}