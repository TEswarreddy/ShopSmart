import { Component } from '@angular/core';
import { ProductList } from './product-list/product-list';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductList],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {

}
