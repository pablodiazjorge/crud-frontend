import { Injectable } from "@angular/core";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

@Injectable({ providedIn: "root" })
export class SupabaseService {
  public supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = (window as any)._env_.SUPABASE_URL;
    const supabaseAnonKey = (window as any)._env_.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase environment variables not set');
    }

    this.supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
}