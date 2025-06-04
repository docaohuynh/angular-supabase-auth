import { inject, Injectable, signal, Signal } from '@angular/core';
import { AuthResponse, User } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthSupabaseService {
  supabase = inject(SupabaseService);
  
  private authState = signal<User | null>(null);
  private loadingState = signal<boolean>(true);

  authState$: Signal<User | null> = this.authState;
  loadingState$: Signal<boolean> = this.loadingState;
  constructor() {
    // Initialize auth state
    this.supabase.client.auth.getUser().then(({ data: { user } }) => {
      this.authState.set(user);
      this.loadingState.set(false);
    });

    // Listen for auth changes
    this.supabase.client.auth.onAuthStateChange((_event, session) => {
      this.authState.set(session?.user ?? null);
      console.log(session?.access_token);
      
    });
  }

  async signInWithEmail(email: string, password: string): Promise<AuthResponse> {
    return this.supabase.client.auth.signInWithPassword({
      email,
      password
    });
  }

  async signOut(): Promise<void> {
    await this.supabase.client.auth.signOut();
    this.authState.set(null);
  }

  get currentUser() {
    return this.supabase.client.auth.getUser();
  }

  get session() {
    return this.supabase.client.auth.getSession();
  }
 isAuthenticated(): boolean {
    return !!this.authState();
  }
} 