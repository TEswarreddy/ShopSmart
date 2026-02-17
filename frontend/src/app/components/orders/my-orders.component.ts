import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-orders',
  standalone: true,
   imports: [CommonModule],
  templateUrl: './my-orders.component.html'
})
export class MyOrdersComponent implements OnInit {

  orders: any[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orderService.getMyOrders().subscribe((res: any) => {
      this.orders = res;
    });
  }
}
