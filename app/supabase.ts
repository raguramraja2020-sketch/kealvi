
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://psoffwnlxrneuhkjtvqq.supabase.co";

const supabaseKey = "sb_publishable_xJjKhLlqQBroATbCXAbSig_busa-xHA";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);