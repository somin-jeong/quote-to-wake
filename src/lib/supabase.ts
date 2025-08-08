import { createClient } from '@supabase/supabase-js'

// 하드코딩된 Supabase 설정
const supabaseUrl = 'https://qmxdglqmzwvnfjsscozb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFteGRnbHFtend2bmZqc3Njb3piIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NjgzMDQsImV4cCI6MjA3MDI0NDMwNH0.ijSg9ce-XGbeYns_Ty6E2WihDuP6cZiX5pt36-Dezc4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 