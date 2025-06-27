import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gyvgdsbxheechtpnpkko.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5dmdkc2J4aGVlY2h0cG5wa2tvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDg3MzQ2MywiZXhwIjoyMDY2NDQ5NDYzfQ.Y3i3K-MNG24EUvEZR5xzKCPADE3c2rtLNheimQnqSHU';

export const supabase = createClient(supabaseUrl, supabaseKey); 