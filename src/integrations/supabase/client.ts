// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://rtfohabhndcfspalpozt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0Zm9oYWJobmRjZnNwYWxwb3p0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMDA1NDIsImV4cCI6MjA2NjY3NjU0Mn0.722qBZveiU4iaYj-cXBr2WdcKGvUZl-c4HUDeMFW8xY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);