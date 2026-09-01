import { createClient } from '@supabase/supabase-js'

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
)

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder'

if (!isSupabaseConfigured) {
  console.warn("VITE_SUPABASE_URL atau VITE_SUPABASE_ANON_KEY belum dikonfigurasi di Environment Variables Vercel.")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)


