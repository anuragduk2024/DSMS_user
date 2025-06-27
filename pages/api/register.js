import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { email, username, password, phone_number, district, panchayath, user_role } = req.body;
  if (!email || !username || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const { data, error } = await supabase
    .from('users')
    .insert([{ email, username, password, phone_number, district, panchayath, user_role }])
    .select('id, email, username, phone_number, registered_date, district, panchayath, user_role')
    .single();
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  return res.status(200).json({ user: data });
} 