import { createClient } from '@supabase/supabase-js'


const {VITE_SUPABASE_KEY, VITE_SUPABASE_URL} = import.meta.env

const supabaseUrl = VITE_SUPABASE_URL
const supabaseKey = VITE_SUPABASE_KEY

 export const supabase = createClient(supabaseUrl, supabaseKey)