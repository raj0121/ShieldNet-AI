import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: 'admin' | 'analyst' | 'user';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          role?: 'admin' | 'analyst' | 'user';
        };
        Update: {
          full_name?: string;
          role?: 'admin' | 'analyst' | 'user';
        };
      };
      threats: {
        Row: {
          id: string;
          user_id: string;
          threat_type: string;
          severity: 'low' | 'medium' | 'high' | 'critical';
          description: string;
          status: 'active' | 'investigating' | 'resolved';
          detected_at: string;
          resolved_at: string | null;
          metadata: any;
          created_at: string;
        };
        Insert: {
          user_id: string;
          threat_type: string;
          severity: 'low' | 'medium' | 'high' | 'critical';
          description: string;
          status?: 'active' | 'investigating' | 'resolved';
          metadata?: any;
        };
        Update: {
          status?: 'active' | 'investigating' | 'resolved';
          resolved_at?: string | null;
          metadata?: any;
        };
      };
      monitoring_sessions: {
        Row: {
          id: string;
          user_id: string;
          platform: string;
          status: 'active' | 'paused' | 'stopped';
          threats_detected: number;
          started_at: string;
          ended_at: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          platform: string;
          status?: 'active' | 'paused' | 'stopped';
          threats_detected?: number;
        };
        Update: {
          status?: 'active' | 'paused' | 'stopped';
          threats_detected?: number;
          ended_at?: string | null;
        };
      };
    };
  };
};