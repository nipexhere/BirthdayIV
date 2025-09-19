import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pnaoimwkyetvgowmiysu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuYW9pbXdreWV0dmdvd21peXN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNzM2OTYsImV4cCI6MjA3Mzg0OTY5Nn0.erujFApXWSluBYeufIAZAArngRWzx_GZMcmNJtdgXbQ';
export const supabase = createClient(supabaseUrl, supabaseKey);