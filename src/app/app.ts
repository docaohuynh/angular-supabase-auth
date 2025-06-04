import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { AuthSupabaseService } from './supabase-auth.service';
import { SupabaseService } from './supabase.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule,
    ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'angular-supabase-auth';
  supabaseAuth = inject(AuthSupabaseService)
  supabase = inject(SupabaseService)
  loginForm: FormGroup;

  // Signals to track login state
  isLoading = signal(false);
  loginError = signal<string | null>(null);
  isLoggedIn = signal(false);

  dataLoading = signal(false);
  data = signal<any[]>([]);
  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  async onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.loginError.set(null);

    const { username, password } = this.loginForm.value;
    console.log(username, password);
    
    const res = await this.supabaseAuth.signInWithEmail(username, password)
    console.log(res);
    
    this.isLoading.set(false);
  }

  async getTodo() {
    this.data.set([]);
    this.dataLoading.set(true);
    let { data, error } = await this.supabase.client
        .from('test')
        .select('*')
    if (!error) {
      this.data.set(data || []);
    }
        this.dataLoading.set(false);
    }
    
 }
