import { createClient } from '@supabase/supabase-js'

// Use your Supabase URL and SERVICE ROLE KEY (from Supabase project settings)
// ⚠️ NEVER include this key in client-side code
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.EXPO_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)
