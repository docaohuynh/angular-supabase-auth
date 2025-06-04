
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient('https://xxx.supabase.co', 'xxx')
  }

  get client(): SupabaseClient {
    return this.supabase;
  }
} 