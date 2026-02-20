import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Deal {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
  endsIn: number; // minutes
  category: string;
  rating: number;
  reviews: number;
}

@Component({
  selector: 'app-todays-deals',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './todays-deals.html',
  styleUrl: './todays-deals.css'
})
export class TodaysDealComponent {
  deals: Deal[] = [
    {
      id: '1',
      title: 'Premium Wireless Headphones',
      price: 2499,
      originalPrice: 4999,
      discount: 50,
      image: '🎧',
      endsIn: 45,
      category: 'Electronics',
      rating: 4.5,
      reviews: 1240
    },
    {
      id: '2',
      title: 'Cotton T-Shirt Pack (3 pieces)',
      price: 399,
      originalPrice: 999,
      discount: 60,
      image: '👕',
      endsIn: 120,
      category: 'Fashion',
      rating: 4.3,
      reviews: 856
    },
    {
      id: '3',
      title: 'Stainless Steel Kitchen Knife Set',
      price: 1299,
      originalPrice: 2999,
      discount: 57,
      image: '🔪',
      endsIn: 90,
      category: 'Home & Kitchen',
      rating: 4.7,
      reviews: 2103
    },
    {
      id: '4',
      title: 'Face Mask (30-pack)',
      price: 349,
      originalPrice: 899,
      discount: 61,
      image: '😷',
      endsIn: 75,
      category: 'Beauty & Healthcare',
      rating: 4.4,
      reviews: 567
    },
    {
      id: '5',
      title: 'USB-C Phone Charger 65W',
      price: 799,
      originalPrice: 1999,
      discount: 60,
      image: '⚡',
      endsIn: 180,
      category: 'Electronics',
      rating: 4.6,
      reviews: 3421
    },
    {
      id: '6',
      title: 'yoga Mat (6mm thick)',
      price: 599,
      originalPrice: 1599,
      discount: 63,
      image: '🧘',
      endsIn: 240,
      category: 'Sports',
      rating: 4.5,
      reviews: 1892
    },
    {
      id: '7',
      title: 'Smart LED Bulb Set (4 pcs)',
      price: 1999,
      originalPrice: 4999,
      discount: 60,
      image: '💡',
      endsIn: 150,
      category: 'Electronics',
      rating: 4.8,
      reviews: 2654
    },
    {
      id: '8',
      title: 'Coffee Maker 1.2L',
      price: 1499,
      originalPrice: 3499,
      discount: 57,
      image: '☕',
      endsIn: 200,
      category: 'Kitchen',
      rating: 4.4,
      reviews: 945
    }
  ];

  getTimeText(minutes: number): string {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h`;
  }

  getProgressPercentage(endsIn: number): number {
    const totalTime = 240; // max time in minutes
    return (endsIn / totalTime) * 100;
  }

  isFastSelling(reviews: number): boolean {
    return reviews > 2000;
  }
}
