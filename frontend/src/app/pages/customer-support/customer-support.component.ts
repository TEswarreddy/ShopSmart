import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
  typing?: boolean;
}

@Component({
  selector: 'app-customer-support',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './customer-support.html',
  styleUrl: './customer-support.css'
})
export class CustomerSupportComponent {
  messages = signal<Message[]>([
    {
      id: '1',
      text: 'Hello! 👋 Welcome to ShopSmart Live Support. How can we help you today?',
      sender: 'support',
      timestamp: new Date(Date.now() - 5 * 60000)
    }
  ]);

  responseMessages = [
    'Thank you for reaching out! We appreciate your question.',
    'I understand your concern. Let me help you with that.',
    'Great question! Here\'s what I can help you with...',
    'I\'m here to assist! Could you provide more details?',
    'Sure! I\'d be happy to help you with that.',
    'We\'re committed to resolving your issue quickly.',
    'Let me check that information for you.',
    'Thank you for being a valued ShopSmart customer!'
  ];

  messageInput = signal('');
  isLoading = signal(false);
  isChatOpen = signal(false);
  agentStatus = signal<'online' | 'away' | 'offline'>('online');
  unreadCount = signal(1);
  estimatedWaitTime = signal('< 1 minute');

  toggleChat(): void {
    this.isChatOpen.update(v => !v);
    if (!this.isChatOpen()) {
      this.unreadCount.set(0);
    }
  }

  sendMessage(): void {
    const text = this.messageInput().trim();
    if (!text) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    this.messages.update(m => [...m, userMessage]);
    this.messageInput.set('');
    this.isLoading.set(true);

    // Simulate support response
    setTimeout(() => {
      const randomResponse = this.responseMessages[
        Math.floor(Math.random() * this.responseMessages.length)
      ];

      const supportMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'support',
        timestamp: new Date()
      };

      this.messages.update(m => [...m, supportMessage]);
      this.isLoading.set(false);
    }, 1000);
  }

  getStatusColor(): string {
    const status = this.agentStatus();
    return status === 'online' ? '#27ae60' : status === 'away' ? '#f39c12' : '#95a5a6';
  }
}
