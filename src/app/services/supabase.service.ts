import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  public supabase: SupabaseClient;

  private supabaseUrl = environment.SUPABASE_URL;
  private supabaseAnonKey = environment.SUPABASE_ANON_KEY;

  constructor() {
    if (!this.supabaseUrl || !this.supabaseAnonKey) {
      throw new Error('Supabase environment variables not set');
    }
    this.supabase = createClient(this.supabaseUrl, this.supabaseAnonKey);
  }
}
