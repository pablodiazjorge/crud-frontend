import { Injectable } from "@angular/core";
import { environment } from '../../environments/environment.development';
import { createClient, SupabaseClient } from "@supabase/supabase-js";

@Injectable({ providedIn: "root" })
export class SupabaseService {
  public supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = environment.SUPABASE_URL;
    const supabaseAnonKey = environment.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase environment variables not set');
    }

    this.supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
}