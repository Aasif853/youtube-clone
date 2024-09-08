import { Injectable, Signal, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  public loading = signal(false);

  private progressSubject = new BehaviorSubject<boolean>(false);

  isLoading$ = this.progressSubject.asObservable();

  showLoadingSpinner() {
    this.loading.set(true);
    this.progressSubject.next(true);
    console.log('Loading spinner shown'); // Log when loading spinner is shown
    // Logic to show loading spinner UI element
  }

  hideLoadingSpinner() {
    this.loading.set(false);
    this.progressSubject.next(false);
    console.log('Loading spinner hidden'); // Log when loading spinner is hidden
    // Logic to hide loading spinner UI element
  }

  isLoading(): Signal<boolean> {
    return this.loading;
  }
}
