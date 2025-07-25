import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://vvllpxejmairizoagesv.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2bGxweGVqbWFpcml6b2FnZXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0Mjc2NjQsImV4cCI6MjA2OTAwMzY2NH0.X0jL_xf40lNpoTCBJu7_QSC3xRURcRZ_emAHVpklsiA"

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
