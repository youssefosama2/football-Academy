import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://fouunhyjsirlhoectsya.supabase.co"
const supabaseKey = "sb_publishable_sjC2dy9cUqtTyJpcAGdaAA_gZRJOvCF"

export const supabase = createClient(supabaseUrl, supabaseKey)