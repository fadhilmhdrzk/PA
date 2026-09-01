import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rllyqwasgmxgodcjsftr.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsbHlxd2FzZ214Z29kY2pzZnRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0MDcxNzksImV4cCI6MjEwMTk4MzE3OX0.sZi1iZ3qUGi0ZaHDgm8fQnFCGkSb7y3VNbCmgMnGvzs'

export const isSupabaseConfigured = true

export const supabase = createClient(supabaseUrl, supabaseAnonKey)



