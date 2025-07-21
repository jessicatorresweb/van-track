import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ysatomkjmufjrgalwvdt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzYXRvbWtqbXVmanJnYWx3dmR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwOTI3NzAsImV4cCI6MjA2ODY2ODc3MH0.Qp_9vaIgjsCICp2xnQRgDCIBapClYrj8ghSpNWmK3iQ'
  
//const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
//const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  },
})
