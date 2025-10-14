import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  busyRequestCount = signal(0); //explain this line: it creates a signal to track the number of active requests

  busy() {
    this.busyRequestCount.update(current => current + 1); //explain this line: it increments the count of active requests
  }

  idle() {
    this.busyRequestCount.update(current => Math.max(0, current - 1));//explain this line: it decrements the count of active requests but ensures it doesn't go below zero
  }
}