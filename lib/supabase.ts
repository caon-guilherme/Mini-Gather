import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

const isPlaceholder = !supabaseUrl || !supabaseAnonKey || supabaseUrl === 'SEU_URL' || supabaseAnonKey === 'SUA_KEY';


// Mock client to prevent crashes during development if keys are missing
const mockSupabase = {
  channel: () => ({
    on: () => ({
      subscribe: (cb: (status: string) => void) => {
        if (cb) cb('CHANNEL_ERROR');
        return { send: () => {} };
      },
    }),
    send: () => {},
    subscribe: () => ({ send: () => {} }),
  }),
  removeChannel: () => {},
} as any;

export const supabase = isPlaceholder 
  ? mockSupabase 
  : createClient(supabaseUrl, supabaseAnonKey);
