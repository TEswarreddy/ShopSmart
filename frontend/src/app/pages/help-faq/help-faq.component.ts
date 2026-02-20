import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface FAQItem {
  id: number;
  category: string;
  question: string;
  answer: string;
}

@Component({
  selector: 'app-help-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './help-faq.html',
  styleUrl: './help-faq.css'
})
export class HelpFaqComponent {
  expandedId = signal<number | null>(null);

  faqs: FAQItem[] = [
    {
      id: 1,
      category: 'Payments',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, net banking, UPI, and digital wallets like Google Pay, Apple Pay, and Amazon Pay.'
    },
    {
      id: 2,
      category: 'Payments',
      question: 'Is my payment secure?',
      answer: 'Yes, all payments are encrypted and processed through secure gateways. We follow PCI-DSS compliance standards.'
    },
    {
      id: 3,
      category: 'Shipping',
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 3-7 business days. Express shipping options are available for faster delivery (1-2 days).'
    },
    {
      id: 4,
      category: 'Shipping',
      question: 'Can I track my order?',
      answer: 'Yes, once your order ships, you\'ll receive a tracking number via email. You can track it in real-time through your account.'
    },
    {
      id: 5,
      category: 'Returns',
      question: 'What is your return policy?',
      answer: 'We offer 30-day returns for most items. The product must be in original condition with packaging intact.'
    },
    {
      id: 6,
      category: 'Returns',
      question: 'How long does a refund take?',
      answer: 'Refunds are processed within 7-10 business days after we receive your returned item and inspect it.'
    },
    {
      id: 7,
      category: 'Account',
      question: 'How do I create an account?',
      answer: 'Click on "Register" at the top of any page, fill in your email, password, and basic information, then verify your email.'
    },
    {
      id: 8,
      category: 'Account',
      question: 'How do I reset my password?',
      answer: 'Click "Forgot Password" on the login page, enter your email, and follow the instructions sent to your inbox.'
    }
  ];

  toggleFaq(id: number): void {
    this.expandedId.set(this.expandedId() === id ? null : id);
  }

  isFaqExpanded(id: number): boolean {
    return this.expandedId() === id;
  }
}
